# -*- coding: utf-8 -*-
"""
Created on Sat Sep 28 00:11:09 2019
@author: Daniel
"""
#import numpy as np
from flask import Flask
from flask import request
from gevent.pywsgi import WSGIServer
import json
import requests
import pandas as pd
import overpass
from haversine import haversine, Unit
from pandas.io.json import json_normalize
#from sklearn.cluster import DBSCAN
#from sklearn import metrics

api = overpass.API(timeout=900)
app = Flask(__name__)
urlin = '/app'
urlout = '/app/itinerary'
api_directions_url = 'https://maps.googleapis.com/maps/api/directions/json'

#interest_list = ["art","history","social"]

class new_list():
    def __init__(self, start_lat, start_lon, end_lat, end_lon):
        self.start_lat =  start_lat
        self.start_lon = start_lon
        self.end_lat = end_lat
        self.end_lon = end_lon
#         self.center = center
    def center(self):
        center_lat = (self.start_lat+ self.end_lat)/2
        center_lon = (self.start_lon+ self.end_lon)/2
        center = str(center_lat) + "," + str(center_lon )
        ##### distance
        center_location = (center_lat, center_lon)
        start_location = (float(self.start_lat), float(self.start_lon))
        distance  = haversine(center_location, start_location) *1000
        return center , int(distance)

class new_list2():
    def __init__(self, center, dist):
        self.center = center
        self.dist = dist
    def request(self):
        req = api.get("node(around:"+ str(self.dist)+ "," + self.center +");", verbosity='geom')
        requ = json_normalize(req["features"])
        requ = requ[requ["properties.name"].notnull()]
        requ["longitude"] = requ["geometry.coordinates"].apply(lambda x: x[0])
        requ["latitude"] = requ["geometry.coordinates"].apply(lambda x: x[1])
        ####filter if there is big brand if properties.brand is not null()
        ## and big companies can be filtered using this website https://www3.wipo.int/branddb/en/
#         requ = requ[requ["properties.brand"].isnull()]
        requ = requ[(requ["properties.amenity"]!="school") & (requ["properties.amenity"]!="bank")
                    & (requ["properties.amenity"]!="fast_food") & (requ["properties.amenity"]!="college") & (requ["properties.amenity"]!="post_office")]
        requ = requ[~(requ["properties.name"].str.contains("Street") | requ["properties.name"].str.contains("Avenue") | requ["properties.name"].str.contains("Road")
                     | requ["properties.name"].str.contains("Lane")  )]
        return requ  [["properties.addr:city", "properties.name","properties.addr:housenumber","properties.addr:postcode","properties.addr:street",
                    "properties.amenity","properties.historic","properties.shop","properties.office","properties.shop",
                    "properties.wheelchair","latitude","longitude"]]


@app.route(urlin, methods=['POST', 'GET'])
def request_itinery():
    #error = None
    if request.method == 'POST':
        location_start = request.form['location_start']
        location_end = request.form['location_end']
        interests = request.form['interests']
        length = request.form['length']

        start_lat = location_start[0]
        start_lon = location_start[1]
        end_lat =  location_end[0]
        end_lon =  location_end[1]

        center_location = new_list(start_lat, start_lon, end_lat, end_lon)
        center, dist  = center_location.center()

        req =  new_list2(center, dist)
        df = req.request()
        new = pd.DataFrame()

        for k in interests:
            if k == "art":
                data = df[(df.eq('art')| df.eq("Gallery")).any(axis=1)]
                data = data[["properties.name","latitude","longitude","properties.wheelchair"]]
                data["type"] = "art"
                new = new.append(data)
            elif k == "history":
                data2 = df[(df["properties.name"].str.contains("Museum"))] #|(df["properties.name"].str.contains("Church")) ]
                data2=  data2[data2["properties.historic"].notnull()]
                data2 = data2[["properties.name","latitude","longitude","properties.wheelchair"]]
                data2["type"] = "historic"
                new = new.append(data2)
                data3=  df[df["properties.historic"].notnull()]
                data3 = data3[["properties.name","latitude","longitude","properties.wheelchair"]]
                data3["type"] = "historic"
                new = new.append(data3)
            elif k =="social":
                ### hstorical pub
                data4 = df[df["properties.amenity"].notnull()]
                data4 = data4[(data4["properties.amenity"].str.contains("pub"))]#| (df["properties.amenity"].str.contains("cafe"))|(df["properties.amenity"].str.contains("restaurant"))]
                data4 = data4[["properties.name","latitude","longitude","properties.wheelchair"]]
                data4["type"] = "social"
                new = new.append(data4)

        data_out = new.to_json(orient='records')

#        coords = new.as_matrix(columns=["latitude","longitude"])
#        #earth radius
#        kms_per_radian = 6371.0088
#        epsilon = 0.3/kms_per_radian
#        
#        db = DBSCAN(eps=epsilon, min_samples=3, algorithm="ball_tree",metric = "haversine").fit(np.radians(coords)) 
#        cluster_labels = db.labels_
#        n_clusters = len(set(cluster_labels))
#        new["cluster_labels"] = Series(cluster_labels, index=new.index)
        
#        query= '?origin=' + start_lat + '%2C' + start_lon + '&destination=' + end_lat + '%2C' + start_lon + '&waypoint=' + way_lat + '%2C' + way_lon + '&key=AIzaSyCvk1meEdiCkKU2VxaG4HQX-KPKw4i-Iio'
        # Analyse post message at root /
        # load json
        # get api data
        # generate new json from string/dict

        # post message including converted json
        data_dummy = '''
        {
          "locations": [
            {
              "name": "location_1",
              "picture": "pic_url_1",
              "url": "url_1",
              "desc" : "desc_1",
              "type" : "art",
              "wheelchair" : "yes",
              "longitude": 100.0,
              "latitude": 100.0

            },
            {
              "name": "location_2",
              "picture": "pic_url_2",
              "url": "url_2",
              "desc" : "desc_2",
              "type" : "history",
              "wheelchair" : "limited",
              "longitude": 100.0,
              "latitude": 100.0
            },
          ]
        }
        '''
        #response = requests.post(urlout, data=data_dummy)
        return data_out
    else:
        return "You're not supposed to be here!"

if __name__ == '__main__':
    # Debug/Development
    # app.run(debug=True, host="0.0.0.0", port="5000")
    # Production
    http_server = WSGIServer(('', 5000), app)
    http_server.serve_forever()
