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
var shop_id = '';
import Toast from 'react-native-simple-toast';
var current_date;
import moment, {duration} from 'moment';
import {calculateTotals, formatDate} from '../utils';
import {getShopOrders} from '../redux/orderSlice';
import {connect} from 'react-redux';
class ShopCompleteOrderList extends Component {
  constructor(props) {
    super(props);
    rootRef = firebase.database().ref();
    this.state = {
      one_order_delete: false,
      oneday_order_delete: false,
      all_order_delete: false,
      order_list: [],
      total_discount: 0,
      cancel_order_type: '',
      select_order_id: '',
      order_prepare_status: '',
      categoryies: [],
    };
  }
  componentDidMount = () => {
    let shop_id = '60b4e3b5c9b6c030a629be29';
    this.props.getShopOrders(shop_id);
  };
  backpress = () => {
    this.props.navigation.goBack();
  };
  orderDetail = (index, order_id) => {
    this.props.navigation.navigate('ShopOrderDetail', {
      index: index,
      order_id: order_id,
    });
  };
  render() {
    const {navigation, orders, loading} = this.props;
    return (
      <View style={styles.MainContainer}>
        <AnimatedLoader
          visible={loading}
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

        <View style={{flexDirection: 'row'}}>
          <View style={{width: '15%'}} />
          <Text style={styles.order_title}>COMPLETE ORDERS</Text>
          <View style={{width: '15%'}} />
        </View>

        <FlatList
          horizontal={false}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          keyExtractor={(item) => item._id}
          data={orders}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() =>
                this.orderDetail(index, item.order_id, item.order_status)
              }
              onLongPress={this.handlerLongClick}
              style={{
                flexDirection: 'row',
                marginTop: 25,
                paddingHorizontal: 10,
              }}>
              <View
                style={{width: '20%', alignItems: 'center', paddingTop: 10}}>
                {item.charge_type == 'home_delivery' ? (
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
                ) : item.charge_type == 'pickup' ? (
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
                      Table number : {item.table_number}
                    </Text>
                  </View>
                )}
              </View>
              <View style={{width: '50%', marginLeft: 10}}>
                <Text
                  style={
                    item.charge_type == 'home_delivery'
                      ? styles.field_1_text_green
                      : styles.field_1_text
                  }>
                  {item.charge_type == 'home_delivery'
                    ? 'Delivery'
                    : item.charge_type == 'pickup'
                    ? 'Self Pickup'
                    : item.charge_type == 'table_order'
                    ? 'Table Order'
                    : null}
                </Text>
                <Text style={styles.field_3_text}>
                  {'Order id : ' + item._id.slice(-6)}
                </Text>
                <Text style={styles.field_4_text}>
                  {item.products.length} piece
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
              <View style={{width: '30%'}}>
                <Text style={styles.orderdate_text}>
                  {formatDate(item.created_date)}
                </Text>

                <Text style={styles.status_text}>{item.status}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
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
    orders: state.order.list.filter((item) => item.status === 'Complete'),
    loading: state.order.loading,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShopCompleteOrderList);
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
  gray_text: {
    fontSize: 15,
    color: 'red',
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
    fontSize: 14,
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
    textAlign: 'center',
    width: '70%',
  },
  white_text: {
    fontSize: 26,
    color: '#fff',
    textAlign: 'center',
    height: '100%',
    width: '100%',
    marginTop: 17,
  },

  field_1_text_green: {
    fontSize: 18,
    color: 'green',
    marginTop: 3,
  },
});
