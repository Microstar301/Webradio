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
import Allstations from './src/screens/allstations';
import Favorites from './src/screens/favorites';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();
const theme = {
  colors: {
    primary: '#570091',
  },
};

export default class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <StatusBar
          backgroundColor="#9900ff"
          barStyle={'light-content'}
          hidden={false}
        />
        <NavigationContainer>
          <Drawer.Navigator
            initialRouteName="Home"
            drawerStyle={{
              marginTop: 100,
              width: 240,
            }}>
            <Drawer.Screen name="Home" component={Allstations} />
            <Drawer.Screen name="Favorites" component={Favorites} />
          </Drawer.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    );
  }
}
