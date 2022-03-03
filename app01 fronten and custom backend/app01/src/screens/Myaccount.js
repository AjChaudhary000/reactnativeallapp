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
  AsyncStorage,
  ScrollView,
} from 'react-native';
import design from './StyleFile';
import Toast from 'react-native-simple-toast';
import {launchImageLibrary} from 'react-native-image-picker';
import AnimatedLoader from 'react-native-animated-loader';
import FitImage from 'react-native-fit-image';
import {
  getUserProfile,
  updateUser,
  updateUserProfile,
} from '../redux/userSlice';
import {connect} from 'react-redux';
import {APP_CONFIG} from '../../config';
class Myaccount extends Component {
  constructor() {
    super();
    this.state = {
      spinner: false,
      first_name: '',
      last_name: '',
      user_name: '',
      phone: '',
      email: '',
      image: '',
      updated: false,
    };
  }
  componentDidMount = () => {
    // this.props.getUserProfile();
  };
  static getDerivedStateFromProps(props, state) {
    if (state.updated) return;
    const user = props.userProfile;
    return {
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      updated: true,
    };
  }
  backpress = () => {
    this.props.navigation.goBack();
  };
  // componentDidUpdate = (prevProps, prevState) => {
  //   if (prevProps.userProfile !== this.props.userProfile) {
  //     const user = this.props.userProfile;
  //     this.setState({
  //       first_name: user.first_name,
  //       last_name: user.last_name,
  //       phone: user.phone,
  //     });
  //   }
  // };

  change_password = () => {
    this.props.navigation.navigate('Change_password');
  };
  chooseFile = () => {
    var options = {
      mediaType: 'photo',
      selectionLimit: 1,
      quality: 0.5,
      includeBase64: true,
    };

    launchImageLibrary(options, (response) => {
      this.setState({
        image: response.assets[0],
      });
    });
  };

  submit = async () => {
    if (this.state.first_name == '') {
      Toast.show('Add First Name');
    } else if (this.state.last_name == '') {
      Toast.show('Add Last Name');
    } else if (this.state.phone == '') {
      Toast.show('Add Phone Number');
    } else {
      const data = {
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        phone: this.state.phone,
        image: this.state.image,
      };
      try {
        this.setState({spinner: true});
        await updateUserProfile(data);
        this.setState({spinner: false});
        this.props.updateUser({...data});
        Toast.show('Saved Changes Successfully');
      } catch (e) {
        console.log(e);
        Toast.show('Error occured');
        this.setState({spinner: false});
      }
    }
  };
  render() {
    const {userProfile} = this.props;
    return (
      <View style={styles.MainContainer}>
        <AnimatedLoader
          visible={this.props.loading || this.state.spinner}
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
                this.state.image
                  ? {uri: this.state.image.uri}
                  : userProfile.avatar
                  ? {
                      uri:
                        APP_CONFIG.backend_url +
                        '/image/avatar/' +
                        userProfile.avatar,
                    }
                  : require('../screens/images/avatar.png')
              }
            />
            <TouchableOpacity onPress={this.chooseFile.bind(this)}>
              <Text style={styles.uploadimage_text}>Upload Image</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              autoCapitalize="none"
              placeholder={'First Name'}
              value={this.state.first_name}
              returnKeyLabel={'next'}
              onChangeText={(text) => this.setState({first_name: text})}
            />
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              placeholder={'Last Name'}
              value={this.state.last_name}
              returnKeyLabel={'next'}
              onChangeText={(text) => this.setState({last_name: text})}
            />

            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={userProfile.email}
              placeholder={'Email'}
              editable={false}
              returnKeyLabel={'next'}
            />

            <TextInput
              style={styles.input}
              autoCapitalize="none"
              placeholder={'Phone'}
              value={this.state.phone}
              returnKeyLabel={'next'}
              onChangeText={(text) => this.setState({phone: text})}
            />
            <TouchableOpacity onPress={() => this.change_password()}>
              <Text style={styles.myaccount_text}>Change Password</Text>
              <View
                style={{
                  height: 2,
                  backgroundColor: design.theme_color_parent,
                  marginTop: 5,
                  width: 160,
                  marginLeft: 35,
                }}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.submit()}>
              <Text style={styles.login_text}>Update</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserProfile: () => dispatch(getUserProfile()),
    updateUser: (data) => dispatch(updateUser(data)),
  };
};
const mapStateToProps = (state) => {
  return {
    userProfile: state.user.userDetails,
    loading: state.user.loading,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Myaccount);

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
