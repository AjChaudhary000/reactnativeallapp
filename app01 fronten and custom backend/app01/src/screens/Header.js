import React, {Component, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
} from 'react-native';
import design from './StyleFile';
export default function Header({navigation}) {
  return (
    <>
      <StatusBar translucent backgroundColor="white" barStyle="dark-content" />
      <View style={{flexDirection: 'row', marginTop: 20, marginBottom: 15}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            style={{
              width: 30,
              height: 30,
              resizeMode: 'contain',
              tintColor: design.theme_color_parent,
              marginLeft: 15,
            }}
            source={require('./images/back.png')}
          />
        </TouchableOpacity>

        <Image
          style={{
            width: 100,
            height: 30,
            resizeMode: 'contain',
            marginLeft: 5,
          }}
          source={require('./images/app1.png')}
        />
      </View>
    </>
  );
}
