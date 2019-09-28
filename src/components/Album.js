import React, { Component } from 'react';
import PlayerBar from './PlayerBar';
import '../style/Album.css';



const albumData = {
  title: 'Walk Around East London',
  artist: 'Queen Mary',
  releaseInfo: '2018',
  albumCover: '/public/assets/images/QM.jpg',
  slug: 'the-colors',
  songs: [
      { title: 'QM Audio Walk 1', duration: '58', audioSrc: './assets/audio/QMAudioWalk1.mp3' },
      { title: 'QM Audio Walk 11', duration: '84', audioSrc: './assets/audio/QMAudioWalk11.mp3' },
      { title: 'QM Audio Walk 1', duration: '176', audioSrc: './assets/audio/QMAudioWalk12.mp3' }
  ]
}

class Album extends Component {

  constructor(props) {
    super(props);
    const album = albumData;
    this.state = {
      album: album,
      currentSong: album.songs[0],
      currentTime: 0,
      duration: album.songs[0].duration,
      volume: 0.8,
      isPlaying: false
    };

     this.audioElement = document.createElement('audio');
     this.audioElement.src = album.songs[0].audioSrc;
  }

  formatTime(time) {
     if(typeof time!=='number'){return "-:--";}
     const mins = Math.floor(time/60);
     const secs = Math.floor(time-(mins*60));
     if(secs<10){
       return mins+':0'+secs;
     }
    else{
       return mins+':'+secs;
     }
    }

  play() {
    this.audioElement.play();
    this.setState({ isPlaying: true });
  }
  pause() {
    this.audioElement.pause();
    this.setState({ isPlaying: false });
  }

  componentDidMount() {
    this.eventListeners = {
      timeupdate: e => {
        this.setState({ currentTime: this.audioElement.currentTime });
      },
      durationchange: e => {
        this.setState({ duration: this.audioElement.duration });
      }
    };
    this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
  }
  componentWillUnmount() {
    this.audioElement.src = null;
    this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate);
    this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange);
  }
   setSong(song) {
     this.audioElement.src = song.audioSrc;
     this.setState({ currentSong: song });
   }

   handleSongClick(song) {
    const isSameSong = this.state.currentSong === song;
    if (this.state.isPlaying && isSameSong) {
      this.pause(song);
    } else {
      if (!isSameSong) { this.setSong(song); }
      this.play(song);
    }
   }
   handlePrevClick() {
     const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
     const newIndex = Math.max(0, currentIndex - 1);
     const newSong = this.state.album.songs[newIndex];
     this.setSong(newSong);
     this.play(newSong);
  }

  handleNextClick() {
    const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
    const newIndex = Math.min(this.state.album.songs.length-1, currentIndex + 1);
    const newSong = this.state.album.songs[newIndex];
    this.setSong(newSong);
    this.play(newSong);
 }

  handleTimeChange(e) {
    const newTime = this.audioElement.duration * e.target.value;
    this.audioElement.currentTime = newTime;
    this.setState({ currentTime: newTime });
}
  handleVolumeChange(e) {
    this.audioElement.volume = e.target.value;
    this.setState({ volume: e.target.value });
  }

  render() {
    return (
      <section className="album">
      <section id="album-info">

         <h1 id="album-title">{this.state.album.artist} - {this.state.album.title}  </h1>
        <div className="album-details">

        </div>
      </section>

         <PlayerBar
            isPlaying={this.state.isPlaying}
            currentSong={this.state.currentSong}
            currentTime={this.formatTime(this.audioElement.currentTime)}
            duration={this.formatTime(this.audioElement.duration)}
            handleSongClick={() => this.handleSongClick(this.state.currentSong)}
            handlePrevClick={() => this.handlePrevClick()}
            handleNextClick={() => this.handleNextClick()}
            handleTimeChange={(e) => this.handleTimeChange(e)}
            handleVolumeChange={(e) => this.handleVolumeChange(e)}

        />

      </section>
    );
  }
}

export default Album;
