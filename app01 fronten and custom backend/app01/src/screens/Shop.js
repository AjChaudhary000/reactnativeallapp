import React, {Component} from 'react';
import {
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  View,
  Switch,
  Platform,
  TextInput,
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
import FitImage from 'react-native-fit-image';
import QRCode from 'react-native-qrcode-svg';
import DraggableFlatList from 'react-native-draggable-flatlist';
let rootRef;
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
let user_id = '';
let arr_shop = [];
import {db} from './config';
import {connect} from 'react-redux';
import {deleteShop, getAllShops, setList, orderShop} from '../redux/shopSlice';
import {APP_CONFIG} from '../../config';
import {FlatList} from 'react-native-gesture-handler';
var dayname = '';
class Shop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drag_drop: false,
      shop_list: [],
      select_shop_status: false,
      select_shop_id: '',
    };
  }
  componentDidMount = () => {
    var today = new Date();
    var day = today.getDay();
    var days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    dayname = days[day];
    this.props.getAllShops();
  };

  componentDidUpdate() {
    console.log(this.props.shops);
  }
  backpress = () => {
    this.props.navigation.goBack();
  };

  shop_detail = (shop_id) => {
    this.props.navigation.navigate('Shop_Detail', {shop_id: shop_id});
  };
  QRCODE_Click = (shop_id) => {
    // this.setState({ QR_Code_Dialog: true });
    this.props.navigation.navigate('Shop_QR', {shop_id: shop_id});
  };

  // handlerLongClick = () => {
  //   this.setState({Delete_Category_Dialog: true});
  // };
  // add_card_save = () => {
  //   this.setState({Delete_Category_Dialog: true});
  // };
  delete_shop_button = () => {
    this.setState({Delete_Category_Dialog: true});
  };
  shop_option = (id) => {
    this.setState({select_shop_id: id});
    this.setState({shop_option_dialog: true});
    // if (status == 'Online') {
    //   this.setState({select_shop_status: true});
    // } else {
    //   this.setState({select_shop_status: false});
    // }
  };

  drag_drop_choose = () => {
    this.setState({shop_option_dialog: false});
    this.setState({drag_drop: true});
  };
  // done_top = () => {
  //   this.setState({drag_drop: false});
  //   var num = 0;

  //   for (var a = 0; a < this.state.shop_list.length; a++) {
  //     console.log(this.state.shop_list[a].shop_id);
  //     num = num + 1;
  //     var adaNameRef = firebase
  //       .database()
  //       .ref('shops/' + this.state.shop_list[a].shop_id);
  //     adaNameRef.update({sno: num});
  //   }
  // };
  setting = (item) => {
    this.props.navigation.navigate('Edit_Shop', {data: item});
  };
  assistant = (shop_id) => {
    this.props.navigation.navigate('ListAssistant', {shop_id: shop_id});
  };
  // shop_order_list = (shop_id) => {
  //   this.props.navigation.navigate('ShopOrderList', {shop_id: shop_id});
  // };
  // dialog_Add_Shop = () => {
  //   this.setState({Shop_Dialog: false});
  //   this.props.navigation.navigate('Add_Shop');
  // };
  // dialog_Shop_Assistence = () => {
  //   this.setState({Shop_Dialog: false});
  //   // this.props.navigation.navigate('Shop_Assistant');
  // };
  add_shop_add_assistant_dialog = () => {
    this.props.navigation.navigate('Add_Shop');
    // this.setState({Shop_Dialog: true});
  };
  // switch_button = (value) => {
  //   if (value == true) {
  //     var adaNameRef = firebase
  //       .database()
  //       .ref('shops/' + this.state.select_shop_id);
  //     adaNameRef.update({shop_status: 'Online'});
  //     this.setState({select_shop_status: true});
  //   } else {
  //     var adaNameRef = firebase
  //       .database()
  //       .ref('shops/' + this.state.select_shop_id);
  //     adaNameRef.update({shop_status: 'Offline'});
  //     this.setState({select_shop_status: false});
  //   }
  //   this.setState({shop_option_dialog: false});
  // };
  POS = () => {
    this.props.navigation.navigate('POS');
  };
  delete_shop_click = () => {
    this.setState({shop_option_dialog: false});
    this.setState({delete_shop_conformation_dialog: true});
  };
  delete_done = async () => {
    await deleteShop({_id: this.state.select_shop_id});
    this.setState({delete_shop_conformation_dialog: false});
    this.props.getAllShops();
  };
  messages = (shop_id) => {
    this.props.navigation.navigate('ShopMessages', {shop_id: shop_id});
  };
  draghandle = (data) => {
    this.props.setShopList(data);
    this.setState({drag_drop: false});
    const list = data.map((d) => d._id);
    orderShop({list});
  };
  render() {
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
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
              marginBottom: 15,
              width: '80%',
            }}>
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

          {this.state.drag_drop == true ? (
            <TouchableOpacity onPress={() => this.done_top()}>
              <Text style={styles.done_text}>Done</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={() => this.add_shop_add_assistant_dialog()}
          style={{flexDirection: 'row', marginLeft: 30, marginTop: 25}}>
          <Image
            style={{width: 30, height: 30, resizeMode: 'contain'}}
            source={require('./images/add_new.png')}
          />
          <Text style={styles.add_card_text}>Add Shop</Text>
        </TouchableOpacity>

        <DraggableFlatList
          data={this.props.shops}
          style={{marginBottom: 30}}
          renderItem={({item, index, drag}) => (
            <View style={{flexDirection: 'row'}}>
              {this.state.drag_drop == true ? (
                <TouchableOpacity
                  style={{flexDirection: 'column'}}
                  onLongPress={drag}>
                  <FitImage
                    style={{
                      width: 30,
                      height: 30,
                      resizeMode: 'contain',
                      overflow: 'hidden',
                      marginTop: 40,
                      marginLeft: 25,
                    }}
                    source={require('./images/drag.png')}
                  />
                </TouchableOpacity>
              ) : null}

              <View
                style={{
                  flexDirection: 'column',
                  marginLeft: 30,
                  marginTop: 35,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={{flexDirection: 'row', width: '90%'}}>
                    <FitImage
                      style={{
                        width: 70,
                        height: 70,
                        resizeMode: 'contain',
                        borderRadius: 10,
                        overflow: 'hidden',
                      }}
                      source={{
                        uri:
                          APP_CONFIG.backend_url +
                          '/image/shop/' +
                          item.images[0],
                      }}
                    />
                    <View>
                      <Text style={styles.resturent_text}>
                        {item.shop_name}
                      </Text>

                      {/* {item.shop_timing.map((s) => (
                        <View>
                          <Text style={[styles.resturent_text, {fontSize: 12}]}>
                            {'Open Time : ' + s.open_time + ' (' + s.day + ')'}
                          </Text>
                          <Text style={[styles.resturent_text, {fontSize: 12}]}>
                            {'Closed Time : ' +
                              s.closed_time +
                              ' (' +
                              s.day +
                              ')'}
                          </Text>
                        </View>
                      ))} */}
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.shop_option(item._id)}>
                    <FitImage
                      style={{
                        width: 30,
                        height: 30,
                        resizeMode: 'contain',
                        overflow: 'hidden',
                      }}
                      source={require('./images/dots.png')}
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => this.setting(item)}>
                  <Text style={styles.fields_text}>Setting</Text>
                </TouchableOpacity>

                {this.props.type !== 'ass' && (
                  <TouchableOpacity onPress={() => this.assistant(item._id)}>
                    <Text style={styles.fields_text}>Assistant</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => this.messages(item._id)}>
                  <Text style={styles.fields_text}>Messages</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.QRCODE_Click(item._id)}>
                  <Text style={styles.fields_text}>QR Code</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.POS()}>
                  <Text style={styles.fields_text}>POS</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.shop_detail(item._id)}>
                  <Text style={styles.fields_text}>My Shop</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => this.shop_order_list(item.shop_id)}
                  style={{flexDirection: 'row'}}>
                  <Text style={styles.fields_text}>Shop Order List</Text>
                  {/* {item.notification_count != '0' ? ( */}
                  <View
                    style={{
                      height: 20,
                      width: 20,
                      borderRadius: 10,
                      backgroundColor: design.theme_color_parent,
                      overflow: 'hidden',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: 10,
                      marginTop: 7,
                    }}>
                    <Text style={{color: design.white, fontSize: 15}}>
                      {item.orders ? item.orders.length : 0}
                    </Text>
                  </View>
                  {/* ) : null} */}
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item, index) => `draggable-item-${item._id}`}
          onDragEnd={({data}) => this.draghandle(data)}
        />

        <Dialog
          onTouchOutside={() => {
            this.setState({Delete_Category_Dialog: false});
          }}
          width={0.9}
          visible={this.state.Delete_Category_Dialog}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            this.setState({Delete_Category_Dialog: false});
            return true;
          }}
          actions={[
            <DialogButton
              text="DISMISS"
              onPress={() => {
                this.setState({Delete_Category_Dialog: false});
              }}
              key="button-1"
            />,
          ]}>
          <DialogContent>
            <View>
              <Text style={styles.add_card_text_2}>Confirmation</Text>
              <Text style={styles.input}>
                Are you want to sure to delete your shop ?
              </Text>
              <TouchableOpacity
                onPress={() => this.delete_shop_button()}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 50,
                }}>
                <Text style={styles.pay_text}>Yes</Text>
              </TouchableOpacity>
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          onTouchOutside={() => {
            this.setState({shop_option_dialog: false});
          }}
          width={0.9}
          visible={this.state.shop_option_dialog}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            this.setState({shop_option_dialog: false});
            return true;
          }}
          actions={[
            <DialogButton
              text="DISMISS"
              onPress={() => {
                this.setState({shop_option_dialog: false});
              }}
              key="button-1"
            />,
          ]}>
          <DialogContent>
            <View>
              <TouchableOpacity onPress={() => this.delete_shop_click()}>
                <Text style={styles.input}>Delete shop</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.drag_drop_choose()}>
                <Text style={styles.input}>Move</Text>
              </TouchableOpacity>
              {/* <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 10,
                }}>
                <Switch
                  style={{alignSelf: 'center'}}
                  value={this.state.select_shop_status}
                  onValueChange={(value) => this.switch_button(value)}
                />
                <Text style={styles.shop_statusinput}>Shop Open Status</Text>
              </View> */}
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          onTouchOutside={() => {
            this.setState({Shop_Dialog: false});
          }}
          width={0.9}
          visible={this.state.Shop_Dialog}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            this.setState({Shop_Dialog: false});
            return true;
          }}
          actions={[
            <DialogButton
              text="DISMISS"
              onPress={() => {
                this.setState({Shop_Dialog: false});
              }}
              key="button-1"
            />,
          ]}>
          <DialogContent>
            <View>
              <TouchableOpacity
                onPress={() => this.dialog_Add_Shop()}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 30,
                }}>
                <Text style={styles.button}>New Shop</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.dialog_Shop_Assistence()}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <Text style={styles.button}>Shop Assistant</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.new_input}
                autoCapitalize="none"
                placeholder={'Password'}
                returnKeyLabel={'next'}
                onChangeText={(text) => this.setState({username: text})}
              />
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          onTouchOutside={() => {
            this.setState({delete_shop_conformation_dialog: false});
          }}
          width={0.9}
          visible={this.state.delete_shop_conformation_dialog}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            this.setState({delete_shop_conformation_dialog: false});
            return true;
          }}
          actions={[
            <DialogButton
              text="DISMISS"
              onPress={() => {
                this.setState({delete_shop_conformation_dialog: false});
              }}
              key="button-1"
            />,
          ]}>
          <DialogContent>
            <View>
              <Text style={styles.delete_shop_alert}>
                THE SHOP WILL BE DELETED
              </Text>
              <TouchableOpacity
                onPress={() => this.delete_done()}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 30,
                }}>
                <Text style={styles.deletebutton}>OK</Text>
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
    getAllShops: () => dispatch(getAllShops()),
    setShopList: (list) => dispatch(setList(list)),
  };
};
const mapStateToProps = (state) => {
  return {
    shops: state.shop.list,
    loading: state.shop.loading,
    type: state.user.type,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Shop);
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
  add_card_text: {
    fontSize: 20,
    color: '#000000',
    marginLeft: 10,
  },
  done_text: {
    fontSize: 20,
    color: '#000000',
    alignSelf: 'center',
    marginTop: 10,
    color: '#af0808',
  },
  add_card_text_2: {
    fontSize: 20,
    color: '#000000',
    marginLeft: 10,
    textAlign: 'center',
    marginVertical: 15,
  },
  cardno_text: {
    fontSize: 20,
    color: '#000000',
    marginLeft: 10,
    alignSelf: 'center',
  },
  resturent_text: {
    fontSize: 20,
    color: '#000000',
    marginLeft: 10,
  },
  shop_online_text: {
    fontSize: 16,
    color: 'green',
    marginTop: 7,
    marginLeft: 10,
  },
  shop_offline_text: {
    fontSize: 16,
    color: 'red',
    marginTop: 7,
    marginLeft: 10,
  },
  fields_text: {
    fontSize: 16,
    color: '#000000',
    marginTop: 7,
  },
  input: {
    paddingBottom: Platform.OS === 'ios' ? 5 : 0,
    textAlign: 'center',
    fontSize: 18,
    marginTop: 10,
  },
  shop_statusinput: {
    paddingBottom: Platform.OS === 'ios' ? 5 : 0,
    textAlign: 'center',
    fontSize: 18,
    marginLeft: 5,
    marginTop: 3,
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
  },
  button: {
    width: '80%',
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
    backgroundColor: design.theme_color_parent,
    paddingVertical: 14,
    borderRadius: 12,
    overflow: 'hidden',
  },
  new_input: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    paddingBottom: Platform.OS === 'ios' ? 5 : 0,
    marginHorizontal: 40,
    fontSize: 18,
    marginTop: 30,
  },
  delete_shop_alert: {
    paddingBottom: Platform.OS === 'ios' ? 5 : 0,
    textAlign: 'center',
    fontSize: 20,
    marginTop: 15,
  },
  deletebutton: {
    width: '60%',
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
    backgroundColor: design.theme_color_parent,
    paddingVertical: 14,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
