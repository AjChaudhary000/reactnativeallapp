import React, {Component} from 'react';
import {
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  View,
  FlatList,
  Platform,
  TextInput,
  ScrollView,
  AsyncStorage,
  Linking,
} from 'react-native';
import design from './StyleFile';
import QRCode from 'react-native-qrcode-svg';
import AnimatedLoader from 'react-native-animated-loader';
import global from './Global';
let user_id = '';
let arr_order = [];
import FitImage from 'react-native-fit-image';
let index = 0;
let order_id = '';
import Toast from 'react-native-simple-toast';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
} from 'react-native-popup-dialog';
import {calculateTotals, formatDate, getRelativeDistance} from '../utils';
import {APP_CONFIG} from '../../config';
import {getDistance} from 'geolib';
import {mapLocation} from '../redux/locationSlice';
import {connect} from 'react-redux';
class OrderDetail extends Component {
  constructor(props) {
    super(props);
    (this.categoryies = []),
      (this.state = {
        categoryHolder: [
          {
            product_name: 'Milk Shake',
            qty: '4',
            price: '€80',
          },
          {
            product_name: 'Oreo Shake',
            qty: '2',
            price: '€50',
          },
        ],
        order_type: '',
        total_items: '',
        total_grand_price: '',
        payment_method: '',
        shop_name: '',
        shop_image: '',
        order_note: '',
        order_price: '',
        discount: '',
        delivery_charges: '',
        orders_items_array: '',
        order_status: '',
        order_user_id: '',
        shop_phone_number: '',
        shop_owner_id: '',
        distance: '',
        duration: '',
        order_date: '',
        order_time: '',
        table_number: '',
        delievered_address: '',
      });
  }

  backpress = () => {
    this.props.navigation.goBack();
  };
  componentDidMount = () => {};
  cancel_button = () => {
    this.props.navigation.goBack();
  };
  call_button = () => {
    let phoneNumber = '';
    var number = this.state.shop_phone_number;
    if (Platform.OS === 'android') {
      phoneNumber = 'tel:' + number;
    } else {
      phoneNumber = 'telprompt:' + number;
    }

    Linking.openURL(phoneNumber);
  };
  chat_button = () => {
    if (this.state.shop_owner_id == user_id) {
      Toast.show('You are owner of this shop');
    } else {
      this.props.navigation.navigate('MessageScreen', {
        id: this.state.shop_owner_id,
      });
    }
  };
  cancel_order = () => {
    this.setState({confirmation_dialog: true});
  };
  ok_button_handle = () => {};
  render() {
    const {navigation, location} = this.props;
    const data = navigation.getParam('data');
    return (
      <View style={styles.MainContainer}>
        <AnimatedLoader
          visible={false}
          overlayColor="rgba(255,255,255,0.15)"
          source={require('./loader.json')}
          animationStyle={styles.lottie}
          speed={1}
        />
        <StatusBar
          translucent
          backgroundColor="white"
          barStyle="dark-content"
        />
        <View style={{flexDirection: 'row', marginTop: 15, marginBottom: 15}}>
          <TouchableOpacity onPress={this.backpress}>
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

        <ScrollView style={{marginBottom: 10}}>
          <View>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                marginTop: 25,
                marginHorizontal: 25,
              }}>
              <View
                style={{width: '20%', marginRight: 10, alignSelf: 'center'}}>
                {data.charge_type == 'home_delivery' ? (
                  <View
                    style={{
                      width: 70,
                      backgroundColor: 'green',
                      borderRadius: 35,
                      overflow: 'hidden',
                      height: 70,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        width: 75,
                        height: 75,
                        resizeMode: 'contain',
                      }}
                      source={require('./images/assi_shop.png')}
                    />
                  </View>
                ) : data.charge_type == 'pickup' ? (
                  <View
                    style={{
                      width: 70,
                      backgroundColor: '#af0808',
                      borderRadius: 35,
                      overflow: 'hidden',
                      height: 70,
                    }}>
                    <Image
                      style={{
                        width: 75,
                        height: 75,
                        resizeMode: 'contain',
                      }}
                      source={require('./images/assi_shop.png')}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      width: 70,
                      backgroundColor: '#af0808',
                      borderRadius: 35,
                      overflow: 'hidden',
                      height: 70,
                    }}>
                    <Text style={styles.white_text}>
                      Table number : {data.table_number}
                    </Text>
                  </View>
                )}
              </View>

              <View style={{width: '50%', marginLeft: 10}}>
                <Text
                  style={
                    data.charge_type == 'home_delivery'
                      ? styles.field_1_text_green
                      : styles.field_1_text
                  }>
                  {data.charge_type == 'home_delivery'
                    ? 'Delivery'
                    : data.charge_type == 'pickup'
                    ? 'Self Pickup'
                    : 'Table Order'}
                </Text>
                <Text style={styles.field_3_text}>
                  {'Order id : ' + data._id.slice(-6)}
                </Text>
                <Text style={styles.field_4_text}>
                  Pcs {data.products.length}
                </Text>
                <Text style={styles.field_5_text}>
                  €
                  {calculateTotals(
                    data.total,
                    data.charges,
                    data.discount_percent,
                  )}
                </Text>
              </View>
              <View style={{width: '30%', alignSelf: 'center'}}>
                <Text style={styles.status_text}>{data.status}</Text>
              </View>
            </TouchableOpacity>

            {data.delivery_address != '' ? (
              <View style={{marginHorizontal: 10, marginTop: 20}}>
                <Text style={[styles.item_text, {marginTop: 0}]}>
                  Delivery Address :{' '}
                </Text>
                <Text
                  style={[
                    styles.item_text,
                    {color: '#a9a9a9', marginTop: 0, fontSize: 15},
                  ]}>
                  {data.delivery_address}
                </Text>
              </View>
            ) : null}

            {data.note != '' ? (
              <View style={{marginHorizontal: 10, marginTop: 20}}>
                <Text style={[styles.item_text, {marginTop: 0}]}>
                  Order Note :{' '}
                </Text>
                <Text
                  style={[
                    styles.item_text,
                    {color: '#a9a9a9', marginTop: 0, fontSize: 15},
                  ]}>
                  {data.note}
                </Text>
              </View>
            ) : null}

            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
                marginHorizontal: 10,
              }}>
              <View style={{width: '30%'}}>
                <FitImage
                  style={{
                    alignSelf: 'center',
                    width: 100,
                    height: 100,
                    resizeMode: 'contain',
                    borderRadius: 15,
                    overflow: 'hidden',
                  }}
                  source={{
                    uri:
                      APP_CONFIG.backend_url +
                      '/image/shop/' +
                      data.products[0].shop.images[0],
                  }}
                />
              </View>
              <View style={{width: '70%'}}>
                <Text style={styles.title_text}>
                  {data.products[0].shop.shop_name}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    // justifyContent: 'flex-end',
                    marginTop: 40,
                    marginRight: 25,
                  }}>
                  <Image
                    style={{
                      alignSelf: 'center',
                      width: 20,
                      height: 20,
                      resizeMode: 'contain',
                    }}
                    source={require('./images/time.png')}
                  />
                  <Text style={styles.desc_text}>
                    {formatDate(data.created_date)}
                  </Text>
                  {/* <Image
										style={{
											alignSelf: 'center',
											width: 20,
											height: 20,
											resizeMode: 'contain',
											marginLeft: 10,
										}}
										source={require('./images/veg.png')}
									/> */}
                  <Text style={styles.desc_text}>
                    {getRelativeDistance(location, {
                      latitude: data.products[0].shop.latitude,
                      longitude: data.products[0].shop.longitude,
                    })}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.item_text}>
              Date : {new Date(data.created_date).toLocaleDateString()}
            </Text>
            <Text style={styles.item_text}>
              Time : {new Date(data.created_date).toLocaleTimeString()}
            </Text>

            <Text style={styles.item_text}>ITEMS IN CART</Text>

            <FlatList
              horizontal={false}
              showsVerticalScrollIndicator={false}
              numColumns={1}
              keyExtractor={(item) => item._id}
              data={data.products}
              renderItem={({item, index}) => (
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 15,
                    marginTop: 15,
                  }}>
                  <View style={{width: '30%', justifyContent: 'center'}}>
                    <Text style={styles.productname_text}>
                      {item.product_name}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '55%',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                    }}>
                    <Text style={styles.qty_text}>{item.quantity}</Text>
                  </View>
                  <View
                    style={{
                      width: '15%',
                      justifyContent: 'center',
                      paddingLeft: 5,
                    }}>
                    <Text style={styles.productprice_text}>
                      {'€' + item.selling_price}
                    </Text>
                  </View>
                </View>
              )}
            />

            <View style={{height: 1, backgroundColor: '#dcdcdc', margin: 20}} />

            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 25,
                marginTop: 25,
              }}>
              <Text style={styles.subtotal_text}>Subtotal</Text>
              <Text style={styles.subtotalprice}>€{data.total}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 25,
                marginTop: 10,
              }}>
              <Text style={styles.subtotal_text}>Extra Charge</Text>
              <Text style={styles.subtotalprice}>€{data.charges}</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 25,
                marginTop: 10,
              }}>
              <Text style={styles.subtotal_text}>Discount</Text>
              <Text style={styles.subtotalprice}>
                €{((data.total + data.charges) * data.discount_percent) / 100}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 25,
                marginTop: 10,
              }}>
              <Text style={styles.total_text}>Total</Text>
              <Text style={styles.totalprice}>
                €
                {calculateTotals(
                  data.total,
                  data.charges,
                  data.discount_percent,
                )}
              </Text>
            </View>
          </View>
        </ScrollView>

        <Dialog
          onTouchOutside={() => {
            this.setState({confirmation_dialog: false});
          }}
          width={0.9}
          visible={this.state.confirmation_dialog}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            console.log('onHardwareBackPress');
            this.setState({confirmation_dialog: false});
            return true;
          }}
          actions={[
            <DialogButton
              text="DISMISS"
              onPress={() => {
                this.setState({confirmation_dialog: false});
              }}
              key="button-1"
            />,
          ]}>
          <DialogContent>
            <View>
              <Text style={[styles.option_text, {textAlign: 'center'}]}>
                Cancel Order
              </Text>
              <TouchableOpacity
                onPress={() => this.ok_button_handle()}
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
}

const mapDispatchToProps = (dispatch) => {
  return {};
};
const mapStateToProps = (state) => {
  return {
    location: mapLocation(state.location.location),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail);
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS == 'ios' ? 40 : 40,
  },
  lottie: {
    width: 180,
    height: 180,
  },
  debit_cart_text: {
    fontSize: 18,
    color: design.theme_color_child,
  },
  discount_text: {
    fontSize: 16,
    color: design.theme_color_parent,
  },
  radio_button_selected: {
    height: 25,
    width: 25,
    borderRadius: 12,
    marginTop: 5,
    backgroundColor: design.theme_color_parent,
  },
  radio_button_unselected: {
    height: 25,
    width: 25,
    borderRadius: 12,
    borderWidth: 3,
    marginTop: 5,
    borderColor: design.theme_color_child,
  },
  title_text: {
    fontSize: 18,
    marginLeft: 5,
    marginTop: 8,
  },
  desc_text: {
    fontSize: 16,
    marginLeft: 8,
    color: design.theme_color_child,
  },
  item_text: {
    fontSize: 18,
    color: design.black,
    marginHorizontal: 15,
    marginTop: 30,
  },
  qty_text: {
    fontSize: 18,
    color: design.black,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderColor: '#dcdcdc',
    borderWidth: 1,
  },
  productname_text: {
    fontSize: 18,
    color: design.black,
  },
  productprice_text: {
    fontSize: 18,
    color: design.black,
  },
  input: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    height: 80,
    marginHorizontal: 30,
    padding: 10,
    borderRadius: 8,
  },
  subtotal_text: {
    textAlign: 'left',
    width: '50%',
    color: design.theme_color_child,
    fontSize: 15,
  },
  subtotalprice: {
    textAlign: 'right',
    width: '50%',
    color: design.theme_color_child,
    fontSize: 15,
  },
  voucher_text: {
    color: design.theme_color_child,
    fontSize: 15,
    marginHorizontal: 25,
    marginTop: 10,
  },
  total_text: {
    textAlign: 'left',
    width: '50%',
    color: design.black,
    fontSize: 18,
  },
  totalprice: {
    textAlign: 'right',
    width: '50%',
    color: design.black,
    fontSize: 18,
  },
  placeorder_1: {
    fontSize: 18,
    color: design.theme_color_parent,
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    textAlign: 'center',
  },
  placeorder_2: {
    width: '60%',
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
  },
  placeorder_3: {
    width: '20%',
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
  },

  email_text: {
    fontSize: 20,
    color: design.theme_color_child,
    marginHorizontal: 30,
    marginTop: 40,
  },
  password_text: {
    fontSize: 20,
    color: design.theme_color_child,
    marginHorizontal: 30,
    marginTop: 40,
  },
  email_input: {
    fontSize: 18,
    marginHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginTop: 10,
  },
  login_text: {
    color: '#fff',
    backgroundColor: design.theme_color_parent,
    width: 200,
    alignSelf: 'center',
    borderRadius: 25,
    fontSize: 22,
    marginTop: 40,
    textAlign: 'center',
    overflow: 'hidden',
    padding: 10,
  },
  register_text: {
    color: design.theme_color_child,
    fontSize: 18,
  },
  register2_text: {
    color: design.theme_color_parent,
    fontSize: 18,
    textAlign: 'center',
  },
  or_text: {
    fontSize: 20,
    color: design.black,
    textAlign: 'center',
    marginVertical: 20,
  },
  add_card: {
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
  cancel_order_button: {
    width: '47%',
    textAlign: 'center',
    color: '#af0808',
    padding: 14,
    fontSize: 17,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 5,
  },
  reorder_button: {
    width: '47%',
    textAlign: 'center',
    backgroundColor: '#af0808',
    color: '#fff',
    padding: 14,
    fontSize: 17,
    borderRadius: 10,
    overflow: 'hidden',
    marginLeft: 5,
  },
  scanner_text: {
    fontSize: 18,
    marginLeft: 5,
    marginTop: 8,
    color: '#af0808',
    // color: '#00a4da'
  },
  field_1_text: {
    fontSize: 18,
    color: '#af0808',
    marginTop: 3,
  },
  field_1_text_green: {
    fontSize: 18,
    color: 'green',
    marginTop: 3,
  },
  field_2_text: {
    fontSize: 18,
    color: 'green',
    marginTop: 3,
  },
  field_3_text: {
    fontSize: 14,
    color: '#a9a9a9',
    marginTop: 3,
  },
  field_4_text: {
    fontSize: 18,
    color: '#a9a9a9',
    marginTop: 3,
  },
  field_5_text: {
    fontSize: 18,
    color: '#000000',
    marginTop: 3,
  },
  status_text: {
    fontSize: 15,
    color: '#fff',
    backgroundColor: '#af0808',
    marginLeft: 10,
    textAlign: 'center',
    marginRight: 12,
    padding: 3,
    borderRadius: 3,
    overflow: 'hidden',
  },
  white_text: {
    fontSize: 26,
    color: '#fff',
    textAlign: 'center',
    height: '100%',
    width: '100%',
    marginTop: 17,
  },
  option_text: {
    fontSize: 18,
    color: '#000000',
    marginTop: 15,
  },
  pay_text: {
    fontSize: 20,
    color: '#fff',
    backgroundColor: design.theme_color_parent,
    paddingHorizontal: 80,
    paddingVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
