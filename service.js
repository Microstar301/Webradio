import RNTrackPlayer, {getCurrentTrack} from 'react-native-track-player';

module.exports = async function() {
  // This service needs to be registered for the module to work
  // but it will be used later in the "Receiving Events" section
  RNTrackPlayer.addEventListener('remote-play', () => RNTrackPlayer.play());
  RNTrackPlayer.addEventListener('remote-pause', () => RNTrackPlayer.pause());
  RNTrackPlayer.addEventListener('remote-stop', () => RNTrackPlayer.stop());
};
