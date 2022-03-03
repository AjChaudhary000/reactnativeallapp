import React, {Component} from 'react';
import {
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
  Platform,
  StatusBar,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {changePassword} from '../redux/userSlice';
import design from './StyleFile';
export default class Change_password extends Component {
  backpress = () => {
    this.props.navigation.goBack();
  };
  constructor() {
    super();
    this.state = {
      old_pass: '',
      new_pass: '',
      confirm_pass: '',
    };
  }
  update = async () => {
    try {
      if (this.state.new_pass !== this.state.confirm_pass) {
        Toast.show('Passwords donot match');
        return;
      }

      if (this.state.new_pass === '') {
        Toast.show('New passwords cannot be empty');
        return;
      }
      const res = await changePassword({
        new_pass: this.state.new_pass,
        old_pass: this.state.old_pass,
      });
      Toast.show(res.message);
      this.props.navigation.goBack();
    } catch (e) {
      console.log(e);
      Toast.show('Network error');
    }
  };
  render() {
    return (
      <View style={styles.MainContainer}>
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

        <TextInput
          style={styles.input}
          autoCapitalize="none"
          placeholder={'Old Password'}
          returnKeyLabel={'next'}
          secureTextEntry={true}
          onChangeText={(text) => this.setState({old_pass: text})}
        />

        <TextInput
          style={styles.input}
          autoCapitalize="none"
          placeholder={'New Password'}
          returnKeyLabel={'next'}
          secureTextEntry={true}
          onChangeText={(text) => this.setState({new_pass: text})}
        />

        <TextInput
          style={styles.input}
          autoCapitalize="none"
          placeholder={'Confirm Password'}
          returnKeyLabel={'next'}
          secureTextEntry={true}
          onChangeText={(text) => this.setState({confirm_pass: text})}
        />

        <TouchableOpacity onPress={() => this.update()}>
          <Text style={styles.login_text}>Update</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS == 'ios' ? 40 : 40,
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
  },
  myaccount_text: {
    color: design.theme_color_parent,
    fontSize: 18,
    marginLeft: 35,
    marginTop: 30,
  },
});
