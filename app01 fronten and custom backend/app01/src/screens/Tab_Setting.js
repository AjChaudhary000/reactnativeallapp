import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Switch,
  TextInput,
  AsyncStorage,
  StatusBar,
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
import global from './Global';
let rootRef;
import {StackActions, NavigationActions} from 'react-navigation';
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
let user_id = '';
import FitImage from 'react-native-fit-image';
import Toast from 'react-native-simple-toast';
import {connect} from 'react-redux';
import {getUserProfile, clearUser} from '../redux/userSlice';
import {APP_CONFIG} from '../../config';
import {removeJWTToken} from '../redux/helpers';
import OnBoarding from './OnBoarding';
let pin_title = '';
let get_device_token = '';
class Tab_Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scaleAnimationDialog: false,
      Addshop: false,
      switchValue: false,
      switch_arabic: false,
      Shop_Dialog: false,
      first_name: '',
      last_name: '',
      image: '',
      Create_Pin_Dialog: false,
      pin_number: '',
      confirm_pin_number: '',
      pin_enter: '',
      pin_enable: true,
      user_pin: '',
      shop_order_notifications_count: 0,
      legal_text: '',
      email: '',
      pin: '',
    };
  }
  componentDidMount = () => {
    this.props.getUserProfile();
  };
  logout = async () => {
    await removeJWTToken();
    this.setState({scaleAnimationDialog: false});
    this.props.clearUser();
    this.props.navigation.navigate('HomeScreen');
  };
  my_account = () => {
    this.props.navigation.navigate('Myaccount', {user_id: user_id});
  };
  my_orders = () => {
    this.props.navigation.navigate('Myorder');
  };
  legal = () => {
    this.props.navigation.navigate('Legal', {text: this.state.legal_text});
  };
  favorite = () => {
    this.props.navigation.navigate('Favorite');
  };
  addshop = () => {
    this.props.navigation.navigate('Shop');
  };
  POS = () => {
    console.log(this.props.userProfile);
    if (this.props.userProfile.onboarded) {
      this.props.navigation.navigate('POS');
    } else {
      this.props.navigation.navigate('OnBoarding');
    }
  };
  updateLanguageEnglish = (value) => {
    this.setState({switchValue: value, switch_arabic: !value});
  };
  create_pin = () => {
    if (this.state.pin_enable == true) {
      pin_title = 'Enter a PIN';
    } else {
      pin_title = 'Create a PIN';
    }

    this.setState({Create_Pin_Dialog: true});
  };
  saved_pin = () => {
    console.log('work');
    this.setState({Create_Pin_Dialog: false});
    this.props.navigation.navigate('Shop');
  };

  add_app01_bank = () => {
    if (this.state.pin_enable == false) {
      if (this.state.pin_number == '') {
        Toast.show('Enter Pin');
      } else if (this.state.confirm_pin_number == '') {
        Toast.show('Enter Confirm Pin');
      } else if (this.state.pin_number != this.state.confirm_pin_number) {
        Toast.show('Enter Confirm Pin not matched');
      } else {
        this.setState({spinner: true});
        let postRef = firebase.database().ref('/user_cart_pin/' + user_id);
        postRef
          .set({
            created: new Date().getTime(),
            pin: this.state.pin_number,
            user_id: user_id,
          })
          .then((res) => {
            this.setState({spinner: false});
            this.setState({Create_Pin_Dialog: false});
          })
          .catch((error) => console.log(error));
      }
    } else {
      if (this.state.pin_enter == '') {
        Toast.show('Enter Pin');
      } else if (this.state.pin_enter != this.state.user_pin) {
        Toast.show('This is invalid PIN, please enter valid PIN');
      } else {
        this.props.navigation.navigate('App01');
        this.setState({Create_Pin_Dialog: false});
      }
    }
  };

  send_pin = () => {
    this.setState({spinner: true});
    var data = new FormData();
    data.append('email', this.state.email),
      data.append('otp', this.state.pin),
      console.log(data);
    fetch('https://digittrix.com/staging/app01/send_email', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: data,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({spinner: false});
        console.log(responseJson);
        if (responseJson.status == 'success') {
          this.setState({Create_Pin_Dialog: false});
          this.setState({alert_dialog: true});
        }
      })
      .catch((error) => {
        this.setState({spinner: false});
        alert(error);
      });
  };
  render() {
    const {userProfile} = this.props;
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
        <View style={{flexDirection: 'row', margin: 25}}>
          <View style={{width: '20%'}}>
            <FitImage
              style={{
                alignSelf: 'center',
                width: 80,
                height: 80,
                borderRadius: 40,
                resizeMode: 'contain',
                borderWidth: 1,
                borderColor: '#dcdcdc',
                overflow: 'hidden',
              }}
              source={
                userProfile.avatar
                  ? {
                      uri:
                        APP_CONFIG.backend_url +
                        '/image/avatar/' +
                        userProfile.avatar,
                    }
                  : require('./images/avatar.png')
              }
            />
          </View>
          <View style={{width: '60%', marginLeft: 30}}>
            <Text style={styles.name_text}>
              {userProfile.first_name + ' ' + userProfile.last_name}
            </Text>
          </View>
          <TouchableOpacity
            style={{width: '20%'}}
            onPress={() => {
              this.setState({scaleAnimationDialog: true});
            }}>
            <Text style={styles.logout_text}>Logout</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => this.my_account()}
          style={{flexDirection: 'row', marginHorizontal: 25, marginTop: 10}}>
          <Image
            style={{
              width: 30,
              height: 30,
              resizeMode: 'contain',
              tintColor: design.theme_color_child,
            }}
            // source={require('./images/profile.png')} />
            source={require('./images/profile.png')}
          />
          <Text style={styles.myaccount_text}>My Account</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          onPress={() => this.create_pin()}
          style={{flexDirection: 'row', marginHorizontal: 25, marginTop: 15}}>
          <Image
            style={{
              width: 30,
              height: 30,
              resizeMode: 'contain',
              tintColor: '#a9a9a9',
            }}
            source={require('./images/wallet.png')}
          />
          <Text style={styles.myaccount_text}>pay01</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={() => this.my_orders()}
          style={{flexDirection: 'row', marginHorizontal: 25, marginTop: 15}}>
          <Image
            style={{
              width: 30,
              height: 30,
              resizeMode: 'contain',
              tintColor: design.theme_color_child,
            }}
            // source={require('./images/cart.png')} />
            source={require('./images/cart.png')}
          />
          <Text style={styles.myaccount_text}>My Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.legal()}
          style={{flexDirection: 'row', marginHorizontal: 25, marginTop: 15}}>
          <Image
            style={{
              width: 30,
              height: 30,
              resizeMode: 'contain',
              tintColor: '#a9a9a9',
            }}
            source={require('./images/wallet.png')}
          />
          <Text style={styles.myaccount_text}>Legal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.favorite()}
          style={{flexDirection: 'row', marginHorizontal: 25, marginTop: 15}}>
          <Image
            style={{width: 30, height: 30, resizeMode: 'contain'}}
            source={require('./images/heart2.png')}
          />
          <Text style={styles.myaccount_text}>Favorite</Text>
        </TouchableOpacity>

        <View
          style={{
            height: 1,
            backgroundColor: '#dcdcdc',
            marginTop: 15,
            marginHorizontal: 10,
          }}
        />

        <TouchableOpacity
          onPress={() => this.addshop()}
          style={{flexDirection: 'row', marginHorizontal: 25, marginTop: 15}}>
          <Image
            style={{
              width: 30,
              height: 30,
              resizeMode: 'contain',
              tintColor: design.theme_color_child,
            }}
            source={require('./images/cart.png')}
          />
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.myaccount_text}>Shop</Text>
            {this.state.shop_order_notifications_count != 0 ? (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 41,
                  width: 25,
                  height: 25,
                  borderRadius: 12,
                  backgroundColor: design.theme_color_parent,
                  overflow: 'hidden',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: 30,
                  marginTop: 7,
                }}>
                <Text style={{color: design.white, fontSize: 15}}>
                  {this.state.shop_order_notifications_count}
                </Text>
              </View>
            ) : null}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.POS()}
          style={{flexDirection: 'row', marginHorizontal: 25, marginTop: 15}}>
          <Image
            style={{
              width: 30,
              height: 30,
              resizeMode: 'contain',
              tintColor: design.theme_color_child,
            }}
            source={require('./images/wallet.png')}
          />
          <Text style={styles.myaccount_text}>POS</Text>
        </TouchableOpacity>

        {/* logout dialog */}
        <Dialog
          onTouchOutside={() => {
            this.setState({scaleAnimationDialog: false});
          }}
          width={0.9}
          visible={this.state.scaleAnimationDialog}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            console.log('onHardwareBackPress');
            this.setState({scaleAnimationDialog: false});
            return true;
          }}
          actions={[
            <DialogButton
              text="DISMISS"
              onPress={() => {
                this.setState({scaleAnimationDialog: false});
              }}
              key="button-1"
            />,
          ]}>
          <DialogContent>
            <View>
              <Text style={styles.title}>Confirm</Text>
              <Text style={styles.sub_title}>
                Are you sure you want to logout ?
              </Text>

              <View style={{flexDirection: 'row'}}>
                <Text style={styles.yes} onPress={this.logout}>
                  Yes
                </Text>
                <Text
                  style={styles.no}
                  title="Close"
                  onPress={() => {
                    this.setState({scaleAnimationDialog: false});
                  }}
                  key="button-1">
                  No
                </Text>
              </View>
            </View>
          </DialogContent>
        </Dialog>

        {/* create pin dialog */}
        <Dialog
          onTouchOutside={() => {
            this.setState({Create_Pin_Dialog: false});
          }}
          width={0.9}
          visible={this.state.Create_Pin_Dialog}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            console.log('onHardwareBackPress');
            this.setState({Create_Pin_Dialog: false});
            return true;
          }}
          actions={[
            <DialogButton
              text="DISMISS"
              onPress={() => {
                this.setState({Create_Pin_Dialog: false});
              }}
              key="button-1"
            />,
          ]}>
          <DialogContent>
            <View>
              <Text style={styles.create_a_pin_text}>{pin_title}</Text>

              {this.state.pin_enable == false ? (
                <View>
                  <TextInput
                    style={styles.input}
                    autoCapitalize="none"
                    placeholder={'PIN'}
                    keyboardType="numeric"
                    returnKeyLabel={'next'}
                    onChangeText={(text) => this.setState({pin_number: text})}
                  />

                  <TextInput
                    style={styles.input}
                    autoCapitalize="none"
                    keyboardType="numeric"
                    placeholder={'CONFIRM PIN'}
                    returnKeyLabel={'next'}
                    onChangeText={(text) =>
                      this.setState({confirm_pin_number: text})
                    }
                  />
                </View>
              ) : (
                <View>
                  <TextInput
                    style={styles.input}
                    autoCapitalize="none"
                    placeholder={'Enter PIN'}
                    keyboardType="numeric"
                    returnKeyLabel={'next'}
                    onChangeText={(text) => this.setState({pin_enter: text})}
                  />
                  <TouchableOpacity onPress={() => this.send_pin()}>
                    <Text style={styles.forget_pin_text}>Forget Pin ?</Text>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                onPress={() => this.add_app01_bank()}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 50,
                }}>
                <Text style={styles.pay_text}>Save</Text>
              </TouchableOpacity>
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          onTouchOutside={() => {
            this.setState({alert_dialog: false});
          }}
          width={0.9}
          visible={this.state.alert_dialog}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            console.log('onHardwareBackPress');
            this.setState({alert_dialog: false});
            return true;
          }}
          actions={[
            <DialogButton
              text="DISMISS"
              onPress={() => {
                this.setState({alert_dialog: false});
              }}
              key="button-1"
            />,
          ]}>
          <DialogContent>
            <View>
              <Text style={styles.create_a_pin_text}>Response</Text>

              <Text style={[styles.forget_pin_text, {marginTop: 20}]}>
                Your pin send on your registered email id
              </Text>
              <TouchableOpacity
                onPress={() => this.setState({alert_dialog: false})}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <Text style={styles.pay_text}>OK</Text>
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
    getUserProfile: () => dispatch(getUserProfile()),
    clearUser: () => dispatch(clearUser()),
  };
};
const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userDetails,
    loading: state.user.loading,
    token: state.user.token,
    user: state.user,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Tab_Setting);
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
  name_text: {
    color: '#000000',
    fontSize: 20,
    marginTop: 10,
  },
  logout_text: {
    color: design.theme_color_parent,
    fontSize: 16,
    position: 'absolute',
    bottom: 5,
  },
  myaccount_text: {
    color: '#000000',
    fontSize: 18,
    alignSelf: 'center',
    marginLeft: 15,
  },
  create_a_pin_text: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'HiraMaruPro-W4',
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'HiraMaruPro-W4',
    marginTop: 30,
  },
  forget_pin_text: {
    fontSize: 16,
    color: '#000000',
    paddingLeft: 40,
    fontFamily: 'HiraMaruPro-W4',
    marginVertical: 10,
  },
  sub_title: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'HiraMaruPro-W4',
    marginTop: 10,
  },
  yes: {
    flex: 1,
    fontSize: 20,
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'HiraMaruPro-W4',
    marginTop: 30,
  },
  no: {
    flex: 1,
    fontSize: 20,
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'HiraMaruPro-W4',
    marginTop: 30,
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
  delivery_text: {
    fontSize: 18,
    color: '#000000',
  },
  pay_text: {
    fontSize: 20,
    color: '#fff',
    backgroundColor: design.theme_color_parent,
    paddingHorizontal: 80,
    paddingVertical: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cat_text: {
    fontSize: 18,
    color: '#000000',
  },
  sub_cat_text: {
    fontSize: 18,
    color: '#000000',
    marginTop: 10,
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
});
