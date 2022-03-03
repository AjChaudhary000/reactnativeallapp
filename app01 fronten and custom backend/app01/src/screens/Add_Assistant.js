import React, {Component, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  Dimensions,
  ToastAndroid,
  Alert,
  Text,
} from 'react-native';
import design from './StyleFile';
import Header from './Header';
import AnimatedLoader from 'react-native-animated-loader';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import FitImage from 'react-native-fit-image';
import {launchImageLibrary} from 'react-native-image-picker';
import {addAssistant, getAllAssistant} from '../redux/assistantSlice';
import SimpleToast from 'react-native-simple-toast';
import {useDispatch} from 'react-redux';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
  },
  lottie: {
    width: 200,
    height: 200,
  },
  uploadimage_text: {
    color: '#000000',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dcdcdc',
    fontSize: 18,
    padding: Platform.OS == 'ios' ? 15 : 8,
    marginHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  login_text: {
    color: '#fff',
    backgroundColor: design.theme_color_parent,
    marginHorizontal: 30,
    borderRadius: 10,
    fontSize: 22,
    marginTop: 40,
    textAlign: 'center',
    overflow: 'hidden',
    padding: 10,
    marginVertical: 20,
  },
  myaccount_text: {
    color: design.theme_color_parent,
    fontSize: 18,
    marginLeft: 35,
    marginTop: 30,
  },
});

const {width, height} = Dimensions.get('window');
export default function Add_Assistant({navigation}) {
  const [image, setImage] = useState();
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const shop_id = navigation.getParam('shop_id');
  const dispatch = useDispatch();
  const chooseFile = () => {
    var options = {
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.5,
      includeBase64: true,
    };

    launchImageLibrary(options, (response) => {
      setImage(response.assets[0]);
    });
  };
  const submit = async () => {
    if (
      first_name === '' ||
      last_name === '' ||
      email === '' ||
      password === ''
    ) {
      SimpleToast.show('One or more field is empty.');
      return;
    }
    setLoading(true);

    try {
      await addAssistant({
        image,
        first_name,
        last_name,
        email,
        password,
        shop_id,
      });
      dispatch(getAllAssistant());
      navigation.goBack();
    } catch (e) {
      SimpleToast.show('Error!');
    }
    setLoading(false);
  };
  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <AnimatedLoader
        visible={loading}
        overlayColor="rgba(255,255,255,0.15)"
        source={require('./loader.json')}
        animationStyle={styles.lottie}
        speed={1}
      />
      <ScrollView>
        <View>
          <FitImage
            style={{
              alignSelf: 'center',
              width: 120,
              height: 120,
              borderRadius: 60,
              resizeMode: 'contain',
              marginTop: 20,
              borderWidth: 1,
              borderColor: '#dcdcdc',
              overflow: 'hidden',
            }}
            source={
              image ? {uri: image.uri} : require('../screens/images/avatar.png')
            }
          />
          <TouchableOpacity onPress={() => chooseFile()}>
            <Text style={styles.uploadimage_text}>Upload Image</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            autoCapitalize="none"
            placeholder={'First Name'}
            returnKeyLabel={'next'}
            onChangeText={(text) => setFirstName(text)}
          />
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            placeholder={'Last Name'}
            returnKeyLabel={'next'}
            onChangeText={(text) => setLastName(text)}
          />

          <TextInput
            style={styles.input}
            autoCapitalize="none"
            placeholder={'Email'}
            returnKeyLabel={'next'}
            onChangeText={(text) => setEmail(text)}
          />

          <TextInput
            style={styles.input}
            autoCapitalize="none"
            secureTextEntry
            placeholder={'Password'}
            returnKeyLabel={'next'}
            onChangeText={(text) => setPassword(text)}
          />

          <TouchableOpacity onPress={() => submit()}>
            <Text style={styles.login_text}>Add</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
