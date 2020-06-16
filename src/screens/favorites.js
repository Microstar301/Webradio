import React, {Component} from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import RNTrackPlayer from 'react-native-track-player';
import {Button, ThemeProvider} from 'react-native-elements';
import Icon from 'react-native-material-ui/src/Icon';
import TextTicker from 'react-native-text-ticker';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-community/async-storage';

// ON ERROR INSTALL THIS:
// https://github.com/xotahal/react-native-material-ui/blob/master/docs/GettingStarted.md
// npm install --save react-native-material-ui

//<Image source={{uri: {thumb}.thumb}} style={styles.pic} />
function Item({title, onPress, thumb}) {
  return (
    <View style={styles.items}>
      <Button
        title={title.toString()}
        style={styles.buttonStation}
        onPress={onPress}
        rounded={true}
        icon={<Image source={{uri: {thumb}.thumb}} style={styles.pic} />}
      />
    </View>
  );
}

const storeData = async (key, value) => {
  try {
    console.log(key + ' saved ' + value);
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // saving error
  }
};

class Favorites extends Component {
  Favorites({Navigation}) {
    this.updateJSON();
  }

  getData = async key => {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return JSON.parse(value);
      }
    } catch (e) {
      // error reading value
    }
  };

  state = {
    curTrack: '',
    curImg: 'https://protepto.com/stuff/mot/note.png',
  };

  buttonLabel = {
    pauseIcon: 'play-arrow',
    pauseTogg: 'Play',
    stopBut: 'stop',
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
      artist: '1',
      title: title,
      artwork: artwork, // Load artwork from the network
    };
    RNTrackPlayer.add(track).then(function() {
      console.debug('Tracks added');
    });
  };

  stopMusic = async () => {
    let vals = await this.getData('fstations');
    const state = await RNTrackPlayer.getState();
    if (
      state == RNTrackPlayer.STATE_PLAYING ||
      state == RNTrackPlayer.STATE_PAUSED
    ) {
      await RNTrackPlayer.stop();
      this.setPlay();
      this.setState({
        curImg: 'https://protepto.com/stuff/mot/note.png',
        curTrack: '',
      });
      await this.updateTrack();
    } else {
      this.onLaunch();
    }
  };

  setPause = () => {
    this.buttonLabel.pauseTogg = 'Pause';
    this.buttonLabel.pauseIcon = 'pause';
  };

  setPlay = () => {
    this.buttonLabel.pauseTogg = 'Play';
    this.buttonLabel.pauseIcon = 'play-arrow';
  };

  togglePauseMusic = async () => {
    AsyncStorage.clear();
    const state = await RNTrackPlayer.getState();
    if (state == RNTrackPlayer.STATE_PLAYING) {
      await RNTrackPlayer.pause().then(this.onLaunch());
    } else if (state == RNTrackPlayer.STATE_PAUSED) {
      await RNTrackPlayer.play().then(this.onLaunch);
    }
  };
  playRadio = async (tid, title, url, artwork) => {
    this.initPlayer();
    this.addTrack(tid, title, url, artwork);
    await RNTrackPlayer.play();
    this.setPause();
    await this.updateTrack();
    //this.setState({
    //  curTrack: await RNTrackPlayer.getCurrentTrack(),
    //});
  };

  updateJSON = () => {
    fetch('https://protepto.com/stuff/mot/stations.php')
      .then(response => response.json())
      .then(responseJson => {
        let st = [];
        responseJson.forEach(item => {
          if (item.station_id % 2 == 0) {
            st.push(parseInt(item.station_id));
          }
        });
        storeData('fstations', st);
        this.setState({
          dataSource: responseJson,
        });
        this.updateTrack();
      })
      .catch(error => {
        console.error(error);
      });
  };

  updateTrack = async () => {
    const curTID = await RNTrackPlayer.getCurrentTrack();
    let curStation = {};
    if (this.state.dataSource !== undefined) {
      this.state.dataSource.map(function(station) {
        if (station.station_id == curTID) {
          curStation = {
            name: station.station_name,
            img: station.station_picture,
          };
        }
      });
      if (curStation.name != undefined) {
        this.setState({
          curTrack: curStation.name,
          curImg: curStation.img,
        });
      } else {
        this.setState({
          curTrack: '',
          curImg: 'https://protepto.com/stuff/mot/note.png',
        });
      }
    } else {
      this.setState({
        curTrack: '',
        curImg: 'https://protepto.com/stuff/mot/note.png',
      });
    }
  };

  onLaunch = async () => {
    const state = await RNTrackPlayer.getState();
    if (
      state == RNTrackPlayer.STATE_PAUSED ||
      state == RNTrackPlayer.STATE_STOPPED
    ) {
      this.setPlay();
      if (state == RNTrackPlayer.STATE_STOPPED) {
        this.setState({
          curImg: 'https://protepto.com/stuff/mot/note.png',
          curTrack: '',
        });
      }
    } else if (state == RNTrackPlayer.STATE_PLAYING) {
      this.setPause();
    }
    await this.updateTrack();
  };

  componentDidMount() {
    this.updateJSON();
    this.onLaunch().then(() => null);
  }

  // RENDERER
  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.header]}>
          <View style={[styles.hamburgerMenu]}>
            <Button
              type={'clear'}
              style={[styles.hamburgerMenu]}
              onPress={this.props.navigation.toggleDrawer}
              icon={
                <Icon
                  name={'menu'}
                  color={'white'}
                  style={[styles.hamburgerMenuIcon]}
                />
              }
            />
          </View>
          <Text style={styles.title}>
            <Icon name={'radio'} color={'white'} />
            Webradio
          </Text>
        </View>
        <FlatList
          data={this.retrieveFavorites}
          renderItem={({item}) => (
            <Item
              title={item.station_name}
              onPress={() =>
                this.playRadio(
                  item.valueOf,
                  'Name',
                  'https://protepto.com/media/mikuleek.mp3',
                  'https://protepto.com/media/leek.png',
                )
              }
              thumb={item.station_picture}
            />
          )}
          keyExtractor={item => item.station_id}
          style={styles.list}
        />
        <View style={[styles.footer]}>
          <View style={styles.controlButtons}>
            <View
              style={{flexDirection: 'row', alignItems: 'stretch', flex: 1}}>
              <Image
                source={{uri: this.state.curImg}}
                style={{
                  width: 64,
                  height: 64,
                  marginLeft: 16,
                  resizeMode: 'contain',
                  marginRight: 8,
                }}
              />
              <View style={[styles.trackContainer]}>
                <TextTicker
                  duration={3000}
                  loop
                  bounce
                  repeatSpacer={50}
                  marqueeDelay={1000}
                  style={[styles.trackName]}>
                  {this.state.curTrack}
                </TextTicker>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{marginRight: 8, elevation: 2}}>
                <Button
                  icon={{
                    name: this.buttonLabel.stopBut,
                    size: 32,
                    color: 'black',
                  }}
                  type={'clear'}
                  onPress={this.stopMusic}
                  buttonStyle={[styles.button_controls]}
                />
              </View>
              <Button
                icon={{
                  name: this.buttonLabel.pauseIcon,
                  size: 32,
                  color: 'black',
                }}
                type={'clear'}
                onPress={this.togglePauseMusic}
                buttonStyle={[styles.button_controls]}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
  },
  header: {
    fontSize: RFValue(32, 1080),
    flex: 1,
    height: 100,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: '#9900ff',
    zIndex: 10,
    elevation: 10,
    flexDirection: 'row',
  },
  footer: {
    flex: 1,
    height: 100,
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    elevation: 2,
    zIndex: 2,
    left: 0,
    right: 0,
    bottom: 0,
  },
  controlButtons: {
    flex: 1,
    marginTop: 16,
    marginRight: 16,
    flexDirection: 'row',
    alignItems: 'stretch',
    display: 'flex',
    justifyContent: 'space-between',
  },
  trackContainer: {
    flex: 2,
    paddingTop: 16,
    marginRight: 8,
    height: 64,
    maxWidth: '100%',
    alignItems: 'center',
    fontSize: 20,
  },
  trackName: {
    fontSize: 20,
    color: '#000000',
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  title: {
    fontSize: RFValue(32, 900),
    color: '#ffffff',
    backgroundColor: '#9900ff',
    padding: 8,
    marginTop: 16,
    marginRight: 16,
    marginBottom: 16,
    maxWidth: '80%',
    fontFamily: 'Roboto',
    letterSpacing: 16,
    textAlign: 'center',
  },
  list: {
    marginTop: 100,
    marginBottom: 100,
  },
  button_controls: {
    elevation: 0,
    width: 64,
    height: 64,
  },
  pic: {
    height: 64,
    width: 64,
    resizeMode: 'contain',
    marginRight: 16,
  },
  buttonStation: {
    justifyContent: 'space-between',
  },
  items: {
    borderRadius: 100,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  hamburgerMenu: {
    color: '#ffffff',
    padding: 8,
    marginTop: 8,
    fontSize: 32,
  },
  hamburgerMenuIcon: {
    padding: 8,
    color: '#ffffff',
    fontSize: 32,
  },
});

export default Favorites;
