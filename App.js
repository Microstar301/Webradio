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
import {RFValue} from 'react-native-responsive-fontsize';

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

        <NavigationContainer style={{fontSize: 50}}>
          <Drawer.Navigator
            drawerPosition="left"
            initalRoutName="Not given"
            backBehavior="none"
            drawerType="front"
            sceneContainerStyle=""
            initialRouteName="Home"
            drawerContentOptions={{
              activeTintColor: '#570091',
              labelStyle: {fontSize: RFValue(14), fontFamily: 'lucida grande'},
            }}
            drawerStyle={{
              backgroundColor: '#ffffff',
              marginTop: 100,
              width: 240,
            }}>
            <Drawer.Screen
              name="Home"
              component={Allstations}
              options={{drawerLabel: 'Home'}}
            />
            <Drawer.Screen
              name="Favorites"
              component={Favorites}
              options={{drawerLabel: 'Favorites'}}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    );
  }
}
//https://reactnavigation.org/docs/drawer-navigator/
