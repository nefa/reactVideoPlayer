import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { partial } from 'lodash';
// import logo from './logo.svg';
import './App.css';
import vs from './videoService';


class VideoContainerCpt extends Component {
  static defaultProps = {
    data: {
      fps: null,
      url: null,
      
    }
  };

  constructor(props) {
    super(props);
    
    this.state = {
      plays: false,
      attrs: {
        width: '320px',
        height: '240px'
      },
      children: {}
    };

    this._video = null;
    this._seekInput = null;


  }

  componentWillMount() {
    this.togglePlay = this.togglePlay.bind(this);
    this.videoSpeed = this.videoSpeed.bind(this);
    this.seek = this.seek.bind(this);
    this.resize = this.resize.bind(this);
    this.fullscreen = this.fullscreen.bind(this);
  }

  componentDidMount() {
    console.log("mounted", this.props, this._video);
  }

  resize() {
    
    const attrs = {width: '500px'}
    this.setState({attrs})
  }

  togglePlay() {
    this.setState({plays: !this.state.plays});
    this.state.plays ?this.pause() : this.play();

  }

  play() {
    this._video.play();
    // console.log(this._video.duration)
  }

  pause() {
    this._video.pause();
  }

  seek() {
    // this._video.seek(this._seekInput.valueAsNumber);
    console.log(this._video)
  }

  videoSpeed(rate) {
    this._video.playbackRate = rate;
  }

  fullscreen() {
    this._video.webkitEnterFullscreen();
    this._video.controls = false;
  }

  renderVideoContainer(attrs, children) {
    const {url} = this.props.data;

    if (!url) return null;
    return (
      <video {...attrs} ref={vid => this._video = vid}>
        <source src={url} type="video/mp4" />
        {'Your browser does not support the video tag.'}
      </video>
    )
  }

  render() {
    const p = this.props;
    const {attrs, plays} = this.state;
    
    return(
      <div>
        {this.renderVideoContainer(attrs) || <span>spinner here</span>}

        <br/>
        <button onClick={this.togglePlay.bind}>{plays?'pause':'play'}</button> -||  
        <button onClick={partial(this.videoSpeed, 2)}>rate x 2</button> -||
        <button onClick={this.seek.bind}>seek</button> ++ || ++
        <button onClick={this.resize}>resize</button>
        <input className="main__input" defaultValue="30" type="number" min="0" max="60" step="1" 
          ref={s => this._seekInput = s}  />
        <br/>
        <br/>
        
        <br/>
        
        
        
        <button onClick={this.fullscreen.bind(this)}>fullscreen</button>
      </div>
    )
  }
}


class ContainerCpt extends Component {
  state = {
      isForm: true,
      isContainer: false,
      data: {}
    }

  constructor(props) {
    super(props);
    this.getTestVideo = this.getTestVideo.bind(this);
  }

  componentDidMount() {
    //initialize services
    this.getTestVideo();
  }

  getTestVideo() {
    vs.requestVideo('https://cdn.findie.me:8443/youtube/cfqAHfpQkno')
      .then( res => res.json())
      .then( video => {
        console.log(video);
        // this.setState({video})

      })
    const token = setInterval( ()=> {
      vs.requestVideo('https://cdn.findie.me:8443/fps/youtube/cfqAHfpQkno')
        .then( res => res.json())
        .then( data => {
          console.log(data);
          if(data.fps) clearInterval(token);
          this.setState({data});

        })
        .catch(err => console.log(err))
    }, 1500);
  }

  render() {
    const s = this.state;
    return(
      <div className="trialmaker">
      <h2>Trial maker spa</h2>
      <VideoContainerCpt data={s.data}></VideoContainerCpt>
        <br/>
        <hr/>
        <div className="videoControlls"></div>
        {/*<button onClick={this.getTestVideo}>test video url</button>*/}
      </div>
    )
  }
}


class App extends Component {
  render() {
    return (
      <div className="App">
      <ContainerCpt></ContainerCpt>
        
      </div>
    );
  }
}

export default App;
