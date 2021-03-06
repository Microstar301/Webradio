import React, {Component} from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Vibration,
  ToastAndroid,
} from 'react-native';
import RNTrackPlayer from 'react-native-track-player';
import {Button, ThemeProvider} from 'react-native-elements';
import Icon from 'react-native-material-ui/src/Icon';
import TextTicker from 'react-native-text-ticker';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-community/async-storage';

// Parts from https://reactnative.dev/docs/flatlist
function Item({title, onPress, onLongPress, thumb}) {
  return (
    <View style={styles.items}>
      <Button
        title={title.toString()}
        buttonStyle={styles.buttonStation}
        onLongPress={onLongPress}
        onPress={onPress}
        rounded={true}
        icon={<Image source={{uri: thumb}} style={styles.pic} />}
      />
    </View>
  );
}
// Parts from https://react-native-community.github.io/async-storage/docs/api
const storeData = async (key, value) => {
  try {
    AsyncStorage.clear();
    console.log(key + ' saved ' + value.toString());
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // saving error
  }
};

class Favorites extends Component {
  state = {
    curTrack: '',
    curImg: 'https://protepto.com/stuff/mot/note.png',
    favorites: [],
    refresh: false,
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
  // Parts from https://react-native-track-player.js.org/getting-started/
  addTrack = (tid, title, url, artwork) => {
    const track = {
      id: tid, // ID from Database
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
    const state = await RNTrackPlayer.getState();
    if (
      state == RNTrackPlayer.STATE_PLAYING ||
      state == RNTrackPlayer.STATE_PAUSED
    ) {
      await RNTrackPlayer.stop();
      this.setPlay();
      await this.updateTrack();
      this.setState({
        curImg: 'https://protepto.com/stuff/mot/note.png',
        curTrack: '',
      });
    } else {
      await this.onLaunch();
    }
  };

  // Parts from https://react-native-community.github.io/async-storage/docs/api
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

  async changeFavorite(id) {
    await this.updateFavorites();
    let arrfav = [];
    if (typeof this.state.favorites !== 'object') {
      let arrfav = [];
      arrfav.push(parseInt(id));
      await storeData('fstations', arrfav);
    } else {
      let found = false;
      let error = false;
      this.state.favorites.map(function(o) {
        if (typeof o !== 'number' || typeof o == null) {
          AsyncStorage.clear();
          console.log('DB inconsistency detected!!');
          error = true;
          return;
        }
        if (o == id) {
          found = true;
        } else {
          arrfav.push(o);
        }
      });
      if (!found) {
        arrfav.push(parseInt(id));
        ToastAndroid.show('Added ' + id + ' to favorites.', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(
          'Removed ' + id + ' from favorites.',
          ToastAndroid.SHORT,
        );
      }
      if (!error) {
        storeData('fstations', arrfav);
      }
      Vibration.vibrate(4, false);
      this.updateJSON();
      this.updateFavorites().then(
        console.log(JSON.stringify(this.state.favorites)),
      );
    }
  }

  setPause = () => {
    this.buttonLabel.pauseTogg = 'Pause';
    this.buttonLabel.pauseIcon = 'pause';
  };

  setPlay = () => {
    this.buttonLabel.pauseTogg = 'Play';
    this.buttonLabel.pauseIcon = 'play-arrow';
  };

  togglePauseMusic = async () => {
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
  };

  // Parts from https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
  updateJSON = () => {
    fetch('https://protepto.com/stuff/mot/stations.php')
      .then(response => response.json())
      .then(responseJson => {
        let favos = [];
        let favorites = this.state.favorites;
        if (typeof favorites !== 'undefined') {
          responseJson.map(function(station) {
            if (favorites.includes(parseInt(station.station_id))) {
              favos.push(station);
            }
          });
        }
        this.setState({
          dataSource: responseJson,
          favolist: favos,
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

  async updateFavorites() {
    this.setState({
      favorites: await this.getData('fstations'),
    });
  }
  async onFirstLaunch() {
    await this.updateFavorites();
    if (typeof this.state.favorites === 'undefined') {
      storeData('fstations', Array.empty);
    }
    this.props.navigation.addListener('focus', () => {
      this.updateFavorites();
      this.updateJSON();
      this.updateTrack();
      if (typeof this.state.favolist !== 'undefined') {
        if (this.state.favolist.length <= 0) {
          ToastAndroid.showWithGravity(
            'No favorites added yet.',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        }
      }
    });
    if (typeof this.state.favorites == 'undefined') {
      ToastAndroid.showWithGravity(
        'Long Press to favorite station!',
        ToastAndroid.LONG,
        ToastAndroid.CENTER,
      );
    }
  }

  componentDidMount() {
    this.onFirstLaunch();
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
        <View style={styles.flatList}>
          <FlatList
            data={this.state.favolist}
            extraData={this.state.refresh}
            renderItem={({item}) => (
              <Item
                title={item.station_name}
                onPress={() =>
                  this.playRadio(
                    item.station_id,
                    item.station_name,
                    item.station_url,
                    item.station_picture,
                  )
                }
                onLongPress={() => this.changeFavorite(item.station_id)}
                thumb={item.station_picture}
              />
            )}
            keyExtractor={item => item.station_id}
            style={styles.list}
          />
        </View>
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
  //MAIN CONTAINER
  container: {
    flex: 1,
  },
  // HEADER WITH BUTTON
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

  // FOOTER WITH CONTROLS
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
  // List Container
  flatList: {
    flexGrow: 0,
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
  //TRACK NAME CONTAINER
  trackContainer: {
    flex: 2,
    paddingTop: 16,
    marginRight: 8,
    height: 64,
    maxWidth: '100%',
    alignItems: 'center',
    fontSize: 20,
  },
  // TRACK NAME TEXT
  trackName: {
    fontSize: 20,
    color: '#000000',
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  // MAIN TITLE
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
  // MAIN STATION LIST
  list: {
    marginTop: 100,
    marginBottom: 100,
  },
  // PLAY/PAUSE AND STOP BUTTON
  button_controls: {
    elevation: 0,
    width: 64,
    height: 64,
  },
  // CURRENT TRACK ARTWORK
  pic: {
    height: 64,
    width: 64,
    resizeMode: 'contain',
    marginRight: 16,
    marginLeft: 8,
  },
  // STATION BUTTON
  buttonStation: {
    justifyContent: 'flex-start',
  },
  // STATIONS
  items: {
    borderRadius: 100,
    marginVertical: 8,
    marginHorizontal: 16,
    flex: 1,
  },
  // DRAWER BUTTON CONTAINER
  hamburgerMenu: {
    color: '#ffffff',
    padding: 8,
    marginTop: 8,
    fontSize: 32,
  },
  // DRAWER BUTTON
  hamburgerMenuIcon: {
    padding: 8,
    color: '#ffffff',
    fontSize: 32,
  },
});

export default Favorites;
