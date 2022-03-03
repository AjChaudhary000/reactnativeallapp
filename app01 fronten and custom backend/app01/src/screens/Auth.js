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
import {getUserProfile, login, signup} from '../redux/userSlice';
import CountryPicker from 'react-native-country-picker-modal';
import {getAllCategories} from '../redux/categorySlice';

export default function Auth({navigation}) {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [spinner, setSpinner] = useState(false);
  const loginRB = useRef();
  const {loading, errorMessage, userDetails, token} = useSelector(
    (state) => state.user,
  );
  const registerRB = useRef();
  const register_button = async () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (firstName == '') {
      Toast.show('Enter First Name');
    } else if (lastName == '') {
      Toast.show('Enter Last Name');
    } else if (email == '') {
      Toast.show('Enter Email');
    } else if (reg.test(email) === false) {
      Toast.show('Email is not correct');
    } else if (phone == '') {
      Toast.show('Enter Phone Number');
    } else if (password == '') {
      Toast.show('Enter Password');
    } else if (country == '') {
      Toast.show('Enter Country');
    } else {
      setSpinner(true);
      dispatch(
        signup({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          phone,
          country,
        }),
      );
    }
  };
  const login_button = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!reg.test(email)) {
      Toast.show('Invalid email ');
    } else if (password == '') {
      Toast.show('Enter Password');
    } else {
      dispatch(login({email, password}));
    }
  };

  useEffect(() => {
    if (token) {
      loginRB.current.close();
      registerRB.current.close();
      dispatch(getAllCategories());
    } else {
      loginRB.current.open();
      registerRB.current.close();
    }
  }, [token]);

  const changeToRegister = () => {
    loginRB.current.close();
    setTimeout(() => registerRB.current.open(), 500);
  };
  const onOutClicked = () => {
    console.log('Onclose');
    navigation.navigate('Home');
    loginRB.current.open();
    registerRB.current.close();
  };

  const changeToLogin = () => {
    registerRB.current.close();
    setTimeout(() => login.current.open(), 500);
  };
  return (
    <>
      <RBSheet
        ref={loginRB}
        height={450}
        openDuration={250}
        // closeOnPressMask={false}
        // closeOnPressBack={false}
        onClose={() => onOutClicked()}
        customStyles={{
          container: {
            borderRadius: 25,
          },
        }}>
        <View>
          <AnimatedLoader
            visible={loading}
            overlayColor="rgba(255,255,255,0.15)"
            source={require('./loader.json')}
            animationStyle={styles.lottie}
            speed={1}
          />
          <Text style={styles.Signup_text}>Login</Text>
          <Text style={styles.email_text}>Email</Text>
          <TextInput
            style={styles.email_input}
            autoCapitalize="none"
            returnKeyLabel={'next'}
            onChangeText={(text) => setEmail(text)}
          />
          <Text style={styles.password_text}>Password</Text>
          <TextInput
            style={styles.email_input}
            autoCapitalize="none"
            returnKeyLabel={'next'}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />

          {errorMessage.length !== 0 && (
            <Text style={styles.error}> {errorMessage}</Text>
          )}
          <TouchableOpacity onPress={() => login_button()} disabled={loading}>
            <Text style={styles.login_text}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => changeToRegister()}
            style={{alignSelf: 'center', marginTop: 40}}>
            {/* <TouchableOpacity onPress={() => {}}>
              <Text style={styles.forgotpassword_text}>Forgot Password ? </Text>
            </TouchableOpacity> */}

            <Text style={styles.register_text}>
              Don't have an account yet ?{' '}
              <Text style={styles.register2_text}>Register</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
      <RBSheet
        ref={registerRB}
        height={650}
        openDuration={250}
        closeOnPressMask={false}
        closeOnPressBack={false}
        onClose={() => onOutClicked()}
        customStyles={{
          container: {
            borderRadius: 25,
            paddingBottom: 50,
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
                  onChangeText={(text) => setFirstName(text)}
                />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.email_text}>Last Name</Text>
                <TextInput
                  style={styles.email_input}
                  autoCapitalize="none"
                  returnKeyLabel={'next'}
                  onChangeText={(text) => setLastName(text)}
                />
              </View>
            </View>
            <AnimatedLoader
              visible={loading}
              overlayColor="rgba(255,255,255,0.15)"
              source={require('./loader.json')}
              animationStyle={styles.lottie}
              speed={1}
            />
            <Text style={styles.email_text}>Username</Text>
            <TextInput
              style={styles.email_input}
              autoCapitalize="none"
              returnKeyLabel={'next'}
              onChangeText={(text) => setUserName(text)}
            />

            <Text style={styles.email_text}>Email</Text>
            <TextInput
              style={styles.email_input}
              autoCapitalize="none"
              returnKeyLabel={'next'}
              onChangeText={(text) => setEmail(text)}
            />
            <Text style={styles.email_text}>Phone</Text>
            <TextInput
              style={styles.email_input}
              autoCapitalize="none"
              returnKeyLabel={'next'}
              placeholder={'+91 '}
              onChangeText={(text) => setPhone(text)}
            />

            <Text style={styles.password_text}>Password</Text>
            <TextInput
              style={styles.email_input}
              autoCapitalize="none"
              returnKeyLabel={'next'}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
            />
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 30,
              }}>
              <Text style={{color: 'grey', fontSize: 16}}>
                {country || 'Country not selected'}
              </Text>
              <CountryPicker
                onSelect={(c) => setCountry(c.name)}
                containerButtonStyle={styles.country_btn}
              />
            </View>
            <TouchableOpacity onPress={() => register_button()}>
              <Text style={styles.login_text}>Register</Text>
            </TouchableOpacity>
            <Text style={styles.or_text}>OR</Text>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                changeToLogin();
              }}
              style={{alignSelf: 'center'}}>
              <Text style={styles.register_text}>
                Already Have an account ?{' '}
                <Text style={styles.register2_text}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </RBSheet>
    </>
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
