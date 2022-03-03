import React, {Component, useCallback, useEffect} from 'react';
import {
  Text,
  Image,
  ImageBackground,
  AsyncStorage,
  StyleSheet,
  StatusBar,
  TextInput,
} from 'react-native';
import global from './Global';
import {db} from './config';
import {useDispatch, useSelector} from 'react-redux';
export default function Splash({navigation}) {
  const type = useSelector((state) => state.user.type);
  useEffect(() => {
    setTimeout(() => {
      openNextScreen();
    }, 3000);
  });
  //   useEffect(() => {
  //     openNextScreen();
  //   }, [type]);
  const openNextScreen = () => {
    if (type === 'ass') {
      navigation.navigate('AssistantHome');
    } else {
      navigation.navigate('HomeScreen');
    }
  };
  return (
    <ImageBackground
      style={{
        alignSelf: 'center',
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
      }}
      source={require('./images/splash.png')}>
      <StatusBar translucent backgroundColor="white" barStyle="dark-content" />
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
