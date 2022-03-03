import React, {Component} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  AsyncStorage,
  Platform,
  ScrollView,
} from 'react-native';
import {createAppContainer} from 'react-navigation';
import Default_Tab from './Tab_Nearby';
import Tab_1 from './SearchResult';
import Tab_2 from './Tab_Messages';
import Tab_3 from './Tab_Scan';
import Tab_4 from './Tab_Cart';
import Tab_5 from './Tab_Setting';
import SearchResult from './SearchResult';
import ResturentDetail from './ResturentDetail';
import design from './StyleFile';
import global from './Global';
import Toast from 'react-native-simple-toast';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Dropdown} from 'react-native-material-dropdown-v2';
let rootRef;
import firebase from 'firebase';
let arr_category = [];
import moment from 'moment';
let current_date_time = '';
import AnimatedLoader from 'react-native-animated-loader';
import {db} from './config';
var user_id = '';
import DeviceInfo from 'react-native-device-info';
var uniqueId = '';
import react_native_firebase from 'react-native-firebase';
var token = '';
var total_qty = 0;
import {createBottomTabNavigator} from 'react-navigation-tabs';

export default class MainScreen extends Component {
  constructor(props) {
    super(props);
    rootRef = firebase.database().ref();
    this.state = {
      click: '1',
      country_list: [],
      first_name: '',
      last_name: '',
      user_name: '',
      register_email: '',
      register_password: '',
      address: '',
      country: '',
      phone_number: '',
      login_email: '',
      login_password: '',
      spinner: true,
      item_count: '',
      forgot_password_email: '',
      forgot_password_email: '',
      shop_order_notifications_count: 0,
      message_count: 0,
    };
  }
  click_tab1 = () => {
    this.setState({click: '1'});
    global.click = '1';
  };
  click_tab2 = () => {
    if (global.login == 'true') {
      this.setState({click: '2'});
      global.click = '2';
    } else {
      this.LOGIN.open();
    }
  };
  click_tab3 = () => {
    if (global.login == 'true') {
      this.setState({click: '3'});
      global.click = '3';
    } else {
      this.LOGIN.open();
    }
  };
  click_tab4 = () => {
    this.setState({click: '4'});
    global.click = '4';
    // if (global.login == 'true') {
    // 	this.setState({ click: '4' });
    // 	global.click = '4';
    // } else {
    // 	this.LOGIN.open();
    // }
  };
  click_tab5 = () => {
    if (global.login == 'true') {
      this.setState({click: '5'});
      global.click = '5';
    } else {
      this.LOGIN.open();
    }
  };

  componentDidMount() {
    react_native_firebase
      .messaging()
      .getToken()
      .then((fcmToken) => {
        if (fcmToken) {
          token = fcmToken;
          console.log('get_token_ ' + token);
        } else {
          console.log('else');
        }
      })
      .catch((error) => {
        console.log('qwerty');
        console.log(error);
      });

    current_date_time = moment()
      .utcOffset('+05:30')
      .format('YYYY-MM-DD hh:mm:ss a');
    this.getFirebasedata();
    this.displayData();
  }
  displayData = async () => {
    try {
      uniqueId = DeviceInfo.getUniqueId();
      user_id = await AsyncStorage.getItem('user_id');
      if (user_id == null) {
        user_id = uniqueId;
        this.setState({shop_order_notifications_count: 0});
      } else {
        this.setState({spinner: true});
        rootRef.child('/shops').on('value', (snapshot) => {
          this.setState({shop_order_notifications_count: 0});
          var count = 0;
          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              var key = childSnapshot.key;
              var childData = childSnapshot.val();
              if (childData.user_id == user_id) {
                count = count + parseInt(childData.notification_count);
              }
            });
            this.setState({shop_order_notifications_count: count});
          } else {
            this.setState({spinner: false});
            this.setState({shop_order_notifications_count: 0});
          }
        });

        this.setState({spinner: true});
        rootRef.child('/recentchat/' + user_id).on('value', (snapshot) => {
          this.setState({message_count: 0});
          var count = 0;
          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              var key = childSnapshot.key;
              var childData = childSnapshot.val();
              if (childData.count != 0) {
                count = count + childData.count;
                this.setState({message_count: count});
              }
              // else
              // {
              // 	count = count + 0;
              // 	this.setState({ message_count: 0 });
              // }
            });
            console.log('get_message_count');
            console.log(this.state.message_count);
            this.setState({message_count: count});
          } else {
            this.setState({spinner: false});
            this.setState({message_count: 0});
          }
        });
      }

      this.setState({spinner: true});
      rootRef.child('/cart/' + user_id).on('value', (snapshot) => {
        total_qty = 0;
        if (snapshot.exists()) {
          this.setState({spinner: false});
          this.setState({item_count: snapshot.numChildren()});
          snapshot.forEach((childSnapshot) => {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            total_qty = total_qty + childData.qty;
          });
        } else {
          this.setState({spinner: false});
          this.setState({item_count: ''});
          total_qty = '';
        }
      });
    } catch (error) {
      alert(error);
    }
  };

  register_dialog_called = () => {
    this.LOGIN.close();
    setTimeout(() => {
      this.REGISTER.open();
    }, 200);
  };
  Login_dialog_called = () => {
    this.REGISTER.close();
    setTimeout(() => {
      this.LOGIN.open();
    }, 200);
  };
  getFirebasedata = () => {
    this.setState({spinner: true});
    rootRef.child('/country').on('value', (snapshot) => {
      if (snapshot.exists()) {
        this.setState({spinner: false});
        snapshot.forEach((childSnapshot) => {
          var key = childSnapshot.key;
          var childData = childSnapshot.val();

          var object = {
            value: key,
            label: childData.name,
          };
          arr_category.push(object);
        });
        this.update_categories(arr_category);
      } else {
        this.setState({spinner: false});
      }
    });
  };
  update_categories = (object) => {
    var self = this;
    setTimeout(() => {
      self.setState({country_list: object});
    }, 1000);
  };
  choose_country = (value) => {
    this.setState({country: value});
  };
  register_button = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (this.state.first_name == '') {
      Toast.show('Enter First Name');
    } else if (this.state.last_name == '') {
      Toast.show('Enter Last Name');
    } else if (this.state.user_name == '') {
      Toast.show('Enter Username');
    } else if (this.state.register_email == '') {
      // else if (this.state.address == '') {
      // 	Toast.show('Enter Address');
      // }
      Toast.show('Enter Email');
    } else if (reg.test(this.state.register_email) === false) {
      Toast.show('Email is not correct');
    } else if (this.state.phone_number == '') {
      Toast.show('Enter Phone Number');
    } else if (this.state.register_password == '') {
      Toast.show('Enter Password');
    } else if (this.state.country == '') {
      Toast.show('Enter Country');
    } else {
      this.setState({spinner: true});
      const {register_email, register_password} = this.state;
      firebase
        .auth()
        .createUserWithEmailAndPassword(register_email, register_password)
        .then((res) => {
          rootRef
            .child('users/' + res.user.uid)
            .set({
              uid: res.user.uid,
              POS: '1',
              //address: this.state.address,
              country: this.state.country,
              created: current_date_time,
              email: this.state.register_email,
              first_name: this.state.first_name,
              last_name: this.state.last_name,
              image:
                'https://firebasestorage.googleapis.com/v0/b/app01-9a39b.appspot.com/o/user-dummy.png?alt=media&token=478518e2-fb49-465d-9619-616800a47e41',
              mobile: this.state.phone_number,
              password: this.state.register_password,
              status: '1',
              user_name: this.state.user_name,
            })
            .then((data) => {
              this.setState({spinner: false});
              this.REGISTER.close();
              setTimeout(() => {
                this.LOGIN.open();
              }, 200);
            })
            .catch((error) => {
              console.log('error');
              this.setState({spinner: false});
            });
        })
        .catch((error) => {
          console.log(error);
          this.setState({spinner: false});
          Toast.show('The email address is already in use by another account.');
        });
    }
  };
  login_button = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (this.state.login_email == '') {
      Toast.show('Enter Email or Username');
    } else if (this.state.login_password == '') {
      Toast.show('Enter Password');
    } else {
      this.setState({spinner: true});
      const {login_email, login_password} = this.state;
      firebase
        .auth()
        .signInWithEmailAndPassword(login_email, login_password)
        .then((res) => {
          this.setState({spinner: false});
          global.user_id = res.user.uid;
          global.login = 'true';
          AsyncStorage.setItem('user_id', res.user.uid);
          AsyncStorage.setItem('login', 'true');
          this.LOGIN.close();

          //saved token
          // this.setState({ spinner: true });
          // let postRef = firebase.database().ref('/notification_tokens/');
          // postRef
          // 	.push({
          // 		device_token: token,
          // 		device_type: Platform.OS,
          // 		user_id: res.user.uid,
          // 	})
          // 	.then(res => {
          // 		this.setState({ spinner: false });
          // 		AsyncStorage.setItem('token', token);
          // 		console.log('TESTING_work');
          // 		console.log(res);
          // 	})
          // 	.catch(error => {
          // 		console.log('TESTING_error');
          // 	});
          ///////////

          this.setState({spinner: true});
          rootRef.child('/shops').on('value', (snapshot) => {
            this.setState({shop_order_notifications_count: 0});
            var count = 0;
            if (snapshot.exists()) {
              snapshot.forEach((childSnapshot) => {
                var key = childSnapshot.key;
                var childData = childSnapshot.val();
                if (childData.user_id == user_id) {
                  count = count + parseInt(childData.notification_count);
                }
              });
              this.setState({shop_order_notifications_count: count});
            } else {
              this.setState({spinner: false});
              this.setState({shop_order_notifications_count: 0});
            }
          });
        })
        .catch((error) => {
          this.setState({spinner: false});
          console.log(error);
        });
    }
  };
  forgot_password = () => {
    this.LOGIN.close();
    setTimeout(() => {
      this.FORGOT.open();
    }, 200);
  };
  forgot_password_button = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (this.state.forgot_password_email == '') {
      Toast.show('Enter Email');
    } else if (reg.test(this.state.forgot_password_email) === false) {
      Toast.show('Email is not correct');
    } else {
      this.setState({spinner: true});
      firebase
        .auth()
        .sendPasswordResetEmail(this.state.forgot_password_email)
        .then((user) => {
          this.FORGOT.close();
          this.setState({spinner: false});
          Toast.show(
            'Password reset link has been sent to your email address. Please reset your password by clicking on the link',
            Toast.LONG,
          );
        })
        .catch((error) => {
          this.setState({spinner: false});
        });
      Toast.show(
        'Password reset link has been sent to your email address. Please reset your password by clicking on the link',
        Toast.LONG,
      );
    }
  };
  render() {
    return (
      <View
        style={{flex: 1, flexDirection: 'column', backgroundColor: '#f8f4f4'}}>
        <AnimatedLoader
          visible={this.state.spinner}
          overlayColor="rgba(255,255,255,0.15)"
          source={require('./loader.json')}
          animationStyle={styles.lottie}
          speed={1}
        />
        {/* 
                {
                    this.state.click == '1' ? <Tab_1 navigation={this.props.navigation} /> : this.state.click == '2' ? <Tab_2 navigation={this.props.navigation} /> : this.state.click == '3' ? <Tab_3 navigation={this.props.navigation} /> : this.state.click == '4' ? <Tab_4 navigation={this.props.navigation} /> :this.state.click == '5' ? <Tab_5 navigation={this.props.navigation} />:this.state.click == '6' ? <SearchResult navigation={this.props.navigation} />:<Tab_1 navigation={this.props.navigation} />
                }  */}

        {global.click == '0' ? (
          <Default_Tab navigation={this.props.navigation} />
        ) : global.click == '1' ? (
          <Tab_1 navigation={this.props.navigation} />
        ) : global.click == '2' ? (
          <Tab_2 navigation={this.props.navigation} />
        ) : global.click == '3' ? (
          <Tab_3 navigation={this.props.navigation} />
        ) : global.click == '4' ? (
          <Tab_4 navigation={this.props.navigation} />
        ) : global.click == '5' ? (
          <Tab_5 navigation={this.props.navigation} />
        ) : global.click == '6' ? (
          <SearchResult navigation={this.props.navigation} />
        ) : global.click == '7' ? (
          <ResturentDetail navigation={this.props.navigation} />
        ) : (
          <Tab_1 navigation={this.props.navigation} />
        )}

        {global.click != '4' ? (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              height: Platform.OS === 'ios' ? 80 : 65,
              flexDirection: 'row',
              paddingBottom: Platform.OS === 'ios' ? 15 : 0,
            }}>
            <TouchableOpacity
              onPress={this.click_tab1}
              style={styles.bottom_tab}>
              <Image
                style={
                  global.click == '1'
                    ? styles.icon_image_focus
                    : global.click == '6'
                    ? styles.icon_image_focus
                    : styles.icon_image
                }
                // source={require('./images/tab_location.png')} />
                source={require('./images/tab_location.png')}
              />
              <Text
                style={
                  global.click == '1'
                    ? styles.bottom_tab_text_focus
                    : styles.bottom_tab_text
                }>
                Near by
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.click_tab2}
              style={styles.bottom_tab}>
              <Image
                style={
                  global.click == '2'
                    ? styles.icon_image_focus
                    : styles.icon_image
                }
                // source={require('./images/chat.png')} />
                source={require('./images/chat.png')}
              />
              <Text
                style={
                  global.click == '2'
                    ? styles.bottom_tab_text_focus
                    : styles.bottom_tab_text
                }>
                Messages
              </Text>
              {this.state.message_count != 0 ? (
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
                  }}>
                  <Text style={{color: design.white, fontSize: 15}}>
                    {this.state.message_count}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.click_tab3}
              style={styles.bottom_tab}>
              <Image
                style={
                  global.click == '3'
                    ? styles.icon_image_focus
                    : styles.icon_image
                }
                // source={require('./images/scan.png')} />
                source={require('./images/scan.png')}
              />
              <Text
                style={
                  global.click == '3'
                    ? styles.bottom_tab_text_focus
                    : styles.bottom_tab_text
                }>
                Scan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.click_tab4}
              style={styles.bottom_tab}>
              <Image
                style={
                  global.click == '4'
                    ? styles.icon_image_focus
                    : styles.icon_image
                }
                // source={require('./images/cart.png')} />
                source={require('./images/cart.png')}
              />
              <Text
                style={
                  global.click == '4'
                    ? styles.bottom_tab_text_focus
                    : styles.bottom_tab_text
                }>
                Cart
              </Text>
              {total_qty != '' ? (
                <Text style={styles.qty_text}>{total_qty}</Text>
              ) : null}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.click_tab5}
              style={styles.bottom_tab}>
              <Image
                style={
                  global.click == '5'
                    ? styles.icon_image_focus
                    : styles.icon_image
                }
                // source={require('./images/profile.png')} />
                source={require('./images/profile.png')}
              />
              <Text
                style={
                  global.click == '5'
                    ? styles.bottom_tab_text_focus
                    : styles.bottom_tab_text
                }>
                Setting
              </Text>
              {this.state.notification_count != 0 ? (
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
                  }}>
                  <Text style={{color: design.white, fontSize: 15}}>
                    {this.state.shop_order_notifications_count}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          </View>
        ) : null}

        <RBSheet
          ref={(ref) => {
            this.LOGIN = ref;
          }}
          height={450}
          openDuration={250}
          customStyles={{
            container: {
              borderRadius: 25,
            },
          }}>
          <View>
            <Text style={styles.Signup_text}>Login</Text>
            <Text style={styles.email_text}>Email</Text>
            <TextInput
              style={styles.email_input}
              autoCapitalize="none"
              returnKeyLabel={'next'}
              onChangeText={(text) => this.setState({login_email: text})}
            />
            <Text style={styles.password_text}>Password</Text>
            <TextInput
              style={styles.email_input}
              autoCapitalize="none"
              returnKeyLabel={'next'}
              secureTextEntry={true}
              onChangeText={(text) => this.setState({login_password: text})}
            />
            <TouchableOpacity onPress={() => this.login_button()}>
              <Text style={styles.login_text}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => this.register_dialog_called()}
              style={{alignSelf: 'center', marginTop: 40}}>
              <TouchableOpacity onPress={() => this.forgot_password()}>
                <Text style={styles.forgotpassword_text}>
                  Forgot Password ?{' '}
                </Text>
              </TouchableOpacity>

              <Text style={styles.register_text}>
                Don't have an account yet ?{' '}
                <Text style={styles.register2_text}>Register</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </RBSheet>

        <RBSheet
          ref={(ref) => {
            this.REGISTER = ref;
          }}
          height={650}
          openDuration={250}
          customStyles={{
            container: {
              borderRadius: 25,
            },
          }}>
          <ScrollView>
            <View>
              <Text style={styles.Signup_text}>Register</Text>
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Text style={styles.email_text}>First Name</Text>
                  <TextInput
                    style={styles.email_input}
                    autoCapitalize="none"
                    returnKeyLabel={'next'}
                    onChangeText={(text) => this.setState({first_name: text})}
                  />
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.email_text}>Last Name</Text>
                  <TextInput
                    style={styles.email_input}
                    autoCapitalize="none"
                    returnKeyLabel={'next'}
                    onChangeText={(text) => this.setState({last_name: text})}
                  />
                </View>
              </View>

              <Text style={styles.email_text}>Username</Text>
              <TextInput
                style={styles.email_input}
                autoCapitalize="none"
                returnKeyLabel={'next'}
                onChangeText={(text) => this.setState({user_name: text})}
              />

              {/* <Text style={styles.email_text}>Address</Text>
						<TextInput
							style={styles.email_input}
							autoCapitalize="none"
							returnKeyLabel={'next'}
							onChangeText={text => this.setState({ address: text })}
						/> */}

              <Text style={styles.email_text}>Email</Text>
              <TextInput
                style={styles.email_input}
                autoCapitalize="none"
                returnKeyLabel={'next'}
                onChangeText={(text) => this.setState({register_email: text})}
              />
              <Text style={styles.email_text}>Phone</Text>
              <TextInput
                style={styles.email_input}
                autoCapitalize="none"
                returnKeyLabel={'next'}
                placeholder={'+91 '}
                onChangeText={(text) => this.setState({phone_number: text})}
              />

              <Text style={styles.password_text}>Password</Text>
              <TextInput
                style={styles.email_input}
                autoCapitalize="none"
                returnKeyLabel={'next'}
                secureTextEntry={true}
                onChangeText={(text) =>
                  this.setState({register_password: text})
                }
              />
              <View style={{marginHorizontal: 30, marginTop: 5}}>
                <Dropdown
                  placeholder="Country"
                  placeholderTextColor="#000000"
                  data={this.state.country_list}
                  onChangeText={(value) => this.choose_country(value)}
                />
              </View>
              <TouchableOpacity onPress={() => this.register_button()}>
                <Text style={styles.login_text}>Register</Text>
              </TouchableOpacity>
              <Text style={styles.or_text}>OR</Text>

              <TouchableOpacity
                activeOpacity={1}
                onPress={() => this.Login_dialog_called()}
                style={{alignSelf: 'center'}}>
                <Text style={styles.register_text}>
                  Already Have an account ?{' '}
                  <Text style={styles.register2_text}>Login</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </RBSheet>

        <RBSheet
          ref={(ref) => {
            this.FORGOT = ref;
          }}
          height={450}
          openDuration={250}
          customStyles={{
            container: {
              borderRadius: 25,
            },
          }}>
          <View>
            <Text style={styles.Signup_text}>Forgot Password</Text>
            <Text style={styles.forgot_pass_text}>Email</Text>
            <TextInput
              style={styles.email_input}
              autoCapitalize="none"
              returnKeyLabel={'next'}
              onChangeText={(text) =>
                this.setState({forgot_password_email: text})
              }
            />

            <TouchableOpacity onPress={() => this.forgot_password_button()}>
              <Text style={styles.login_text}>Submit</Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  center_view_tabs: {
    flexDirection: 'column',
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 25,
    zIndex: 10,
  },
  lottie: {
    width: 180,
    height: 180,
  },
  bottom_tab: {
    width: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  bottom_tab_focus: {
    width: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#e2001b',
  },
  bottom_tab_text: {
    fontSize: 13,
    color: design.theme_color_child,
    marginTop: 5,
  },
  bottom_tab_text_focus: {
    fontSize: 13,
    color: design.theme_color_parent,
    marginTop: 5,
  },
  icon_image: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: design.theme_color_child,
    alignSelf: 'center',
  },
  icon_image_focus: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    tintColor: design.theme_color_parent,
  },
  email_text: {
    fontSize: Platform.OS == 'ios' ? 16 : 13,
    color: design.theme_color_child,
    marginHorizontal: 30,
    marginTop: 20,
  },
  forgot_pass_text: {
    fontSize: 16,
    color: design.theme_color_child,
    marginHorizontal: 30,
    marginTop: 50,
  },
  password_text: {
    fontSize: 16,
    color: design.theme_color_child,
    marginHorizontal: 30,
    marginTop: 20,
  },
  email_input: {
    fontSize: 16,
    marginHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingTop: Platform.OS == 'ios' ? 10 : -10,
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
    marginBottom: 30,
  },
  forgotpassword_text: {
    color: design.theme_color_child,
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
  },
  or_text: {
    fontSize: 20,
    color: design.black,
    textAlign: 'center',
    marginVertical: 20,
  },
  Signup_text: {
    color: design.theme_color_parent,
    textAlign: 'center',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  dropdown_box: {
    fontFamily: Platform.OS == 'ios' ? design.ios_bold : design.android_bold,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    marginTop: 30,
    borderRadius: 30,
    marginHorizontal: 35,
  },
  qty_text: {
    width: 25,
    height: 25,
    borderRadius: 12,
    backgroundColor: design.theme_color_parent,
    color: design.white,
    fontSize: 15,
    overflow: 'hidden',
    position: 'absolute',
    textAlign: 'center',
    top: 5,
    right: 10,
    paddingTop: 2,
  },
});
