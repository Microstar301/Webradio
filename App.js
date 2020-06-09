import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, FlatList} from 'react-native';
import RNTrackPlayer from 'react-native-track-player';

function Item({title, onPress}) {
  return (
    <View style={webradioStyle.item}>
      <Button title={title.toString()} style={'flex:1'} onPress={onPress} />
    </View>
  );
}

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
      console.debug('Trackplayer set up!');
    });
  };

  addTrack = (title, url, artwork) => {
    var track = {
      id: 'unique track id', // Must be a string, required

      url: url, // Load media from the network
      //url: require('./avaritia.ogg'), // Load media from the app bundle
      //url: 'file:///storage/sdcard0/Music/avaritia.wav' // Load media from the file system

      title: title,
      artist: '-',
      album: '-',
      genre: '-',
      date: '2014-05-20T07:00:00+00:00', // RFC 3339

      artwork: artwork, // Load artwork from the network
      //artwork: require('./avaritia.jpg'), // Load artwork from the app bundle
      //artwork: 'file:///storage/sdcard0/Downloads/artwork.png' // Load artwork from the file system
    };
    RNTrackPlayer.add(track).then(function() {
      console.debug('Tracks added');
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

  playRadio = (title, url, artwork) => {
    this.initPlayer();
    this.addTrack(title, url, artwork);
    RNTrackPlayer.play();
    this.setState({
      textValue: 'play',
    });
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

  showJSON = () => {
    fetch('https://protepto.com/stuff/mot/stations.php')
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          dataSource: responseJson,
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  render() {
    this.showJSON();
    return (
      <View style={webradioStyle.mainContainer}>
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => (
            <Item
              title={item.station_id + ' ' + item.station_name}
              onPress={() =>
                this.playRadio(
                  item.station_name,
                  item.station_url,
                  item.station_picture,
                )
              }
            />
          )}
          keyExtractor={item => item.station_id}
        />
        <Text>{this.state.data}</Text>
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
  item: {
    backgroundColor: '#F0FF00',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
