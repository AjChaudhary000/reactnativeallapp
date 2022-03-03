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
  Switch,
  AsyncStorage,
} from 'react-native';
import design from './StyleFile';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
} from 'react-native-popup-dialog';
let rootRef;
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
import global from './Global';
let user_id = '';
let arr_order = [];
import FitImage from 'react-native-fit-image';
var get_total_discount = 0;
import Toast from 'react-native-simple-toast';
var current_date;
import moment, {duration} from 'moment';
import {connect} from 'react-redux';
import {getOrders} from '../redux/orderSlice';
import {APP_CONFIG} from '../../config';
import {calculateTotals, formatDate, totalDiscount} from '../utils';
var get_shop_owner_id = '';
class Myorder extends Component {
  constructor(props) {
    super(props);
    rootRef = firebase.database().ref();
    (this.categoryies = []),
      (this.state = {
        one_order_delete: false,
        oneday_order_delete: false,
        all_order_delete: false,
        order_list: [],
        total_discount: 0,
        cancel_order_type: '',
        select_order_id: '',
        order_prepare_status: '',
      });
  }
  componentDidMount = () => {
    this.props.getOrders();
  };
  backpress = () => {
    this.props.navigation.goBack();
  };
  orderDetail = (item) => {
    this.props.navigation.navigate('OrderDetail', {
      data: item,
    });
  };
  handlerLongClick = () => {
    // this.setState({delete_order_dialog: true});
  };
  oneorder_switch = (value) => {
    this.setState({one_order_delete: value});
    this.setState({oneday_order_delete: false});
    this.setState({all_order_delete: false});
    this.setState({cancel_order_type: 'current_order_delete'});
  };
  oneday_switch = (value) => {
    this.setState({one_order_delete: false});
    this.setState({oneday_order_delete: value});
    this.setState({all_order_delete: false});
    this.setState({cancel_order_type: 'current_day_delete'});
  };
  allorder_switch = (value) => {
    this.setState({one_order_delete: false});
    this.setState({oneday_order_delete: false});
    this.setState({all_order_delete: value});
    this.setState({cancel_order_type: 'all_order_delete'});
  };
  order_cancel = (order_id, status, actual_status, shop_owner_id) => {
    this.setState({delete_order_dialog: true});
    this.setState({select_order_id: order_id});
    this.setState({order_prepare_status: actual_status});
    get_shop_owner_id = shop_owner_id;
  };
  render() {
    const {orders} = this.props;
    return (
      <View style={styles.MainContainer}>
        <AnimatedLoader
          visible={this.props.loading}
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
        <Text style={styles.total_discount}>
          App01 Total Discount € {totalDiscount(orders)}
        </Text>

        <FlatList
          horizontal={false}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          data={orders}
          keyExtractor={(item) => item._id}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => this.orderDetail(item)}
              onLongPress={this.handlerLongClick}
              style={{
                flexDirection: 'row',
                marginTop: 25,
                paddingHorizontal: 10,
              }}>
              <View
                style={{width: '20%', alignItems: 'center', paddingTop: 10}}>
                <FitImage
                  style={{
                    width: 60,
                    height: 60,
                    resizeMode: 'contain',
                    borderRadius: 10,
                    overflow: 'hidden',
                  }}
                  source={{
                    uri:
                      APP_CONFIG.backend_url +
                      '/image/shop/' +
                      item.products[0].shop.images[0],
                  }}
                />
              </View>
              <View style={{width: '50%'}}>
                {/* {
                                    item.order_type=='Delivery'
                                    ?
                                    <Text style={styles.field_2_text}>{item.order_type}</Text>
                                    :
                                    <Text style={styles.field_1_text}>{item.order_type}</Text>
                                } */}
                <Text style={styles.field_1_text}>
                  {item.products[0].shop.shop_name}
                </Text>
                <Text style={styles.field_3_text}>
                  {'Order id : ' + item._id.slice(0, 6)}
                </Text>
                <Text style={styles.field_4_text}>
                  {item.products.length} Items
                </Text>
                <Text style={styles.field_5_text}>
                  {'€ ' +
                    calculateTotals(
                      item.total,
                      item.charges,
                      item.discount_percent,
                    )}
                </Text>
              </View>
              <View style={{width: '25%'}}>
                <Text style={styles.orderdate_text}>
                  {formatDate(item.created_date)}
                </Text>

                <Text style={styles.status_text}>
                  {item.payment_type == 'cash' ? 'Unpaid' : 'Paid'}
                </Text>
                <Text
                  style={
                    item.status == 'Pending'
                      ? styles.green_text
                      : item.status == 'Cancelled'
                      ? styles.red_text
                      : styles.gray_text
                  }>
                  {item.status}
                </Text>
              </View>

              {item.actual_status == 'New Order' ? (
                <TouchableOpacity
                  style={{width: '5%'}}
                  onPress={() =>
                    this.order_cancel(
                      item.order_id,
                      item.order_status,
                      item.actual_status,
                      item.shop_owner_id,
                    )
                  }>
                  <Image
                    style={{
                      width: 20,
                      height: 30,
                      resizeMode: 'contain',
                      borderRadius: 10,
                      overflow: 'hidden',
                    }}
                    source={require('./images/dots.png')}
                  />
                </TouchableOpacity>
              ) : null}
            </TouchableOpacity>
          )}
        />

        <Dialog
          onTouchOutside={() => {
            this.setState({delete_order_dialog: false});
          }}
          width={0.9}
          visible={this.state.delete_order_dialog}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            console.log('onHardwareBackPress');
            this.setState({delete_order_dialog: false});
            return true;
          }}
          actions={[
            <DialogButton
              text="DISMISS"
              onPress={() => {
                this.setState({delete_order_dialog: false});
              }}
              key="button-1"
            />,
          ]}>
          <DialogContent>
            <View>
              <Text style={styles.add_card_text_2}>Confirmation</Text>

              <View style={{flexDirection: 'row', marginTop: 30}}>
                <Text style={styles.order_title}>Delete This Order</Text>
                <Switch
                  style={{width: '20%'}}
                  value={this.state.one_order_delete}
                  onValueChange={(value) => this.oneorder_switch(value)}
                />
              </View>

              <View style={{flexDirection: 'row', marginTop: 30}}>
                <Text style={styles.order_title}>Delete All Day Orders</Text>
                <Switch
                  style={{width: '20%'}}
                  value={this.state.oneday_order_delete}
                  onValueChange={(value) => this.oneday_switch(value)}
                />
              </View>

              <View style={{flexDirection: 'row', marginTop: 30}}>
                <Text style={styles.order_title}>Delete All Orders</Text>
                <Switch
                  style={{width: '20%'}}
                  value={this.state.all_order_delete}
                  onValueChange={(value) => this.allorder_switch(value)}
                />
              </View>

              <TouchableOpacity
                onPress={() => this.saved_pin()}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 50,
                }}>
                <Text style={styles.pay_text}>Submit</Text>
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
    // getUserProfile: () => dispatch(getUserProfile()),
    getOrders: () => dispatch(getOrders()),
  };
};
const mapStateToProps = (state) => {
  return {
    orders: state.order.list,
    // userProfile: state.user.userDetails,
    loading: state.order.loading,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Myorder);
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
  cardno_text: {
    fontSize: 20,
    color: '#000000',
    marginLeft: 10,
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
  field_1_text: {
    fontSize: 18,
    color: '#000',
    marginTop: 3,
  },
  field_2_text: {
    fontSize: 18,
    color: 'green',
    marginTop: 3,
  },
  field_3_text: {
    fontSize: 15,
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
  red_text: {
    fontSize: 15,
    color: 'red',
    marginTop: 8,
    textAlign: 'center',
  },
  gray_text: {
    fontSize: 15,
    color: 'gray',
    marginTop: 8,
    textAlign: 'center',
  },
  green_text: {
    fontSize: 15,
    color: 'green',
    marginTop: 8,
    textAlign: 'center',
  },
  total_discount: {
    fontSize: 18,
    color: '#000000',
    marginTop: 13,
    marginHorizontal: 20,
  },
  orderdate_text: {
    fontSize: 12,
    color: '#000',
    marginBottom: 8,
    textAlign: 'center',
  },
  add_card_text_2: {
    fontSize: 20,
    color: '#000000',
    marginLeft: 10,
    textAlign: 'center',
    marginVertical: 15,
  },
  pay_text: {
    fontSize: 20,
    color: '#fff',
    backgroundColor: design.theme_color_parent,
    paddingHorizontal: 80,
    paddingVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  order_title: {
    fontSize: 20,
    color: '#000000',
    width: '80%',
  },
});
