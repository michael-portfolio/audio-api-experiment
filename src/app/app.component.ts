import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'audio-api-experiment';
  audioContext: AudioContext;
  track: MediaElementAudioSourceNode;
  gainNode: GainNode;
  stereoPannerNode: StereoPannerNode;
  playButton: 'play' | 'pause' | 'stop' = 'play'
  volume: number;
  stereo: 'left' | 'right' | 'middle' = 'middle';
  @ViewChild('audio') audioElement: ElementRef;
  @ViewChild('volumeSlider', { static: true}) volumeSlider: ElementRef;
  @ViewChild('stereoPannerSlider', { static: true}) stereoPannerSlider: ElementRef;

  constructor() {
    this.audioContext = new AudioContext();
    this.gainNode = new GainNode(this.audioContext);
    this.stereoPannerNode = new StereoPannerNode(this.audioContext, { pan: 0});
  }

  ngOnInit(){
    this.volume = this.volumeSlider.nativeElement.value;
    const value = this.stereoPannerSlider.nativeElement.value;
    switch(value){
      case -1: {
        this.stereo = 'left';
        break;
      }
      case 0: {
        this.stereo = 'middle';
        break;
      }
      case 1: {
        this.stereo = 'right';
        break;
      }
      default: {
        break;
      }
    }
  }
  
  ngAfterViewInit() {
    this.track = this.audioContext.createMediaElementSource(this.audioElement.nativeElement);
    this.track.connect(this.stereoPannerNode).connect(this.gainNode).connect(this.audioContext.destination);
  }

  playAudio() {
    console.log(this.audioContext.state)
    if(this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // play or pause track depending on state
    switch (this.playButton) {
      case 'play': {
        this.audioElement.nativeElement.play();
        this.playButton = 'pause';
        break;
      }
      case 'pause': {
        this.audioElement.nativeElement.pause();
        this.playButton = 'play';
        break
      }
      default: {
        break;
      }
    }
  }

  stopAudio() {
    if(this.playButton === 'pause') {
      this.audioElement.nativeElement.pause();
      this.audioElement.nativeElement.currentTime = 0;
      this.playButton = 'play';
    }
  }

  changeVolume(event: Event) {
    const value = event.target['value'];
    this.gainNode.gain.value = value;
    this.volume = value;
  }
  
  changeStereo(event: Event) {
    const value = event.target['value'];
    this.stereoPannerNode.pan.value = value;
    this.stereo = value < -0.45 ? 'left' : (value > 0.45 ? 'right' : 'middle'); 
  }
}
