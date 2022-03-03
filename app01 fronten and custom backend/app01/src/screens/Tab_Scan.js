import React, {Component, useEffect, useState} from 'react';
import {
  Text,
  View,
  StatusBar,
  AsyncStorage,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  DevSettings,
  Alert,
} from 'react-native';
import design from './StyleFile';
import {ScrollView} from 'react-native-gesture-handler';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import Toast from 'react-native-simple-toast';
import firebase from 'firebase';
var rootRef;
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
} from 'react-native-popup-dialog';
import global from './Global';
import {useSelector} from 'react-redux';
import {useStripe} from '@stripe/stripe-react-native';
import {fetchPaymentParams, fetchTransferParams} from '../redux/stripeSlice';
import AnimatedLoader from 'react-native-animated-loader';
import {getOneShop} from '../redux/shopSlice';

export default function Tab_Scan({navigation}) {
  const [flash, setFlash] = useState(false);
  const [successDialouge, setSuccessDialouge] = useState(false);
  const [loading, setLoading] = useState(false);
  const {initPaymentSheet, presentPaymentSheet, confirmPaymentSheetPayment} =
    useStripe();

  const [focusedScreen, setFocusedScreen] = useState(false);

  useEffect(() => {
    const willFocus = () => {
      setFocusedScreen(true);
    };
    const willBlur = () => {
      setFocusedScreen(false);
    };
    navigation.addListener('willFocus', willFocus);
    navigation.addListener('willBlur', willBlur);
    return () => {
      navigation.removeListener('willFocus', willFocus);
      navigation.removeListener('willBlur', willFocus);
    };
  }, [navigation]);
  const fetchPaymentSheetParams = async (data) => {
    const {paymentIntent, ephemeralKey, customer} = await fetchTransferParams(
      data,
    );
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };
  const initializePaymentSheet = async (total, user_id) => {
    setLoading(true);
    const {paymentIntent, ephemeralKey, customer} =
      await fetchPaymentSheetParams({total, user_id});
    const {error} = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
    });
    setLoading(false);
    if (!error) {
      await openPaymentSheet();
    } else {
      console.log(error);
    }
  };
  const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      setSuccessDialouge(true);
    }
  };

  const onSuccess = async (e) => {
    try {
      const {action, user_id, amount, id} = JSON.parse(e.data);
      if (action === 'open_shop_detail') {
        setLoading(true);
        const {data} = await getOneShop(id);
        if (data.length === 0) {
          throw new Error('No such shop');
        }
        setLoading(false);
        navigation.navigate('ProductDetail', {shop: data[0]});
      } else {
        console.log(e.data);
        initializePaymentSheet(amount, user_id);
      }
    } catch (e) {
      setLoading(false);
      Toast.show('Some error occurred!');
      console.log('QR code error');
    }
  };

  return (
    <View style={styles.MainContainer}>
      <StatusBar translucent backgroundColor="white" barStyle="dark-content" />
      <AnimatedLoader
        visible={loading}
        overlayColor="rgba(255,255,255,0.15)"
        source={require('./loader.json')}
        animationStyle={styles.lottie}
        speed={1}
      />
      <Text style={styles.shopname_text} />

      <ScrollView>
        <View>
          <View>
            <Image
              style={{
                alignSelf: 'center',
                width: 360,
                height: 360,
                borderRadius: 10,
                resizeMode: 'contain',
                marginTop: 30,
              }}
              source={require('./images/scanning.png')}
            />
            <View
              style={{
                marginTop: Platform.OS == 'ios' ? 70 : 80,
                width: 320,
                height: 320,
                alignSelf: 'center',
                position: 'absolute',
                bottom: 20,
                overflow: 'hidden',
              }}>
              {focusedScreen && (
                <QRCodeScanner
                  onRead={onSuccess}
                  cameraStyle={{width: 320, height: 320}}
                  containerStyle={{width: 320, height: 320}}
                  reactivate
                  reactivateTimeout={5000}
                  flashMode={
                    flash
                      ? RNCamera.Constants.FlashMode.torch
                      : RNCamera.Constants.FlashMode.off
                  }
                  topContent={<Text />}
                  bottomContent={<Text> </Text>}
                />
              )}
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setFlash(!flash)}
            style={{
              height: 60,
              width: 60,
              resizeMode: 'contain',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 65,
              backgroundColor: design.theme_color_parent,
              borderRadius: 30,
              overflow: 'hidden',
              alignSelf: 'center',
            }}>
            <Image
              style={{
                alignSelf: 'center',
                width: 30,
                height: 30,
              }}
              source={
                flash
                  ? require('./images/flash_off.png')
                  : require('./images/flash_on.png')
              }
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Dialog
        onTouchOutside={() => setSuccessDialouge(false)}
        width={0.9}
        visible={successDialouge}
        dialogAnimation={new ScaleAnimation()}
        onHardwareBackPress={() => {
          successDialouge(false);
          return true;
        }}>
        <DialogContent>
          <View>
            <Text style={styles.alert_title}>Success</Text>

            <Text style={styles.alert_desc}>Transaction complete.</Text>

            <TouchableOpacity
              onPress={() => {
                // openPaymentSheet();
                setSuccessDialouge(false);
              }}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 50,
              }}>
              <Text style={styles.pay_text}>Ok</Text>
            </TouchableOpacity>
          </View>
        </DialogContent>
      </Dialog>
    </View>
  );
}
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS == 'ios' ? 40 : 0,
    paddingBottom: Platform.OS == 'ios' ? 80 : 25,
  },
  shopname_text: {
    color: '#000000',
    fontSize: 20,
    textAlign: 'center',
    marginTop: Platform.OS == 'ios' ? 10 : 30,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    paddingBottom: Platform.OS === 'ios' ? 5 : 0,
    marginHorizontal: 40,
    fontSize: 18,
    marginTop: 30,
  },
  input_2: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    paddingBottom: Platform.OS === 'ios' ? 5 : 0,
    marginHorizontal: 40,
    fontSize: 18,
    marginTop: 30,
  },
  pay_text: {
    fontSize: 20,
    color: '#fff',
    backgroundColor: design.theme_color_parent,
    paddingHorizontal: 80,
    paddingVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 50,
  },
  pay_input: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingBottom: Platform.OS === 'ios' ? 5 : 0,
    fontSize: 18,
    width: 100,
    paddingLeft: 15,
  },
  lottie: {
    width: 150,
    height: 150,
  },
  doller_text: {
    fontSize: 25,
    color: design.theme_color_parent,
  },
  alert_title: {
    fontSize: 25,
    marginTop: 20,
    textAlign: 'center',
    color: design.black,
  },
  alert_desc: {
    fontSize: 16,
    marginTop: 40,
    textAlign: 'center',
    color: design.black,
    marginHorizontal: 20,
  },
});
