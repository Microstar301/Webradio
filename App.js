import React, {Component} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import RNTrackPlayer from 'react-native-track-player';

export default class Webradio extends Component {
  state = {
    textValue: 'stop',
  };

  buttonLabel = {
    startBut: 'Start Music',
    stopBut: 'Stop Music',
    pauseBut: 'Pause Music',
  };

  initPlayer = () => {
    RNTrackPlayer.setupPlayer().then(() => {
      console.log('Trackplayer set up!');
      var track = {
        id: 'unique track id', // Must be a string, required

        url: 'http://rfcmedia2.streamguys1.com/thirdrock.aac', // Load media from the network
        //url: require('./avaritia.ogg'), // Load media from the app bundle
        //url: 'file:///storage/sdcard0/Music/avaritia.wav' // Load media from the file system

        title: 'Third Rock Radio',
        artist: '-',
        album: 'while(1<2)',
        genre: '-',
        date: '2014-05-20T07:00:00+00:00', // RFC 3339

        artwork:
          'https://thirdrockradio.net/wp-content/uploads/2015/10/TRR_icon.png', // Load artwork from the network
        //artwork: require('./avaritia.jpg'), // Load artwork from the app bundle
        //artwork: 'file:///storage/sdcard0/Downloads/artwork.png' // Load artwork from the file system
      };
      RNTrackPlayer.add(track).then(function() {
        console.log('Tracks added');
      });
    });
  };

  stopMusic = () => {
    if (this.state.textValue == 'play' || this.state.textValue == 'pause') {
      RNTrackPlayer.stop();
      this.setState({
        textValue: 'stop',
      });
    }
  };

  pauseMusic = () => {
    if (this.state.textValue == 'play') {
      RNTrackPlayer.pause();
      this.setState({
        textValue: 'pause',
      });
    }
  };

  playMusic = () => {
    if (this.state.textValue == 'stop') {
      this.initPlayer();
      RNTrackPlayer.play();
      this.setState({
        textValue: 'play',
      });
    } else if (this.state.textValue == 'pause') {
      RNTrackPlayer.play();
      this.setState({
        textValue: 'play',
      });
    }
  };

  render() {
    return (
      <View style={webradioStyle.mainContainer}>
        <View style={webradioStyle.mainButton}>
          <Button
            title={this.buttonLabel.startBut}
            onPress={this.playMusic}
            style={webradioStyle.mainButton}
            color={'green'}
          />
        </View>
        <View style={webradioStyle.mainButton}>
          <Button
            title={this.buttonLabel.pauseBut}
            onPress={this.pauseMusic}
            style={webradioStyle.mainButton}
            color={'gray'}
          />
        </View>
        <View style={webradioStyle.mainButton}>
          <Button
            title={this.buttonLabel.stopBut}
            onPress={this.stopMusic}
            style={webradioStyle.mainButton}
            color={'red'}
          />
        </View>
        <View style={webradioStyle.mainButton}>
          <Text style={webradioStyle.mainText}>{this.state.textValue}</Text>
        </View>
      </View>
    );
  }
}

const webradioStyle = StyleSheet.create({
  mainContainer: {
    marginTop: 16,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  mainButton: {
    marginTop: 16,
  },
  mainText: {
    fontSize: 20,
  },
});
