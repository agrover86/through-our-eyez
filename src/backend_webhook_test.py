# -*- coding: utf-8 -*-
"""
Created on Sat Sep 28 00:11:09 2019

@author: Daniel
"""

from flask import Flask
from flask import request
from gevent.pywsgi import WSGIServer
import json
import requests

app = Flask(__name__)
urlin = '/app'
urlout = '/app/itinerary'

with app.test_request_context(urlin, method='POST'):
    # now you can do something with the request until the
    # end of the with block, such as basic assertions:
    assert request.path == '/app'
    assert request.method == 'POST'

@app.route(urlin, methods=['POST', 'GET'])
def request_itinery():
    error = None
    if request.method == 'POST':
        location_start = request.form['location_start']
        location_end = request.form['location_end']
        interests = request.form['interests']
        length = request.form['length']
        
        # Analyse post message at root /
        # load json
        # get api data
        # generate new json from string/dict
        
        # post message including converted json
        
        data_dummy = {
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
        response = requests.post(urlout, data=json.dumps(data))
        return data
    else:
        return "You're not supposed to be here!"
    
if __name__ == '__main__':
    # Debug/Development
    # app.run(debug=True, host="0.0.0.0", port="5000")
    # Production
    http_server = WSGIServer(('', 5000), app)
    http_server.serve_forever()