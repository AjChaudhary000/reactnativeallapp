import React, {useEffect, useRef, useState} from 'react';
import {
  AsyncStorage,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import design from './StyleFile';
//import Toast from 'react-native-simple-toast';
//import RBSheet from 'react-native-raw-bottom-sheet';
//import AnimatedLoader from 'react-native-animated-loader';
import {useDispatch, useSelector} from 'react-redux';
//import {getUserProfile, login, signup} from '../redux/userSlice';
//import CountryPicker from 'react-native-country-picker-modal';
//import {getAllCategories} from '../redux/categorySlice';
import Auth from './Auth';

export default function CustomTabBar({navigation}) {
  const dispatch = useDispatch();
  const [click, setClick] = useState(1);
  const loginRB = useRef();
  const {products} = useSelector((state) => state.cart);
  const token = useSelector((state) => state.user.token);

  const navigationHandler = (routeNames, position) => {
    if (routeNames == 'Home') {
      setClick(position);
      navigation.navigate('SearchResult');
    } else if (routeNames === 'Scan') {
      setClick(position);
      navigation.navigate(routeNames);
    } else if (
      routeNames === 'Message' ||
      routeNames === 'Cart' ||
      routeNames === 'Profile'
    ) {
      if (token) {
        setClick(position);
        navigation.navigate(routeNames);
      } else {
        navigation.navigate('SignIn');
      }
    }   
  };

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigationHandler('Home', '1')}
          style={{
            width: '20%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={click == '1' ? styles.tabImage_click : styles.tabImage}
            source={require('./images/tab_location.png')}
          />
          <Text
            style={
              click == '1'
                ? styles.bottom_tab_text_focus
                : styles.bottom_tab_text
            }>
            Near by
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigationHandler('Message', '2')}
          style={{
            width: '20%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={click == '2' ? styles.tabImage_click : styles.tabImage}
            source={require('./images/chat.png')}
          />
          <Text
            style={
              click == '2'
                ? styles.bottom_tab_text_focus
                : styles.bottom_tab_text
            }>
            Messages
          </Text>
          {/* {this.state.message_count != 0 ? (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 41,
                    height: 25,
                    width: 25,
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
              ) : null} */}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigationHandler('Scan', '3')}
          style={{
            width: '20%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={click == '3' ? styles.tabImage_click : styles.tabImage}
            source={require('./images/scan.png')}
          />
          <Text
            style={
              click == '3'
                ? styles.bottom_tab_text_focus
                : styles.bottom_tab_text
            }>
            Scan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigationHandler('Cart', '4')}
          style={{
            width: '20%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={click == '4' ? styles.tabImage_click : styles.tabImage}
            source={require('./images/cart.png')}
          />
          <Text
            style={
              click == '4'
                ? styles.bottom_tab_text_focus
                : styles.bottom_tab_text
            }>
            Cart
          </Text>
          {products.length !== 0 ? (
            <Text style={styles.qty_text}>{products.length}</Text>
          ) : null}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigationHandler('Profile', '5')}
          style={{
            width: '20%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={click == '5' ? styles.tabImage_click : styles.tabImage}
            source={require('./images/profile.png')}
          />
          <Text
            style={
              click == '5'
                ? styles.bottom_tab_text_focus
                : styles.bottom_tab_text
            }>
            Setting
          </Text>
          {/* {this.state.shop_order_notifications_count == 0 ? null : this
                  .state.shop_order_notifications_count == '0' ? null : (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 41,
                    height: 25,
                    width: 25,
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
              )} */}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignContent: 'center',
    height: Platform.OS == 'ios' ? 70 : 60,
    paddingTop: Platform.OS == 'ios' ? 0 : 0,
    width: '100%',
    paddingHorizontal: 0,
    backgroundColor: '#fff',
    // justifyContent:'center',
    // alignItems:'center'
  },

  tabImage: {
    alignSelf: 'center',
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: '#777777',
  },
  tabImage_click: {
    alignSelf: 'center',
    width: 30,
    height: 30,
    resizeMode: 'contain',
    tintColor: '#af0808',
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
    marginTop: 20,
    textAlign: 'center',
    overflow: 'hidden',
    padding: 10,
  },
  country_btn: {
    backgroundColor: 'lightgrey',
    alignSelf: 'center',
    borderRadius: 5,
    fontSize: 15,
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

  error: {
    color: design.theme_color_child,
    fontSize: 10,
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
    height: 25,
    width: 25,
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
  lottie: {
    width: 120,
    height: 120,
  },
});
