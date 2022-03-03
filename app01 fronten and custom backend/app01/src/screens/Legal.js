import React, {Component, useEffect, useState} from 'react';
import {
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
  Platform,
} from 'react-native';
import {getLegals} from '../redux/settingsSlice';
import design from './StyleFile';
import Header from './Header';
import WebView from 'react-native-webview';
import Loading from './Loading';
import {useWindowDimensions} from 'react-native';
import RenderHtml from 'react-native-render-html';
import {ScrollView} from 'react-native-gesture-handler';

export default function Legal({navigation}) {
  const [html, setHtml] = useState('<div>Test</div>');
  const [loading, setLoading] = useState(false);
  const {width} = useWindowDimensions();
  const fetchLegal = async () => {
    setLoading(true);
    const legalHTML = await getLegals();
    setHtml(legalHTML.html);
    setLoading(false);
  };
  useEffect(() => {
    fetchLegal();
  }, []);
  return (
    <View style={styles.MainContainer}>
      <StatusBar translucent backgroundColor="white" barStyle="dark-content" />
      <Header navigation={navigation} />
      <Loading show={loading} />
      <ScrollView contentContainerStyle={{padding: 20}}>
        <RenderHtml contentWidth={width} source={{html: html}} />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS == 'ios' ? 40 : 30,
  },
});
