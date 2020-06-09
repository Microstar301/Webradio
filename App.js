import React, {Component} from 'react';
import {View, Text, StyleSheet, Button, FlatList, Image,ImageBackground} from 'react-native';
import RNTrackPlayer from 'react-native-track-player';

function Item({title, onPress, thumb}) {
  return (
    <View style={webradioStyle.item}>
      <Button title={title.toString()} style={'flex:1'} onPress={onPress} />
      <Image source={{uri: {thumb}.thumb}} style={webradioStyle.pic} />
    </View>
  );
}

const background_image = { uri: "https://thumbs.dreamstime.com/z/abstract-geometric-background-modern-overlapping-triangles-unusual-color-shapes-your-message-business-tech-presentation-app-53265512.jpg" };


export default class Webradio extends Component {
  state = {
    textValue: '',
    curTrack: '',
  };

  buttonLabel = {
    pauseTogg: 'Pause Music',
    stopBut: 'Stop Music',
  };

  initPlayer = () => {
    RNTrackPlayer.setupPlayer().then(() => {
      console.debug('Trackplayer set up!');
    });
  };

  addTrack = (tid, title, url, artwork) => {
    var track = {
      id: tid, // Must be a string, required
      url: url, // Load media from the network
      artist: 'Webradio',
      title: title,
      artwork: artwork, // Load artwork from the network
    };
    RNTrackPlayer.add(track).then(function() {
      console.debug('Tracks added');
    });
  };

  stopMusic = async () => {
    var state = await RNTrackPlayer.getState();
    if (
      state == RNTrackPlayer.STATE_PLAYING ||
      state == RNTrackPlayer.STATE_PAUSED
    ) {
      RNTrackPlayer.stop();
      this.setState({
        curTrack: '',
      });
      this.updateTrack();
    }
  };

  togglePauseMusic = async () => {
    var state = await RNTrackPlayer.getState();
    if (state == RNTrackPlayer.STATE_PLAYING) {
      RNTrackPlayer.pause();
      this.setState({
        textValue: 'pause',
      });
      this.buttonLabel.pauseTogg = 'Play Music';
    } else if (state == RNTrackPlayer.STATE_PAUSED) {
      RNTrackPlayer.play();
      this.buttonLabel.pauseTogg = 'Pause Music';
    }
  };

  playRadio = async (tid, title, url, artwork) => {
    this.initPlayer();
    this.addTrack(tid, title, url, artwork);
    RNTrackPlayer.play();
    this.updateTrack();
    //this.setState({
    //  curTrack: await RNTrackPlayer.getCurrentTrack(),
    //});
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

  updateTrack = async () => {
    var curTID = await RNTrackPlayer.getCurrentTrack();
    var curSname;
    this.state.dataSource.map(function(station) {
      if (station.station_id == curTID) {
        curSname = station.station_name;
      }
    });
    this.setState({
      curTrack: curSname,
    });
  };

  render() {
    this.showJSON();
    return (
      <View style={webradioStyle.mainContainer}>
        <ImageBackground source={background_image} style={webradioStyle.background_image}>
        <FlatList
          data={this.state.dataSource}
          renderItem={({item}) => (
            <Item
              title={item.station_id + ' ' + item.station_name}
              onPress={() =>
                this.playRadio(
                  item.station_id,
                  item.station_name,
                  item.station_url,
                  item.station_picture,
                )
              }
              thumb={item.station_picture}
            />
          )}
          keyExtractor={item => item.station_id}
        />
        <View style={webradioStyle.mainButton}>
          <Button
            title={this.buttonLabel.pauseTogg}
            onPress={this.togglePauseMusic}
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
          <Text style={webradioStyle.mainText}>{this.state.curTrack}</Text>
        </View>
        </ImageBackground>
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
  },
  mainButton: {
    marginTop: 16,
  },
  mainText: {
    fontSize: 20,
    color: '#000000',
    marginBottom: 8,
  },
  item: {
    backgroundColor: '#F0FF00',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  pic: {
    width: 250,
    height: 64,
    resizeMode: 'cover',
  },
  background_image: {
    flex: 1,
    width: '100%',
    height: '100%',
  }
});
