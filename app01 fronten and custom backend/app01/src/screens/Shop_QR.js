/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  View,
  ScrollView,
  Platform,
  TextInput,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import design from './StyleFile';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
} from 'react-native-popup-dialog';
let selected_cat_name = '';
import FitImage from 'react-native-fit-image';
import DraggableFlatList from 'react-native-draggable-flatlist';
import QRCode from 'react-native-qrcode-svg';
import WebView from 'react-native-webview';
import {Button} from 'react-native-paper';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import ViewShot from 'react-native-view-shot';

var shop_id = '';
export default class Shop_QR extends Component {
  constructor(props) {
    super(props);
    (this.categoryies = []),
      (this.state = {
        shop_option_dialog: false,
      });
  }
  backpress = () => {
    this.props.navigation.goBack();
  };
  hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };
  renderHTML = async () => {
    const capture = await this.refs.viewShot.capture();
    console.log(capture);
    if (Platform.OS === 'android' && !(await this.hasAndroidPermission())) {
      Alert.alert('Failed', 'No permission to access camera roll.');
    }
    const pic = await CameraRoll.save(capture);
    console.log(pic);
    Alert.alert('Success', 'The image was saved to your camera roll.');
  };
  async callback(dataURL) {
    const base64 = await RNFS.readDirAssets('/images/app1.png');
    console.log(base64);
    const image_html = `
			<img src="${base64}"/>
	 		<img src="data:image/png;base64,${dataURL}"/> 
    `;
    this.setState({html: image_html});
    let options = {
      html: image_html,
      fileName: 'test',
      directory: 'Documents',
    };
    let file = await RNHTMLtoPDF.convert(options);
    console.log(file.filePath);
  }

  render() {
    const {navigation} = this.props;
    shop_id = navigation.getParam('shop_id', 'null');
    return (
      <View style={styles.MainContainer}>
        <StatusBar
          translucent
          backgroundColor="white"
          barStyle="dark-content"
        />
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
              marginBottom: 15,
              width: '100%',
            }}>
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
            <TouchableOpacity
              onPress={() => this.setState({shop_option_dialog: true})}
              style={{
                alignItems: 'flex-end',
                flex: 1,
                marginRight: 20,
              }}>
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
        </View>

        <ScrollView>
          <ViewShot ref="viewShot" options={{format: 'jpg', quality: 0.9}}>
            <View style={{backgroundColor: 'white'}}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 20,
                }}>
                <Image
                  style={{
                    width: 150,
                    height: 80,
                    resizeMode: 'contain',
                    marginLeft: 10,
                    marginBottom: 20,
                  }}
                  source={require('./images/app1.png')}
                />

                <QRCode
                  value={JSON.stringify({
                    action: 'open_shop_detail',
                    id: shop_id,
                  })}
                  getRef={(c) => (this.svg = c)}
                  //size of QR Code
                  size={350}
                  //Color of the QR Code (Optional)
                  color="black"
                  //Background Color of the QR Code (Optional)
                  backgroundColor="white"
                  //Logo of in the center of QR Code (Optional)
                  //logo={{ url: 'https://raw.githubusercontent.com/AboutReact/sampleresource/master/logosmalltransparen.png', }}
                  //Center Logo size  (Optional)
                  logoSize={30}
                  //Center Logo margin (Optional)
                  logoMargin={2}
                  //Center Logo radius (Optional)
                  logoBorderRadius={15}
                  //Center Logo background (Optional)
                  logoBackgroundColor="yellow"
                />
              </View>

              <Text style={styles.title}>SMART SHOPPING</Text>
              <Text style={styles.desc_text}>
                This shop is in App01. You can view the products and buy them
                from your smartphone.
              </Text>
              <Text style={styles.lines_text}>1. Download App01 App</Text>
              <Text style={styles.lines_text}>2. Scan the QR code</Text>
              <Text style={styles.lines_text}>3. Buy the product</Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginBottom: 50,
                }}>
                <Image
                  source={require('./images/app_store.png')}
                  style={{
                    width: 100,
                    height: 80,
                    resizeMode: 'contain',
                    marginRight: 5,
                  }}
                />
                <Image
                  source={require('./images/play_store.png')}
                  style={{
                    width: 100,
                    height: 80,
                    resizeMode: 'contain',
                    marginLeft: 5,
                  }}
                />
              </View>
            </View>
          </ViewShot>
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
          }}>
          <DialogContent>
            <View>
              {/* <Text style={styles.options}>QR</Text> */}
              <TouchableOpacity onPress={() => this.renderHTML()}>
                <Text style={styles.options}>Save for printing</Text>
              </TouchableOpacity>
            </View>
          </DialogContent>
        </Dialog>
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
  title: {
    fontSize: 22,
    alignSelf: 'center',
    marginTop: 10,
    color: '#4683a7',
  },
  lines_text: {
    fontSize: 20,
    color: '#000000',
    marginLeft: 60,
    marginTop: 10,
  },
  options: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    paddingBottom: Platform.OS === 'ios' ? 5 : 0,
    marginHorizontal: 40,
    fontSize: 18,
    marginTop: 15,
  },
  desc_text: {
    fontSize: 20,
    color: '#000000',
    marginHorizontal: 30,
    alignSelf: 'center',
    marginTop: 10,
  },
});
