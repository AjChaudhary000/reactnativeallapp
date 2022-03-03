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
let rootRef;
import firebase from 'firebase';
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
import {connect} from 'react-redux';
import {calculateTotals} from '../utils';
import {APP_CONFIG} from '../../config';
import {getShopOrders, updateOrder} from '../redux/orderSlice';
class ShopOrderDetail extends Component {
  constructor(props) {
    super(props);
    (this.categoryies = []),
      (this.state = {
        spinner: false,
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
        user_name: '',
        user_image: '',
        user_number: '',
        shop_id: '',
        confirmation_text: '',
        delievered_address: '',
      });
  }

  backpress = () => {
    this.props.navigation.goBack();
  };
  componentDidMount = () => {};

  call_button = () => {
    if (this.state.shop_owner_id == user_id) {
      let phoneNumber = '';
      var number = this.state.user_number;
      if (Platform.OS === 'android') {
        phoneNumber = 'tel:' + number;
      } else {
        phoneNumber = 'telprompt:' + number;
      }

      Linking.openURL(phoneNumber);
    } else {
      Toast.show('You are not owner this shop');
    }
  };
  chat_button = () => {
    if (this.state.shop_owner_id == user_id) {
      //   this.props.navigation.navigate('MessageScreen', {
      //     id: this.state.order_user_id,
      //     shop_name: this.state.shop_name,
      //   });
    } else {
      Toast.show('You are not a owner of this shop');
    }
  };
  cancel_order = () => {
    if (this.state.order_status == 'Processing') {
      var adaNameRef = firebase.database().ref('/order/' + order_id);
      adaNameRef.update({order_status: 'Cancel'});
      this.props.navigation.goBack();
    }
  };
  options = () => {
    this.setState({options_dialog: true});
  };
  click_handle = (text) => {
    if (text == 'cancel_order') {
      this.setState({confirmation_text: 'Order Will Be Cancel'});
    } else if (text == 'complete_order') {
      this.setState({confirmation_text: 'Complete Order'});
    } else if (text == 'back_to_list') {
      this.setState({confirmation_text: 'Order Will Be Move In Order List'});
    } else {
      console.log('error');
    }
    this.setState({options_dialog: false});
    this.setState({confirmation_dialog: true});
  };
  ok_button_handle = async () => {
    const data = this.props.navigation.getParam('data');
    if (data.status === 'Complete' || data.status === 'Cancelled') {
      Toast.show('You cannot do this action');
      return;
    }
    this.setState({spinner: true});
    if (this.state.confirmation_text == 'Order Will Be Cancel') {
      await updateOrder({_id: data._id, status: 'Cancelled'});
    } else if (this.state.confirmation_text == 'Complete Order') {
      await updateOrder({_id: data._id, status: 'Complete'});
    }
    this.setState({
      spinner: false,
      confirmation_dialog: false,
      options_dialog: false,
    });
    this.props.getShopOrders(data.shop_id);
    this.props.navigation.goBack();
  };

  render() {
    const {navigation} = this.props;
    const data = navigation.getParam('data');
    return (
      <View style={styles.MainContainer}>
        <AnimatedLoader
          visible={this.state.spinner}
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
          <View style={{width: '85%', flexDirection: 'row'}}>
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

          <TouchableOpacity
            onPress={() => this.options()}
            style={{width: '15%'}}>
            <Image
              style={{width: 30, height: 30, resizeMode: 'contain'}}
              source={require('./images/menu.png')}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={{marginBottom: 80}}>
          <View>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                marginTop: 25,
                marginHorizontal: 25,
              }}>
              <View style={{width: '20%', alignSelf: 'center'}}>
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

              <View style={{width: '55%', marginLeft: 10}}>
                <Text
                  style={
                    data.charge_type == 'home_delivery'
                      ? styles.field_1_text_green
                      : styles.field_1_text
                  }>
                  {data.charge_type == 'home_delivery'
                    ? 'Delivery'
                    : this.state.order_type == 'pickup'
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
              <View style={{width: '25%', alignSelf: 'center'}}>
                <Text style={styles.status_text}>{data.status}</Text>
              </View>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 30,
                marginVertical: 20,
              }}>
              <View style={{width: '20%'}}>
                <FitImage
                  style={{
                    width: 60,
                    height: 60,
                    resizeMode: 'contain',
                    borderRadius: 30,
                    overflow: 'hidden',
                  }}
                  source={{
                    uri:
                      APP_CONFIG.backend_url +
                      '/image/avatar/' +
                      data.user.avatar,
                  }}
                />
              </View>
              <View style={{width: '80%', justifyContent: 'center'}}>
                <Text style={styles.userdetail_text}>
                  {data.user.first_name + ' ' + data.user.last_name}
                </Text>
                <Text style={styles.userdetail_text}>{data.user.phone}</Text>
              </View>
            </View>

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

            <Text style={styles.datetime_text}>
              Date : {new Date(data.created_date).toLocaleDateString()}
            </Text>
            <Text style={styles.datetime_text}>
              Time : {new Date(data.created_date).toLocaleTimeString()}
            </Text>
            <Text style={styles.item_text}>ITEMS IN CART</Text>

            <FlatList
              horizontal={false}
              showsVerticalScrollIndicator={false}
              numColumns={1}
              data={data.products}
              renderItem={({item, index}) => (
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 15,
                    marginTop: 15,
                  }}>
                  <View style={{width: '50%', justifyContent: 'center'}}>
                    <Text numberOfLines={1} style={styles.productname_text}>
                      {item.product_name}
                    </Text>
                  </View>
                  <View style={{width: '35%', flexDirection: 'row'}}>
                    <Text
                      style={{
                        borderWidth: 1,
                        borderColor: '#dcdcdc',
                        paddingHorizontal: 15,
                        paddingVertical: 7,
                      }}>
                      -
                    </Text>
                    <Text style={styles.qty_text}>{item.quantity}</Text>
                    <Text
                      style={{
                        borderWidth: 1,
                        borderColor: '#dcdcdc',
                        paddingHorizontal: 15,
                        paddingVertical: 7,
                      }}>
                      +
                    </Text>
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

        {data.status === 'Complete' ? null : (
          <View
            style={{
              position: 'absolute',
              bottom: 30,
              alignItems: 'flex-end',
              flexDirection: 'row',
              alignSelf: 'flex-end',
              paddingRight: 30,
            }}>
            <TouchableOpacity
              onPress={() => this.click_handle('complete_order')}
              //  onPress={() => this.cancel_button()}
            >
              <Image
                style={{
                  alignSelf: 'center',
                  width: 40,
                  height: 40,
                  resizeMode: 'contain',
                }}
                source={require('./images/save.png')}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.chat_button()}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 40,
                  height: 40,
                  resizeMode: 'contain',
                  marginHorizontal: 20,
                }}
                source={require('./images/iconn_2.png')}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.call_button()}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 40,
                  height: 40,
                  resizeMode: 'contain',
                }}
                source={require('./images/iconn_3.png')}
              />
            </TouchableOpacity>
          </View>
        )}

        <Dialog
          onTouchOutside={() => {
            this.setState({options_dialog: false});
          }}
          width={0.6}
          dialogStyle={{
            alignSelf: 'flex-end',
            marginTop: -5,
            position: 'absolute',
            top: Platform.OS == 'ios' ? 100 : 60,
            right: 10,
          }}
          visible={this.state.options_dialog}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            console.log('onHardwareBackPress');
            this.setState({options_dialog: false});
            return true;
          }}
          actions={[
            <DialogButton
              text="DISMISS"
              onPress={() => {
                this.setState({options_dialog: false});
              }}
              key="button-1"
            />,
          ]}>
          <DialogContent>
            <View>
              <TouchableOpacity
                onPress={() => this.click_handle('cancel_order')}>
                <Text style={styles.option_text}>Cancel Order</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.click_handle('complete_order')}>
                <Text style={styles.option_text}>Complete Order</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity onPress={() => this.click_handle('back_to_list')}>
								<Text style={styles.option_text}>Move To Order List</Text>
							</TouchableOpacity> */}
            </View>
          </DialogContent>
        </Dialog>

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
                {this.state.confirmation_text}
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
  return {
    getShopOrders: (id) => dispatch(getShopOrders(id)),
  };
};
const mapStateToProps = (state) => {
  return {
    // orders: state.order.list.filter((item) => item.status !== 'Complete'),
    // loading: state.order.loading,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ShopOrderDetail);
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
  datetime_text: {
    fontSize: 18,
    color: design.black,
    marginHorizontal: 15,
    marginTop: 10,
  },
  userdetail_text: {
    fontSize: 17,
    color: design.grey,
    marginHorizontal: 15,
    marginBottom: 5,
  },
  userdetail_text_green: {
    fontSize: 17,
    color: 'green',
    marginHorizontal: 15,
    marginBottom: 5,
  },
  userdetail_text_red: {
    fontSize: 17,
    color: design.theme_color_parent,
    marginHorizontal: 15,
    marginBottom: 5,
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
    fontSize: 23,
    color: '#fff',
    marginTop: 15,
    textAlign: 'center',
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
