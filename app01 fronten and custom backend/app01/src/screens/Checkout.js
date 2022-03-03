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
  Alert,
  Text,
} from 'react-native';
import Header from './Header';
import AnimatedLoader from 'react-native-animated-loader';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {useStripe} from '@stripe/stripe-react-native';
import {fetchPaymentParams} from '../redux/stripeSlice';
import {calculateProductQuantity, calculateTotals} from '../utils';
import {Avatar, Divider, List, Button} from 'react-native-paper';
import {APP_CONFIG} from '../../config';
import {clear_cart, postOrder} from '../redux/cartSlice';
import {useDispatch} from 'react-redux';
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
  priceSumItem: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 5,
  },
  priceTitle: {
    marginRight: 10,
  },
  price: {
    fontWeight: 'bold',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#af0808',
  },
});

const {width, height} = Dimensions.get('window');
export default function Checkout({navigation}) {
  const cart = navigation.getParam('cart');
  const [intentId, setIntentId] = useState('');
  const {initPaymentSheet, presentPaymentSheet, confirmPaymentSheetPayment} =
    useStripe();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const fetchPaymentSheetParams = async () => {
    const {paymentIntent, ephemeralKey, customer, id} =
      await fetchPaymentParams({
        total: calculateTotals(cart.total, cart.charges, cart.discount_percent),
        shop_id: cart.shop_id,
      });
    setIntentId(id);
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };
  const handle_checkout = async () => {
    setLoading(true);
    try {
      setLoading(false);
      if (cart.payment_type !== 'cash') {
        await openPaymentSheet();
      } else {
        await postOrder({...cart, paymentIntentId: intentId});
        success();
      }
    } catch (e) {
      //   Alert.alert('Failed', 'Failed to place an order!');
    }
    setLoading(false);
  };
  const success = () => {
    dispatch(clear_cart());
    Alert.alert('Success', 'Your order is confirmed!');
    navigation.navigate('Home');
  };
  const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      await postOrder({...cart, paymentIntentId: intentId});
      success();
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
      <ScrollView contentContainerStyle={{paddingHorizontal: 20}}>
        <List.Section>
          <List.Subheader>Items</List.Subheader>
          <FlatList
            horizontal={false}
            showsVerticalScrollIndicator={false}
            numColumns={1}
            data={cart.products}
            renderItem={({item, index}) => (
              <List.Item
                title={item.product_name}
                description={item.product_description}
                left={() => (
                  <Avatar.Image
                    size={50}
                    source={{
                      uri:
                        APP_CONFIG.backend_url +
                        '/image/products/' +
                        item.images[0],
                    }}
                  />
                )}
                right={() => (
                  <Text>
                    x{calculateProductQuantity(item._id, cart.products)} | €{' '}
                    {item.selling_price}
                  </Text>
                )}
              />
            )}
          />
        </List.Section>
        <Divider />
        <View style={styles.priceSumItem}>
          <Text style={styles.priceTitle}>Subtotal</Text>
          <Text style={styles.price}>{'€' + cart.total}</Text>
        </View>

        {cart.charges !== 0 && (
          <View style={styles.priceSumItem}>
            <Text style={styles.priceTitle}>Extra Charge</Text>
            <Text style={styles.price}>€{cart.charges}</Text>
          </View>
        )}

        <View style={styles.priceSumItem}>
          <Text style={styles.priceTitle}>Discount</Text>
          <Text style={styles.price}>{cart.discount_percent + ' %'}</Text>
        </View>
        <Divider />
        <View style={styles.priceSumItem}>
          <Text style={styles.priceTitle}>Total</Text>
          <Text style={styles.price}>
            {'€' +
              calculateTotals(cart.total, cart.charges, cart.discount_percent)}
          </Text>
        </View>
        <Button
          disabled={loading}
          style={styles.button}
          mode="contained"
          onPress={() => handle_checkout()}>
          Checkout
        </Button>
      </ScrollView>
    </View>
  );
}
