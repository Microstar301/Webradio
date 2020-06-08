import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default class Webradio extends Component {
  initialState = {
    daText: 'Text',
  };

  render() {
    return (
      <View style={webradioStyle.mainContainer}>
        <Text style={webradioStyle.mainText}>{'Yea ' + this.initialState.daText + '!'}</Text>
      </View>
    );
  }
}
const webradioStyle = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  mainText: {
    fontSize: 50,
  },
});
