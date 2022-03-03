import React, {Component, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  Dimensions,
  Button,
  ToastAndroid,
  Alert,
} from 'react-native';
import Header from './Header';
import AnimatedLoader from 'react-native-animated-loader';
import {ScrollView} from 'react-native-gesture-handler';
import {useStripe} from '@stripe/stripe-react-native';
import {fetchPaymentParams} from '../redux/stripeSlice';
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

const {width, height} = Dimensions.get('window');
export default function Cards({navigation}) {
  const {initPaymentSheet, presentPaymentSheet, confirmPaymentSheetPayment} =
    useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    const {paymentIntent, ephemeralKey, customer} = await fetchPaymentParams();
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };
  const openPaymentSheet = async () => {
    const {error} = await confirmPaymentSheetPayment();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
  };
  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const initializePaymentSheet = async () => {
    setLoading(true);
    const {paymentIntent, ephemeralKey, customer} =
      await fetchPaymentSheetParams();
    setLoading(false);
    const {error} = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
    });

    // if (!error) {
    // }
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
      <ScrollView>
        <Button
          variant="primary"
          disabled={loading}
          title="Checkout"
          onPress={openPaymentSheet}
        />
      </ScrollView>
    </View>
  );
}
