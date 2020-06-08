/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import RNTrackPlayer from 'react-native-track-player';


AppRegistry.registerComponent(appName, () => App);

RNTrackPlayer.registerPlaybackService(() => require('./service.js'));
