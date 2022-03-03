import React, {Component} from 'react';
import {
  Text,
  View,
  StatusBar,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Platform,
  AsyncStorage,
  PermissionsAndroid,
  ScrollView,
} from 'react-native';
import design from './StyleFile';
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import QRCode from 'react-native-qrcode-svg';
var radio_props = [
  {label: 'Credit or Debit cart\nDiscount 2%', value: 0},
  {label: 'Google Pay\nDiscount 2%', value: 1},
  {label: 'Cash on Delivery', value: 2},
];
import Header from '../screens/Header';
let rootRef;
import {connect} from 'react-redux';
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
import global from './Global';
import FitImage from 'react-native-fit-image';
let grand_total = 0;
import Toast from 'react-native-simple-toast';
let shop_id = '';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
} from 'react-native-popup-dialog';
import moment, {duration} from 'moment';
let order_date = '';
let order_time = '';
import DeviceInfo from 'react-native-device-info';
var uniqueId = '',
  login = '';
import {getDistance, getPreciseDistance} from 'geolib';
import Geolocation from '@react-native-community/geolocation';
import {Dropdown} from 'react-native-material-dropdown-v2';
var current_date_time = '';
let arr_category = [];
var user_id_without_login = '';
var discount_amount = '';
let token_array_user = [];
let token_array_shop = [];
import axios from 'axios';

export async function request_device_location_runtime_permission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'ReactNativeCode Location Permission',
        message: 'ReactNativeCode App needs access to your location ',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // Alert.alert("Location Permission Granted.");
    } else {
      // Alert.alert("Location Permission Not Granted");
    }
  } catch (err) {}
}
import react_native_firebase from 'react-native-firebase';
var token = '';
var test = '';
var total_qty = 0;
import RBSheet from 'react-native-raw-bottom-sheet';
var count = 0;
import {StackActions, NavigationActions} from 'react-navigation';
import {APP_CONFIG} from '../../config';
import {
  calculateProductQuantity,
  calculateTotals,
  getRelativeDistance,
} from '../utils';
import {
  add_product,
  clear_cart,
  postOrder,
  remove_product,
  set_charge_type,
  set_discount_percent,
} from '../redux/cartSlice';
import {mapLocation} from '../redux/locationSlice';

class Tab_Cart extends Component {
  constructor(props) {
    super(props);
    (this.categoryies = []),
      (this.state = {
        loading: false,
        payment_method: 'pay01',
        delivery_type: 'pickup',
        wallet_amount: '',
        shop_name: '',
        shop_image: '',
        get_cart: false,
        shop_delivery_charges: '',
        shop_delivery_available_status: false,
        shop_table_available_status: false,
        set_delivery_charges: '00',
        shop_table_charges: '',
        grand_price: 0,
        address: '',
        table_no: '',
        note: '',
        phone_number: '',
        shop_owner_id: '',
        duration: '',
        distance: '',
        placed_order_dialog: false,
        shop_open_status: '',
        current_latitude: 0.0,
        current_longitude: 0.0,
        shop_latitude: 0.0,
        shop_longitude: 0.0,
        get_km_distance: '',
        register_first_name: '',
        register_last_name: '',
        register_user_name: '',
        register_email: '',
        register_password: '',
        register_address: '',
        register_country: '',
        register_phone_number: '',
        login_email: '',
        login_password: '',
        country_list: [],
        grand_total_without_calculate: 0,
        get_shop_id: '',
        get_data: '',
      });
  }
  async componentDidMount() {}

  card = () => {
    var get_percantage_discount =
      (this.state.grand_total_without_calculate * 2) / 100;
    discount_amount = get_percantage_discount;
    var calulate_value =
      this.state.grand_total_without_calculate - get_percantage_discount;
    this.setState({grand_price: calulate_value});

    this.setState({payment_method: 'card'});
  };
  googlepay = () => {
    var get_percantage_discount =
      (this.state.grand_total_without_calculate * 2) / 100;
    discount_amount = get_percantage_discount;
    var calulate_value =
      this.state.grand_total_without_calculate - get_percantage_discount;
    this.setState({grand_price: calulate_value});

    this.setState({payment_method: 'pay01'});
  };
  cash = () => {
    discount_amount = '0';
    this.setState({grand_price: this.state.grand_total_without_calculate});
    this.setState({payment_method: 'cash'});
  };
  pick_up = () => {
    this.setState({delivery_type: 'pickup'});
    this.props.setChargeType('pickup');
  };
  home_delivery = () => {
    this.setState({delivery_type: 'home_delivery'});
    this.props.setChargeType('home_delivery');
  };
  table_order = () => {
    this.setState({delivery_type: 'table_order'});
    this.props.setChargeType('table_order');
  };
  googlepay_wallet = () => {
    this.setState({wallet_amount: 'googlepay_wallet'});
  };
  cash_wallet = () => {
    this.setState({wallet_amount: 'cash_wallet'});
  };
  paypal_wallet = () => {
    this.setState({wallet_amount: 'paypal_wallet'});
  };
  done_button = () => {
    this.setState({placed_order_dialog: false});
    global.click = '1';
    this.props.navigation.replace('HomeScreen');
  };
  backpress = () => {
    // this.props.navigation.replace('HomeScreen');
  };
  handle_checkout = async () => {
    // this.setState({loading: true});
    const data = {
      ...this.props.cart_state,
      table_number: this.state.table_no,
      delivery_address: this.state.address,
      note: this.state.note,
    };
    this.props.navigation.navigate('Checkout', {cart: data});
    // try {
    //   await postOrder(data);
    //   this.props.clearCart();
    //   this.setState({placed_order_dialog: true});
    // } catch (e) {
    //   Toast.show('Failed to place an order!');
    // }
    // this.setState({loading: false});
  };
  render() {
    const {cart_products} = this.props;
    const {shop} = cart_products[0] || {shop: []};
    const {payment_type, discount_percent, charge_type} = this.props;
    return (
      <View style={styles.MainContainer}>
        <Header navigation={this.props.navigation} />
        <AnimatedLoader
          visible={this.state.loading}
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

        {this.props.cart_products.length !== 0 ? (
          <View>
            <ScrollView style={{marginBottom: 60}}>
              <View>
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
                        height: 80,
                        resizeMode: 'contain',
                        borderRadius: 10,
                        overflow: 'hidden',
                      }}
                      source={{
                        uri:
                          APP_CONFIG.backend_url +
                          '/image/shop/' +
                          shop.images[0],
                      }}
                    />
                  </View>
                  <View style={{width: '70%'}}>
                    <Text style={styles.title_text}>{shop.shop_name}</Text>
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 3,
                        flexDirection: 'row',
                      }}>
                      <View
                        style={{
                          width: '33%',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text maxLength={5} style={styles.km_text}>
                          {getRelativeDistance(this.props.location, {
                            latitude: shop.latitude,
                            longitude: shop.longitude,
                          })}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: '33%',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text maxLength={5} style={styles.mints_text}>
                          {'Open'}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: '33%',
                          justifyContent: 'center',
                          alignItems: 'center',
                          flexDirection: 'row',
                        }}>
                        <View
                          style={
                            shop.delivery_available == true
                              ? styles.Delivery
                              : styles.not_Delivery
                          }
                        />
                        <Text style={styles.veg_text}>
                          {shop.delivery_available == true ? 'Delivery' : null}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <Text style={styles.item_text}>ITEMS IN CART</Text>

                <FlatList
                  horizontal={false}
                  showsVerticalScrollIndicator={false}
                  numColumns={1}
                  data={cart_products}
                  renderItem={({item, index}) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        marginHorizontal: 15,
                        marginTop: 15,
                      }}>
                      <View style={{width: '45%', justifyContent: 'center'}}>
                        <Text numberOfLines={1} style={styles.productname_text}>
                          {item.product_name}
                        </Text>
                        <Text style={styles.productname_text}>
                          €{item.selling_price}
                        </Text>
                      </View>
                      <View style={{width: '40%', flexDirection: 'row'}}>
                        <TouchableOpacity
                          onPress={() => this.props.removeFromCart(item)}>
                          <Text
                            style={{
                              borderWidth: 1,
                              borderColor: '#dcdcdc',
                              paddingHorizontal: 15,
                              paddingVertical: 7,
                            }}>
                            -
                          </Text>
                        </TouchableOpacity>
                        <Text style={styles.qty_text}>
                          {calculateProductQuantity(item._id, cart_products)}
                        </Text>
                        <TouchableOpacity
                          onPress={() => this.props.addToCart(item)}>
                          <Text
                            style={{
                              borderWidth: 1,
                              borderColor: '#dcdcdc',
                              paddingHorizontal: 15,
                              paddingVertical: 7,
                            }}>
                            +
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{width: '15%', justifyContent: 'center'}}>
                        <Text style={styles.productprice_text}>
                          € {this.props.total}
                        </Text>
                      </View>
                    </View>
                  )}
                />
                <View
                  style={{height: 1, backgroundColor: '#dcdcdc', margin: 20}}
                />

                <TextInput
                  style={styles.input}
                  autoCapitalize="none"
                  returnKeyLabel={'next'}
                  multiline={true}
                  placeholder="Note"
                  onChangeText={(text) => this.setState({note: text})}
                />

                <View
                  style={{height: 1, backgroundColor: '#dcdcdc', margin: 20}}
                />
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => this.pick_up()}
                  style={{flexDirection: 'row', marginLeft: 20}}>
                  <View
                    style={
                      charge_type == 'pickup'
                        ? styles.radio_button_selected
                        : styles.radio_button_unselected
                    }
                  />
                  <View style={{flexDirection: 'column', marginLeft: 10}}>
                    <Text style={styles.debit_cart_text}>Self Pick up</Text>
                  </View>
                </TouchableOpacity>

                {shop.delivery_available == true ? (
                  <View>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => this.home_delivery()}
                      style={{
                        flexDirection: 'row',
                        marginLeft: 20,
                        marginTop: 20,
                      }}>
                      <View
                        style={
                          charge_type == 'home_delivery'
                            ? styles.radio_button_selected
                            : styles.radio_button_unselected
                        }
                      />
                      <View style={{flexDirection: 'row', marginLeft: 10}}>
                        <Text style={styles.order_type}>Home delivery</Text>
                        <Text style={styles.order_type_2}>
                          €{shop.delivery_charges}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {charge_type == 'home_delivery' ? (
                      <View>
                        <TextInput
                          style={styles.add_card}
                          autoCapitalize="none"
                          placeholder={'Add exact address'}
                          returnKeyLabel={'next'}
                          multiline={true}
                          onChangeText={(text) =>
                            this.setState({address: text})
                          }
                        />
                      </View>
                    ) : (
                      <View />
                    )}
                  </View>
                ) : null}

                {shop.table_order == true ? (
                  <View>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => this.table_order()}
                      style={{
                        flexDirection: 'row',
                        marginLeft: 20,
                        marginTop: 20,
                      }}>
                      <View
                        style={
                          this.state.delivery_type == 'table_order'
                            ? styles.radio_button_selected
                            : styles.radio_button_unselected
                        }
                      />
                      <View style={{flexDirection: 'row', marginLeft: 10}}>
                        <Text style={styles.order_type}>Table Order</Text>
                        <Text style={styles.order_type_2}>
                          €{shop.table_order_charges}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {charge_type == 'table_order' ? (
                      <View>
                        <TextInput
                          style={styles.add_card}
                          autoCapitalize="none"
                          placeholder={'Add Table Number'}
                          returnKeyLabel={'next'}
                          multiline={true}
                          onChangeText={(text) =>
                            this.setState({table_no: text})
                          }
                        />
                      </View>
                    ) : (
                      <View />
                    )}
                  </View>
                ) : null}

                <View
                  style={{
                    height: 1,
                    backgroundColor: '#dcdcdc',
                    marginHorizontal: 20,
                    marginTop: 20,
                  }}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 25,
                    marginTop: 25,
                  }}>
                  <Text style={styles.subtotal_text}>Subtotal</Text>
                  <Text style={styles.subtotalprice}>
                    {'€' + this.props.total}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 25,
                    marginTop: 10,
                  }}>
                  {this.props.charges !== 0 && (
                    <>
                      <Text style={styles.subtotal_text}>Extra Charge</Text>
                      <Text style={styles.subtotalprice}>
                        €{this.props.charges}
                      </Text>
                    </>
                  )}
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 25,
                    marginTop: 10,
                  }}>
                  <Text style={styles.subtotal_text}>Discount</Text>
                  <Text style={styles.subtotalprice}>
                    {discount_percent + ' %'}
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
                    {'€' +
                      calculateTotals(
                        this.props.total,
                        this.props.charges,
                        discount_percent,
                      )}
                  </Text>
                </View>
                {shop.payment_pos && (
                  <>
                    {/* <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => this.props.setPaymentMethod('pay01')}
                      style={{
                        flexDirection: 'row',
                        marginLeft: 20,
                        marginTop: 20,
                      }}>
                      <View
                        style={
                          payment_type == 'pay01'
                            ? styles.radio_button_selected
                            : styles.radio_button_unselected
                        }
                      />
                      <View style={{flexDirection: 'column', marginLeft: 10}}>
                        <Text style={styles.debit_cart_text}>Pay01</Text>
                        <Text style={styles.discount_text}>2% Discount</Text>
                      </View>
                    </TouchableOpacity> */}

                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => this.props.setPaymentMethod('card')}
                      style={{
                        flexDirection: 'row',
                        marginLeft: 20,
                        marginTop: 20,
                      }}>
                      <View
                        style={
                          payment_type == 'card'
                            ? styles.radio_button_selected
                            : styles.radio_button_unselected
                        }
                      />
                      <View style={{flexDirection: 'column', marginLeft: 10}}>
                        <Text style={styles.debit_cart_text}>Credit Card</Text>
                        <Text style={styles.discount_text}>2% Discount</Text>
                      </View>
                    </TouchableOpacity>
                  </>
                )}

                {shop.payment_cash && (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => this.props.setPaymentMethod('cash')}
                    style={{
                      flexDirection: 'row',
                      marginLeft: 20,
                      marginTop: 20,
                    }}>
                    <View
                      style={
                        payment_type == 'cash'
                          ? styles.radio_button_selected
                          : styles.radio_button_unselected
                      }
                    />
                    <View style={{flexDirection: 'column', marginLeft: 10}}>
                      <Text style={styles.debit_cart_text}>
                        Pay on Delivery
                      </Text>
                      <Text style={styles.discount_text} />
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
            <TouchableOpacity
              onPress={() => this.handle_checkout()}
              style={{
                position: 'absolute',
                bottom: 10,
                flexDirection: 'row',
                backgroundColor: '#ad0101',
                marginHorizontal: 20,
                borderRadius: 10,
                padding: 12,
              }}>
              <View style={{width: '20%'}}>
                <Text style={styles.placeorder_1}>{cart_products.length}</Text>
              </View>

              <Text style={styles.placeorder_2}>Place Order</Text>
              <Text style={styles.placeorder_3}>
                {'€' +
                  calculateTotals(
                    this.props.total,
                    this.props.charges,
                    discount_percent,
                  )}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}>
            <Text style={styles.nodata_found_text}>No Item In Your Cart</Text>
          </View>
        )}

        <Dialog
          onTouchOutside={() => this.touch_outside_handle()}
          width={0.9}
          visible={this.state.placed_order_dialog}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            this.setState({placed_order_dialog: false});
            return true;
          }}
          actions={[
            <DialogButton
              text="DISMISS"
              onPress={() => {
                this.setState({placed_order_dialog: false});
              }}
              key="button-1"
            />,
          ]}>
          <DialogContent>
            <View>
              <Image
                style={{
                  width: 70,
                  height: 70,
                  resizeMode: 'contain',
                  marginTop: 20,
                  alignSelf: 'center',
                }}
                source={require('./images/red_icon.png')}
              />
              <Text style={styles.dialog_subtitle_text}>
                Your Order Placed Successfully
              </Text>
              <TouchableOpacity
                onPress={() => this.done_button()}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <Text style={styles.pay_text}>Done</Text>
              </TouchableOpacity>
            </View>
          </DialogContent>
        </Dialog>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (product) => dispatch(add_product(product)),
    removeFromCart: (product) => dispatch(remove_product(product)),
    clearCart: () => dispatch(clear_cart()),
    setChargeType: (type) => dispatch(set_charge_type(type)),
    setPaymentMethod: (type) => dispatch(set_discount_percent(type)),
  };
};
const mapStateToProps = (state) => {
  return {
    cart_products: state.cart.products,
    cart_shop_id: state.cart.shop_id,
    total: state.cart.total,
    charges: state.cart.charges,
    charge_type: state.cart.charge_type,
    discount_percent: state.cart.discount_percent,
    payment_type: state.cart.payment_type,
    cart_state: state.cart,
    address: state.location.address,
    location: mapLocation(state.location.location),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Tab_Cart);

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  lottie: {
    width: 180,
    height: 180,
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
  forgotpassword_text: {
    color: design.theme_color_child,
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
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
    paddingVertical: 4,
    borderColor: '#dcdcdc',
    borderWidth: 1,
    height: 33,
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
  forgot_pass_text: {
    fontSize: 16,
    color: design.theme_color_child,
    marginHorizontal: 30,
    marginTop: 50,
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
    width: '50%',
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
  },
  placeorder_3: {
    width: '30%',
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
  },

  email_text: {
    fontSize: Platform.OS == 'ios' ? 16 : 13,
    color: design.theme_color_child,
    marginHorizontal: 30,
    marginTop: 20,
  },
  password_text: {
    fontSize: Platform.OS == 'ios' ? 16 : 13,
    color: design.theme_color_child,
    marginHorizontal: 30,
    marginTop: 40,
  },
  email_input: {
    fontSize: 18,
    marginHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginTop: Platform.OS == 'ios' ? 10 : -10,
  },
  login_text: {
    color: '#fff',
    backgroundColor: design.theme_color_parent,
    width: 200,
    alignSelf: 'center',
    borderRadius: 12,
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
    marginTop: 10,
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
  scanner_text: {
    fontSize: 18,
    marginLeft: 5,
    marginTop: 8,
    color: '#00a4da',
  },
  nodata_found_text: {
    color: design.theme_color_parent,
    fontSize: 18,
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
  dialog_title_text: {
    color: design.black,
    fontSize: 22,
    textAlign: 'center',
    marginVertical: 15,
  },
  dialog_subtitle_text: {
    color: design.black,
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 15,
  },
  debit_cart_text: {
    fontSize: 18,
    color: design.theme_color_child,
    marginTop: 6,
  },
  order_type: {
    fontSize: 18,
    color: design.theme_color_child,
    marginTop: 6,
    width: '50%',
  },
  order_type_2: {
    fontSize: 18,
    color: design.theme_color_child,
    marginTop: 6,
    width: '40%',
    textAlign: 'right',
  },
  km_text: {
    color: '#000000',
    fontSize: 15,
  },
  mints_text: {
    color: design.theme_color_child,
    fontSize: 15,
  },
  nodata_found_text: {
    color: design.black,
    fontSize: 18,
  },
  nodata_found_text_2: {
    color: design.grey,
    fontSize: 14,
    marginTop: 5,
  },
  veg_text: {
    color: design.theme_color_child,
    fontSize: 15,
    marginLeft: 3,
  },
  Delivery: {
    height: 15,
    width: 15,
    borderRadius: 8,
    backgroundColor: 'green',
  },
  not_Delivery: {
    height: 15,
    width: 15,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  Signup_text: {
    color: design.theme_color_parent,
    textAlign: 'center',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
  },
});
