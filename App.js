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

        <NavigationContainer>
          <Drawer.Navigator
              drawerPosition="left"
              initalRoutName="Not given"
              screenOptions={{headerStyle:{backgroundColor:'yellow'}}}
              backBehavior="none"
              openByDefault="true"
              drawerType="front"
              sceneContainerStyle=""


            initialRouteName="Home"
            drawerStyle={{
              marginTop: 100,
              width: 240,
              fontSize: RFValue(24),
            }}>

            <Drawer.Screen name="Home" component={Allstations} options={{title:'Home2'}}/>
            <Drawer.Screen name="Favorites" component={Favorites} options={{title:'Favorites2'}}/>
            <Drawer.Screen name="test" component={Favorites} options={{title:'Welcome'}}></Drawer.Screen>
          </Drawer.Navigator>
        </NavigationContainer>

      </ThemeProvider>

    );
  }
}
//https://reactnavigation.org/docs/drawer-navigator/
