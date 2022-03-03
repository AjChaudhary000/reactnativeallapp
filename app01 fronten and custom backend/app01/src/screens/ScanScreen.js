import React, {Component} from 'react';
import {
  Text,
  Image,
  View,
  Linking,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
export default class ScanScreen extends Component {
  onSuccess = (e) => {
    console.log(e);
    // console.log('success_code : ' + e.data);
    // Linking.openURL(e.data).catch((err) =>
    //   console.error('An error occured', err),
    // );
  };

  render() {
    return (
      <View style={styles.MainContainer}>
        <QRCodeScanner
          onRead={this.onSuccess}
          cameraStyle={{width: 100, height: 200}}
          flashMode={RNCamera.Constants.FlashMode.off}
          topContent={<Text> </Text>}
          bottomContent={<Text> </Text>}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS == 'ios' ? 40 : 0,
    paddingBottom: Platform.OS == 'ios' ? 80 : 65,
  },
});
