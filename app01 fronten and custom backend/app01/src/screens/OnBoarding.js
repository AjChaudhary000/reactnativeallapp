import React, {Component, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Header from './Header';
import design from './StyleFile';
import ProgressWebView from 'react-native-progress-webview';
import {fetchOnboardingUrl, checkOnboardingStatus} from '../redux/stripeSlice';
import Toast from 'react-native-simple-toast';
import AnimatedLoader from 'react-native-animated-loader';
import {ScrollView} from 'react-native-gesture-handler';
import {useDispatch} from 'react-redux';
import {getUserProfile} from '../redux/userSlice';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingBottom: Platform.OS == 'ios' ? 80 : 65,
  },
  lottie: {
    width: 200,
    height: 200,
  },
});
const STRIPE = {
  REFERSH_URL: 'https://example.com/reauth',
  RETURN_URL: 'https://example.com/return',
};
const {width, height} = Dimensions.get('window');
export default function OnBoarding({navigation}) {
  const wvRef = useRef();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchURL();
  }, []);
  const fetchURL = async () => {
    setLoading(true);
    try {
      const u = await fetchOnboardingUrl();
      console.log(u);
      setUrl(u.url);
    } catch (e) {
      console.log(e);
      Toast.show('An error occured');
    }
    setLoading(false);
  };

  const handleWebViewNavigationStateChange = async ({nativeEvent}) => {
    console.log(nativeEvent.url);
    if (nativeEvent.url.includes(STRIPE.RETURN_URL)) {
      setLoading(true);
      const res = await checkOnboardingStatus();
      setLoading(false);
      if (res.status) {
        Toast.show('Congratulations ! User onboarding complete.');
        dispatch(getUserProfile());
        navigation.navigate('Tab_profile');
      } else {
        Toast.show('User onboarding not complete.');
        navigation.navigate('Tab_profile');
      }
      console.log(res);
    }
    if (nativeEvent.url.includes(STRIPE.REFERSH_URL)) {
      fetchURL();
      Toast.show('Account cannot be created');
      console.log('Account Cannot Be Created!');
    }
  };
  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <AnimatedLoader
        visible={loading}
        overlayColor="rgba(255,255,255,0.15)"
        source={require('./loader.json')}
        animationStyle={styles.lottie}
        speed={1}
      />
      <ScrollView contentContainerStyle={{flex: 1}}>
        <ProgressWebView
          ref={wvRef}
          pullToRefreshEnabled={true}
          source={{uri: url}}
          onLoadStart={handleWebViewNavigationStateChange}
        />
      </ScrollView>
    </View>
  );
}
