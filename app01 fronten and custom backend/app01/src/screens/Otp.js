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
import Toast from 'react-native-simple-toast';
import RBSheet from 'react-native-raw-bottom-sheet';
import AnimatedLoader from 'react-native-animated-loader';
import {useDispatch, useSelector} from 'react-redux';
import {getUserProfile, login, loginAction, signup} from '../redux/userSlice';
import CountryPicker from 'react-native-country-picker-modal';
import {getAllCategories} from '../redux/categorySlice';
import Header from './Header';
export default function Otp({navigation}) {
  
  const register_button = async () => {
                   navigation.navigate('HomeScreen');
        
  };

  
  return (
    <View style={styles.MainContainer}>
      <Header navigation={navigation} />
      <ScrollView>
        <AnimatedLoader
          
          overlayColor="rgba(255,255,255,0.15)"
          source={require('./loader.json')}
          animationStyle={styles.lottie}
          speed={1}
        />
        <View>
          <Text style={styles.Signup_text}>Verification </Text>
          
          <AnimatedLoader
          
            overlayColor="rgba(255,255,255,0.15)"
            source={require('./loader.json')}
            animationStyle={styles.lottie}
            speed={1}
          />
         

          <Text style={styles.email_text}>OTP</Text>
          <TextInput
            style={styles.email_input}
            autoCapitalize="none"
            returnKeyLabel={'next'}
            onChangeText={(text) => setEmail(text)}
          />
          
         
          <TouchableOpacity onPress={() => register_button()}>
            <Text style={styles.login_text}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
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
