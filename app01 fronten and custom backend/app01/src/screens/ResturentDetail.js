import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  StatusBar,
  AsyncStorage,
  Platform,
  PermissionsAndroid,
  TextInput,
  ImageBackground,
} from 'react-native';
import Toast from 'react-native-simple-toast';

import {TouchableOpacity} from 'react-native-gesture-handler';
import design from './StyleFile';
import global from './Global';
let rootRef;
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
let user_id = '';
let arr = [];
import FitImage from 'react-native-fit-image';
import {getDistance, getPreciseDistance} from 'geolib';
import Geolocation from '@react-native-community/geolocation';
import DeviceInfo from 'react-native-device-info';
import {connect} from 'react-redux';
import {getAllShopFromCategory} from '../redux/shopSlice';
import {APP_CONFIG} from '../../config';
import {mapLocation} from '../redux/locationSlice';
import {getRelativeDistance} from '../utils';
var uniqueId = '';

class ResturentDetail extends Component {
  constructor(props) {
    super(props);
    (this.categoryies = []),
      (this.state = {
        shop_list: [],
        current_latitude: 0.0,
        current_longitude: 0.0,
        get_data: '',
      });
  }
  async componentDidMount() {
    this.props.getShopsFromCategory(this.props.navigation.getParam('cat_id'));
  }

  backpress = () => {
    this.props.navigation.goBack();
    // global.click = '6';
    // this.props.navigation.replace('MainScreen');
  };

  address_click = () => {
    // global.click = '0';
    // this.props.navigation.replace('MainScreen');
    this.props.navigation.navigate('Tab_Nearby');
  };

  nextscreen = (item) => {
    this.props.navigation.navigate('ProductDetail', {shop: item});
  };
  render() {
    console.log(this.props.shops);
    const {shops} = this.props;
    return (
      <View style={styles.MainContainer}>
        <AnimatedLoader
          visible={this.props.loading}
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

        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              width: '10%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <TouchableOpacity onPress={this.backpress} style={{width: '20%'}}>
              <Image
                style={{
                  width: 30,
                  height: 30,
                  resizeMode: 'contain',
                  tintColor: design.theme_color_parent,
                  alignSelf: 'center',
                }}
                source={require('./images/back.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={{width: '50%'}}>
            <Image
              style={{width: 100, height: 30, resizeMode: 'contain'}}
              source={require('./images/app1.png')}
            />
          </View>
          <View
            style={{
              width: '40%',
              flexDirection: 'row',
              marginBottom: 8,
              paddingLeft: 15,
              paddingRight: 10,
              overflow: 'hidden',
            }}>
            <TouchableOpacity
              onPress={() => this.address_click()}
              style={{flexDirection: 'row', marginTop: 5}}>
              <Text numberOfLines={1} style={{width: '85%'}}>
                {this.props.address}
              </Text>
              <Image
                style={{
                  width: '15%',
                  height: 20,
                  resizeMode: 'contain',
                  tintColor: design.theme_color_parent,
                }}
                source={require('./images/down.png')}
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.top_cat_title_text}>
          {this.props.navigation.getParam('cat_name')}
        </Text>

        {shops.length !== 0 ? (
          <FlatList
            horizontal={false}
            showsVerticalScrollIndicator={false}
            numColumns={1}
            keyExtractor={(item) => item._id}
            style={{marginTop: 30}}
            data={shops}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => this.nextscreen(item)}
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 20,
                  marginBottom: 30,
                }}>
                <View style={{width: '30%'}}>
                  <View
                    style={{
                      width: '100%',
                      height: 100,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 10,
                      overflow: 'hidden',
                    }}>
                    <ImageBackground
                      style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'contain',
                      }}
                      source={{
                        uri:
                          APP_CONFIG.backend_url +
                          '/image/shop/' +
                          item.images[0],
                      }}
                    />
                  </View>
                </View>
                <View style={{width: '70%', marginLeft: 7}}>
                  <Text style={styles.title_text}>{item.shop_name}</Text>
                  <Text numberOfLines={1} style={styles.subtitle_text}>
                    {item.description}
                  </Text>
                  {item.payment_pos && (
                    <View
                      style={{
                        alignItems: 'flex-end',
                        flexDirection: 'row',
                      }}>
                      <Image
                        style={{
                          width: 25,
                          height: 25,
                          resizeMode: 'contain',
                        }}
                        source={require('./images/visa.png')}
                      />
                      <Image
                        style={{
                          width: 25,
                          height: 25,
                          resizeMode: 'contain',
                          marginLeft: 10,
                        }}
                        source={require('./images/master_logo.png')}
                      />
                    </View>
                  )}
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 2,
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text maxLength={5} style={styles.km_text}>
                        {getRelativeDistance(this.props.location, {
                          latitude: item.latitude,
                          longitude: item.longitude,
                        })}
                      </Text>
                      {/* <Text maxLength={5} style={styles.mints_text}>away,</Text> */}
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text maxLength={5} style={styles.mints_text}>
                        {/* {10}{' '} */}
                      </Text>
                      {/* <Text maxLength={5} style={styles.mints_text}>
													mins
												</Text> */}
                    </View>
                    <View
                      style={{
                        justifyContent: 'center',
                        marginHorizontal: 10,
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <View
                        style={
                          item.delivery_available == true
                            ? styles.Delivery
                            : styles.not_Delivery
                        }
                      />
                      <Text style={styles.veg_text}>
                        {item.delivery_available == true ? 'Delivery' : null}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}>
            <Text style={styles.nodata_found_text}>Opps! It's Empty</Text>
            <Text style={styles.nodata_found_text_2}>
              There are no shops under this category right now.
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // getProductDetails: (id) => dispatch(getProd(id)),
    getShopsFromCategory: (id) => dispatch(getAllShopFromCategory(id)),
  };
};
const mapStateToProps = (state) => {
  return {
    shops: state.shop.list,
    loading: state.shop.loading,
    location: mapLocation(state.location.location),
    address: state.location.address,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ResturentDetail);
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS == 'ios' ? 40 : 40,
    paddingBottom: Platform.OS === 'ios' ? 80 : 65,
  },
  lottie: {
    width: 180,
    height: 180,
  },
  title_text: {
    color: '#000000',
    fontSize: 18,
  },
  subtitle_text: {
    color: design.theme_color_child,
    fontSize: 16,
    marginTop: 5,
  },
  km_text: {
    color: '#000000',
    fontSize: 15,
  },
  mints_text: {
    color: design.theme_color_child,
    fontSize: 15,
  },
  nodata_found_text: {
    color: design.black,
    fontSize: 18,
  },
  nodata_found_text_2: {
    color: design.grey,
    fontSize: 14,
    marginTop: 5,
  },
  veg_text: {
    color: design.theme_color_child,
    fontSize: 15,
    marginLeft: 3,
  },
  Delivery: {
    height: 15,
    width: 15,
    borderRadius: 8,
    backgroundColor: 'green',
  },
  not_Delivery: {
    height: 15,
    width: 15,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  top_cat_title_text: {
    color: '#000000',
    fontSize: 18,
    marginHorizontal: 30,
    marginTop: 30,
    textAlign: 'center',
  },
  input: {
    fontSize: 18,
    marginLeft: 10,
    width: '80%',
  },
});
