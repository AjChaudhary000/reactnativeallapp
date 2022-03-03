import React, {Component} from 'react';
import {
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
  Platform,
} from 'react-native';
import design from './StyleFile';
export default class Login extends Component {
  nextscreen = () => {
    this.props.navigation.navigate('Signup');
  };
  homescreen = () => {
    this.props.navigation.navigate('HomeScreen');
  };
  render() {
    return (
      <View style={styles.MainContainer}>
        <StatusBar
          translucent
          backgroundColor="white"
          barStyle="dark-content"
        />
        <Text style={styles.title_text}>Signin</Text>
        <Image style={styles.logo} source={require('./images/app1.png')} />

        <TextInput
          style={styles.input}
          autoCapitalize="none"
          placeholder={'Email'}
          returnKeyLabel={'next'}
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          placeholder={'Password'}
          returnKeyLabel={'next'}
          secureTextEntry={true}
          onChangeText={(text) => this.setState({username: text})}
        />
        <TouchableOpacity onPress={() => this.homescreen()}>
          <Text style={styles.login_text}>Signin</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.nextscreen()}
          style={{position: 'absolute', bottom: 20, alignSelf: 'center'}}>
          <Text style={styles.register_text}>
            Don't have an account ?{' '}
            <Text style={styles.register2_text}>Signup</Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS == 'ios' ? 40 : 0,
  },
  title_text: {
    color: '#000000',
    fontSize: 22,
    marginTop: 60,
    textAlign: 'center',
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
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    alignSelf: 'center',
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
  register_text: {
    color: design.theme_color_child,
    fontSize: 18,
  },
  register2_text: {
    color: '#000000',
    fontSize: 18,
    textAlign: 'center',
  },
});
