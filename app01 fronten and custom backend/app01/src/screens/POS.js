import React, {Component} from 'react';
import {
  Text,
  View,
  StatusBar,
  AsyncStorage,
  StyleSheet,
  Image,
  TextInput,
  Platform,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
} from 'react-native-popup-dialog';
import design from './StyleFile';
import QRCode from 'react-native-qrcode-svg';
import {ScrollView} from 'react-native-gesture-handler';
import {RNCamera} from 'react-native-camera';
import {connect} from 'react-redux';
import {getQRImage} from '../redux/posSlice';
import SimpleToast from 'react-native-simple-toast';
import WebView from 'react-native-webview';
import AnimatedLoader from 'react-native-animated-loader';
import {getLoginLink} from '../redux/stripeSlice';
const {width, height} = Dimensions.get('window');
const qrwidth = width * 0.8;
class POS extends Component {
  constructor(props) {
    super(props);
    (this.categoryies = []),
      (this.state = {
        shop_option_dialog: false,
        qr_image: '',
        html: '',
        loading: false,
        amount: '0.00',
      });
  }
  componentDidMount = () => {
    // this._fetchQr();
  };
  openBank = async () => {
    try {
      this.setState({loading: true, shop_option_dialog: false});
      const {url} = await getLoginLink();
      console.log(url);
      Linking.openURL(url);
    } catch (e) {
      SimpleToast.show('Error.');
    }
    this.setState({loading: false});
  };
  _fetchQr = async () => {
    try {
      this.setState({loading: true});
      const {data} = await getQRImage();
      console.log(data);
      this.setState({
        html: `<img src="${data}" style="width:100%;height:100%;"/>`,
        loading: false,
      });
    } catch (e) {
      SimpleToast.show('Error generating QR code.');
    }
  };
  onSuccess = (e) => {
    console.log('success_code : ' + e.data);
    // Linking.openURL(e.data).catch(err =>
    //     console.error('An error occured', err)
    // );
  };
  backpress = () => {
    this.props.navigation.goBack();
  };
  options = () => {
    this.setState({shop_option_dialog: true});
  };
  render() {
    return (
      <View style={styles.MainContainer}>
        <StatusBar
          translucent
          backgroundColor="white"
          barStyle="dark-content"
        />
        <AnimatedLoader
          visible={this.state.loading}
          overlayColor="rgba(255,255,255,0.15)"
          source={require('./loader.json')}
          animationStyle={styles.lottie}
          speed={1}
        />
        <View style={{flexDirection: 'row', paddingTop: 40}}>
          <TouchableOpacity onPress={this.backpress} style={{width: '15%'}}>
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

          <Text style={styles.shopname_text}>Shop Name</Text>
          <TouchableOpacity onPress={this.options} style={{width: '15%'}}>
            <Image
              style={{
                width: 30,
                height: 30,
                resizeMode: 'contain',
                marginLeft: 15,
              }}
              source={require('./images/dots.png')}
            />
          </TouchableOpacity>
        </View>

        <ScrollView>
          <View>
            <View>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <QRCode
                  value={JSON.stringify({
                    amount: this.state.amount,
                    action: 'pay',
                    user_id: this.props.user._id,
                  })}
                  //size of QR Code
                  size={330}
                  //Color of the QR Code (Optional)
                  color="black"
                  //Background Color of the QR Code (Optional)
                  backgroundColor="white"
                  //Center Logo size  (Optional)
                  logo={require('./images/logo01.png')}
                  logoSize={60}
                  //Center Logo margin (Optional)
                  logoMargin={2}
                  //Center Logo radius (Optional)
                  logoBorderRadius={20}
                  //Center Logo background (Optional)
                  logoBackgroundColor="white"
                />
                {/* <WebView
                  source={{html: this.state.html}}
                  style={{width: qrwidth, height: qrwidth}}
                /> */}
              </View>
            </View>

            <Text
              style={{
                textAlign: 'center',
                marginVertical: 10,
                fontSize: 20,
                color: '#4683a7',
              }}>
              PAY
            </Text>
            <View>
              {/* <View
                style={{
                  flexDirection: 'row',
                  marginLeft: 25,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={{color: design.theme_color_parent, fontSize: 30}}>
                  €
                </Text>
                <TextInput
                  style={styles.input_price}
                  autoCapitalize="none"
                  placeholder={''}
                  keyboardType="number-pad"
                  returnKeyLabel={'next'}
                  value={this.state.amount}
                  onChangeText={(text) => this.setState({amount: text})}
                />
              </View> */}
              {/* <TouchableOpacity
                onPress={() => this.saved_pin()}
                style={{justifyContent: 'center', alignItems: 'center'}}>
                <Text style={styles.pay_text}>Save</Text>
              </TouchableOpacity> */}
            </View>

            <View style={{flexDirection: 'row', marginLeft: 25}}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 30,
                  height: 30,
                  borderRadius: 10,
                  resizeMode: 'contain',
                  marginTop: 30,
                }}
                source={require('./images/img_2.png')}
              />
              <TextInput
                style={styles.input_price}
                autoCapitalize="none"
                placeholder={''}
                returnKeyLabel={'next'}
                onChangeText={(text) => this.setState({username: text})}
              />
              <Image
                style={{
                  alignSelf: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  marginLeft: 20,
                  resizeMode: 'contain',
                  marginTop: 30,
                }}
                source={require('./images/img_1.png')}
              />
            </View>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              placeholder={'Name on cart'}
              returnKeyLabel={'next'}
              onChangeText={(text) => this.setState({username: text})}
            />

            <TextInput
              style={styles.input}
              autoCapitalize="none"
              placeholder={'Enter cart number'}
              returnKeyLabel={'next'}
              onChangeText={(text) => this.setState({username: text})}
            />

            <View style={{flexDirection: 'row'}}>
              <TextInput
                style={styles.input_2}
                autoCapitalize="none"
                placeholder={'MM/YY'}
                returnKeyLabel={'next'}
                onChangeText={(text) => this.setState({username: text})}
              />
              <TextInput
                style={styles.input_2}
                autoCapitalize="none"
                placeholder={'CVV'}
                returnKeyLabel={'next'}
                onChangeText={(text) => this.setState({username: text})}
              />
            </View>
          </View>
        </ScrollView>
        <Dialog
          onTouchOutside={() => {
            this.setState({shop_option_dialog: false});
          }}
          width={0.9}
          visible={this.state.shop_option_dialog}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            console.log('onHardwareBackPress');
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
              {/* <Text style={styles.options}>QR</Text> */}
              <TouchableOpacity onPress={() => this.openBank()}>
                <Text style={styles.options}>Bank</Text>
              </TouchableOpacity>
            </View>
          </DialogContent>
        </Dialog>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {};
};
const mapStateToProps = (state) => {
  return {
    user: state.user.userDetails,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(POS);
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS == 'ios' ? 40 : 0,
    paddingBottom: Platform.OS == 'ios' ? 80 : 65,
  },
  shopname_text: {
    color: '#000000',
    width: '70%',
    fontSize: 20,
    textAlign: 'center',
    marginTop: Platform.OS == 'ios' ? 10 : 30,
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
  input_price: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    width: 100,
    marginHorizontal: 10,
    fontSize: 18,
    marginTop: 30,
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
    marginTop: 50,
  },
  pay_input: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    paddingBottom: Platform.OS === 'ios' ? 5 : 0,
    fontSize: 18,
    width: 100,
    paddingLeft: 15,
  },
  doller_text: {
    fontSize: 25,
    color: design.theme_color_parent,
  },
  options: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    paddingBottom: Platform.OS === 'ios' ? 5 : 0,
    marginHorizontal: 40,
    fontSize: 18,
    marginTop: 15,
  },
  lottie: {
    width: 120,
    height: 120,
  },
});
