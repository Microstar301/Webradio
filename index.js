/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import RNTrackPlayer from 'react-native-track-player';
import App from './App';

AppRegistry.registerComponent(appName, () => App);

RNTrackPlayer.registerPlaybackService(() => require('./service.js'));
