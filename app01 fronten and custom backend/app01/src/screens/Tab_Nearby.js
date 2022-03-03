import React, {Component} from 'react';
import {
  Text,
  View,
  AsyncStorage,
  Image,
  StyleSheet,
  TextInput,
  Platform,
  TouchableOpacity,
  StatusBar,
  Slider,
  PermissionsAndroid,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import design from './StyleFile';
import global from './Global';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
let user_id = '';
import Toast from 'react-native-simple-toast';
let rootRef;
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
let arr_shop = [];
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
let location_saved = '';
import DeviceInfo from 'react-native-device-info';
var uniqueId = '';
import react_native_firebase from 'react-native-firebase';
import {connect} from 'react-redux';
import {getNearbyShops} from '../redux/shopSlice';
var token = '';
export async function request_device_location_runtime_permission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'ReactNativeCode Location Permission',
        message: 'ReactNativeCode App needs access to your location ',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // Alert.alert("Location Permission Granted.");
    } else {
      // Alert.alert("Location Permission Not Granted");
    }
  } catch (err) {}
}
class Tab_Nearby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SliderValue: 15,
      current_address: 'Sector 7,Chandigarh',
      shop_list: [],
      address: '',
      current_lat: 0.0,
      current_long: 0.0,
    };
  }
  goToFavorite() {
    this.props.navigation.navigate('Favorite');
  }
  async componentDidMount() {
    this.displayData();
    // this.setState({ spinner: true });
    this.props.getNearbyShops();
  }
  displayData = async () => {
    try {
      uniqueId = DeviceInfo.getUniqueId();
      user_id = await AsyncStorage.getItem('user_id');
      global.user_id = user_id;
      if (user_id == null) {
        user_id = uniqueId;
      }

      if (global.address == undefined) {
        this.setState({address: global.address});
        if (Platform.OS === 'android') {
          await request_device_location_runtime_permission();
        }
        Geolocation.getCurrentPosition(
          (position) => {
            this.setState({
              current_lat: position.coords.latitude,
              current_long: position.coords.longitude,
            });
            fetch(
              'https://maps.googleapis.com/maps/api/geocode/json?address=' +
                position.coords.latitude +
                ',' +
                position.coords.longitude +
                '&key=' +
                'AIzaSyAkHq68S7fuekxh15phIQkPYWnQgp7gF74',
            )
              .then((response) => response.json())
              .then((responseJson) => {
                console.log('get_lat_long : ');
                console.log(responseJson);
                global.address = responseJson.results[0].formatted_address;
                global.latitude = position.coords.latitude;
                global.longitude = position.coords.longitude;
                this.setState({
                  address: responseJson.results[0].formatted_address,
                });
              });
          },
          (error) => {
            console.log(error);
          },
        );
      } else {
        console.log(global.latitude);
        console.log(global.longitude);
        this.setState({address: global.address});
        this.setState({current_lat: global.latitude});
        this.setState({current_long: global.longitude});
      }
    } catch (error) {
      alert(error);
    }
  };
  update_shop = (object) => {
    var self = this;
    setTimeout(() => {
      this.setState({spinner: false});
      self.setState({shop_list: object});
    }, 1000);
  };
  search_button = () => {
    // global.click = '6';
    // this.props.navigation.replace('MainScreen');
    this.props.navigation.navigate('SearchResult');
  };
  heart_click = () => {
    if (global.login == 'true') {
      this.props.navigation.navigate('Favorite');
    } else {
      Toast.show('Login Your Account');
    }
  };

  marker_click = () => {};
  full_address = (data, detail) => {
    this.setState({address: data.description});
    this.setState({current_lat: detail.geometry.location.lat});
    this.setState({current_long: detail.geometry.location.lng});
    this.setState({latitude: detail.geometry.location.lat});
    this.setState({longitude: detail.geometry.location.lng});
  };

  handleAddressOnKeyUp = (text) => {
    this.setState({address: text});
  };
  get_current_location = async () => {
    if (Platform.OS === 'android') {
      await request_device_location_runtime_permission();
    }
    Geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          current_lat: position.coords.latitude,
          current_long: position.coords.longitude,
        });
        fetch(
          'https://maps.googleapis.com/maps/api/geocode/json?address=' +
            position.coords.latitude +
            ',' +
            position.coords.longitude +
            '&key=' +
            'AIzaSyAkHq68S7fuekxh15phIQkPYWnQgp7gF74',
        )
          .then((response) => response.json())
          .then((responseJson) => {
            global.address = responseJson.results[0].formatted_address;
            global.latitude = position.coords.latitude;
            global.longitude = position.coords.longitude;
            this.setState({address: responseJson.results[0].formatted_address});
          });
      },
      (error) => {
        console.log(error);
      },
    );
  };
  change_location = (e) => {
    console.log('dragEnd', e.nativeEvent.coordinate);
    console.log(e.nativeEvent.coordinate.latitude);
    console.log(e.nativeEvent.coordinate.longitude);
    fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        e.nativeEvent.coordinate.latitude +
        ',' +
        e.nativeEvent.coordinate.longitude +
        '&key=' +
        'AIzaSyAkHq68S7fuekxh15phIQkPYWnQgp7gF74',
    )
      .then((response) => response.json())
      .then((responseJson) => {
        global.address = responseJson.results[0].formatted_address;
        this.setState({address: responseJson.results[0].formatted_address});
      });
  };
  render() {
    return (
      <View style={styles.MainContainer}>
        <AnimatedLoader
          visible={this.state.spinner}
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
        <MapView
          // provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          style={{height: '50%'}}
          zoomEnabled={true}
          scrollEnabled={true}
          showsBuildings={true}
          showsMyLocationButton={true}
          region={{
            latitude: this.state.current_lat,
            longitude: this.state.current_long,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}>
          <MapView.Circle
            center={{
              latitude: this.state.current_lat,
              longitude: this.state.current_long,
            }}
            radius={200}
            strokeWidth={1}
            strokeColor={'#1a66ff'}
            fillColor={'rgba(230,238,255,0.5)'}
          />

          {this.props.shops.map((marker) => (
            <MapView.Marker
              coordinate={marker}
              title={marker.shop_name}
              onPress={() => this.marker_click()}
              description={marker.shop_address}
              // image={marker.shop_image}
            >
              {/* <MapView.Callout tooltip style={{backgroundColor:'#fff',paddingHorizontal:10,pad}}>
                                      <TouchableOpacity onPress= {()=>this.title_click()} underlayColor='#dddddd'>
                                          <View style={styles.calloutText}>
                                              <Text>{marker.shop_name}{"\n"}{marker.shop_address}</Text>
                                          </View>
                                      </TouchableOpacity>
                                    </MapView.Callout> */}
            </MapView.Marker>
          ))}
          <MapView.Marker
            coordinate={{
              latitude: this.state.current_lat,
              longitude: this.state.current_long,
            }}
            onDragEnd={(e) => {
              this.change_location(e);
            }}
            // onDragEnd={(e) => {console.log('dragEnd', e.nativeEvent.coordinate)}}
            draggable
          />
        </MapView>
        <ScrollView keyboardShouldPersistTaps="always">
          <View style={{height: '50%'}}>
            <TouchableOpacity onPress={() => this.goToFavorite()}>
              <Image
                style={{
                  width: 30,
                  height: 30,
                  resizeMode: 'contain',
                  alignSelf: 'flex-end',
                  marginRight: 30,
                  marginTop: 10,
                }}
                source={require('./images/heart2.png')}
              />
            </TouchableOpacity>

            <Text style={styles.address_text}>Address</Text>

            <View style={{flexDirection: 'row', marginHorizontal: 40}}>
              {/* <TextInput
								style={styles.input}
								autoCapitalize="none"
								placeholder={''}
								multiline={true}
								value={this.state.address}
								returnKeyLabel={'next'}
								onChangeText={text => this.setState({ username: text })}
							/> */}
              <View style={{width: '85%'}}>
                <GooglePlacesAutocomplete
                  fetchDetails={true}
                  styles={{
                    textInputContainer: {
                      borderBottomWidth: 1,
                      borderBottomColor: 'gray',
                    },
                    textInput: {
                      color: '#000000',
                      fontSize: 18,
                    },
                    predefinedPlacesDescription: {
                      color: 'red',
                    },
                    listView: {
                      marginHorizontal: 40,
                    },
                  }}
                  textInputProps={{
                    value: this.state.address,
                    onChangeText: (text) => {
                      this.handleAddressOnKeyUp(text);
                    },
                  }}
                  placeholder={this.state.address}
                  onPress={(data, details = null) => {
                    this.full_address(data, details);
                  }}
                  onFail={(error) => console.error(error)}
                  query={{
                    key: 'AIzaSyAkHq68S7fuekxh15phIQkPYWnQgp7gF74',
                    language: 'en',
                  }}
                />
              </View>
              <TouchableOpacity
                onPress={() => this.get_current_location()}
                style={{width: '15%', marginLeft: 20}}>
                <Image
                  style={{width: 30, height: 30, resizeMode: 'contain'}}
                  source={require('./images/detect.png')}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.distance_text}>Distance</Text>
            <Text style={styles.distance_count_text}>
              {this.state.SliderValue}
            </Text>
            <View
              style={{
                marginHorizontal: 20,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Text>0</Text>
              <Slider
                step={1}
                style={{
                  marginHorizontal: 15,
                  transform: [{scaleX: 1.5}, {scaleY: 1.5}],
                }}
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor="#af0808"
                onValueChange={(ChangedValue) =>
                  this.setState({SliderValue: ChangedValue})
                }
                style={{width: '80%'}}
                value={this.state.SliderValue}
                thumbTintColor="#af0808"
              />
              <Text>100</Text>
            </View>

            <TouchableOpacity
              onPress={() => this.search_button()}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 30,
                marginBottom:50,
              }}>
              <Text style={styles.pay_text}>Search</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    getNearbyShops: () => dispatch(getNearbyShops()),
  };
};
const mapStateToProps = (state) => {
  return {
    shops: state.shop.list,
    loading: state.shop.loading,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Tab_Nearby);
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS == 'ios' ? 35 : 0,
    // paddingBottom: Platform.OS == 'ios' ? 80 : 65,
  },
  lottie: {
    width: 180,
    height: 180,
  },
  thumb: {
    width: 50,
    height: 80,
    backgroundColor: 'red',
    borderBottomRightRadius: 100,
    borderTopRightRadius: 100,
  },
  track: {
    height: 80,
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    paddingBottom: Platform.OS === 'ios' ? 5 : 0,
    marginLeft: 40,
    fontSize: 18,
    marginTop: 10,
    width: '70%',
  },
  address_text: {
    color: '#000000',
    fontSize: 16,
    marginHorizontal: 40,
    marginTop: 25,
  },
  distance_text: {
    color: '#000000',
    fontSize: 16,
    marginHorizontal: 40,
    marginTop: 40,
  },
  pay_text: {
    fontSize: 20,
    color: '#fff',
    backgroundColor: design.theme_color_parent,
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  distance_count_text: {
    color: '#000000',
    fontSize: 16,
    marginHorizontal: 40,
    marginTop: 20,
    textAlign: 'center',
  },
});
