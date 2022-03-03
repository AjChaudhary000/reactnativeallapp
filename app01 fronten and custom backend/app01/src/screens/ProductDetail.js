import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  Linking,
  Platform,
  ScrollView,
  Share,
  StatusBar,
  AsyncStorage,
  PermissionsAndroid,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import design from './StyleFile';
var title,
  cat_name = 'Chez Panisse';
import global from './Global';
import {SliderBox} from 'react-native-image-slider-box';
let shop_id = '';
let rootRef;
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
let user_id = '';
import Toast from 'react-native-simple-toast';
import {getDistance, getPreciseDistance} from 'geolib';
import Geolocation from '@react-native-community/geolocation';
var grand_total;
var lat = '';
var long = '';
var lng = '';
import DeviceInfo from 'react-native-device-info';
import {APP_CONFIG} from '../../config';
import {connect} from 'react-redux';
import {getProductDetails} from '../redux/productSlice';
import {getRelativeDistance, parseOpenTime} from '../utils';
import {mapLocation} from '../redux/locationSlice';
import {addFav, checkFav, removeFav} from '../redux/favSlice';
import {getUserInfo} from '../redux/userSlice';
import {getInfo} from '../redux/chatSlice';
import {getAllProductCategoriesByShopId} from '../redux/productCategorySlice';
var total_qty = 0;
var uniqueId = '';
var current_lat = 0.0;
var current_long = 0.0;
var dayname = '',
  shop_open_time = '',
  shop_closed_time = '';

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      favorite: false,
      moreToggle: false,
      shop: this.props.navigation.getParam('shop'),
      cats: [],
      catsLoading: false,
    };
  }
  backpress = () => {
    this.props.navigation.goBack();
  };
  address = () => {
    this.props.navigation.navigate('Tab_Nearby');
  };
  async _fetchShopCategories() {
    const shop = this.props.navigation.getParam('shop');
    this.setState({catsLoading: true});
    const cats = await getAllProductCategoriesByShopId(shop._id);
    this.setState({cats: cats.data, catsLoading: false});
  }
  componentDidMount() {
    this._fetchShopCategories();
  }
  favorite_mark = (id) => {
    let check = checkFav(this.props.favlist, id);
    if (check) {
      this.props.removeFav(id);
    } else {
      this.props.addFav(id);
    }
  };
  share_artical = () => {
    //Here is the Share API
    Share.share({
      message: 'App01',
    })
      //after successful share return result
      .then((result) => console.log(result))
      //If any thing goes wrong it comes here
      .catch((errorMsg) => console.log(errorMsg));
  };
  phonecall = () => {
    let phoneNumber = '';
    var number = this.state.shop.shop_phone_number;
    if (Platform.OS === 'android') {
      phoneNumber = 'tel:' + number;
    } else {
      phoneNumber = 'telprompt:' + number;
    }

    Linking.openURL(phoneNumber);
  };

  openGps = () => {
    Linking.openURL(
      this.googleMapOpenUrl({
        latitude: parseFloat(this.state.shop.latitude),
        longitude: parseFloat(this.state.shop.longitude),
      }),
    );
  };
  openChat = async () => {
    try {
      // console.log(this.state.shop);
      // const {data} = await getUserInfo(this.state.shop.created_by);
      // if (!data) {
      //   throw new Error('Null response');
      // }
      // this.props.getInfo(this.state.shop.created_by);
      this.props.navigation.navigate('MessageScreen', {
        shop_id: this.state.shop._id,
      });
    } catch (e) {
      console.log(e);
      Toast.show('Some error occurred!');
    }
  };
  googleMapOpenUrl = ({latitude, longitude}) => {
    const latLng = `${latitude},${longitude}`;
    return `google.navigation:q=${latLng}`;
  };
  // openExternalApp(url) {},${
  //     Linking.canOpenURL(url).then(supported => {
  //         if (supported) {
  //             Linking.openURL(url);
  //         } else {
  //             console.log('Don\'t know how to open URI: ' + url);
  //         }
  //     });
  // }

  product_page = (category_name, category_id) => {
    console.log(shop_id);
    this.props.navigation.navigate('ProductList', {
      shop_id: shop_id,
      category_name: category_name,
      category_id: category_id,
      shop_name: this.state.shop_name,
      shop_image: this.state.image_array[0],
      distance: this.state.distance,
      duration: this.state.duration,
    });
  };
  Share = () => {
    //Here is the Share API
    Share.share({
      message: 'App01 App',
    })
      //after successful share return result
      .then((result) => console.log(result))
      //If any thing goes wrong it comes here
      .catch((errorMsg) => console.log(errorMsg));
  };
  cartpage = () => {
    // global.click = '4';
    //this.props.navigation.replace('MainScreen');
    this.props.navigation.navigate('Tab_Cart');
  };
  render() {
    const {shop} = this.state;
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
              onPress={() => this.address()}
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

        <ScrollView>
          <View style={{marginTop: 10, marginBottom: 10}}>
            <SliderBox
              images={shop.images.map(
                (a) => APP_CONFIG.backend_url + '/image/shop/' + a,
              )}
              sliderBoxHeight={120}
              onCurrentImagePressed={(index) =>
                console.warn(`image ${index} pressed`)
              }
              dotColor="#af0808"
              inactiveDotColor="#90A4AE"
              // style={{marginTop:10}}
              resizeMethod={'resize'}
              resizeMode={'cover'}
              paginationBoxStyle={{
                position: 'absolute',
                bottom: 0,
                padding: 0,
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
                paddingVertical: 10,
              }}
              dotStyle={{
                width: 15,
                height: 15,
                borderRadius: 7,
                marginHorizontal: 0,
                padding: 0,
                margin: 0,
                backgroundColor: 'rgba(128, 128, 128, 0.92)',
              }}
              ImageComponentStyle={{height: 220}}
              imageLoadingColor="#11d1ad"
            />

            <View style={{flexDirection: 'row', marginTop: 30}}>
              <View
                style={{
                  width: '33%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Text style={styles.km_text}>
                  {getRelativeDistance(this.props.location, {
                    latitude: shop.latitude,
                    longitude: shop.longitude,
                  })}
                </Text>
              </View>

              <View
                style={{
                  width: '33%',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Text style={styles.mints_text}>
                  {parseOpenTime(shop.shop_timing)}
                </Text>
                {/* <Text style={styles.mints_text}>mins</Text> */}
              </View>

              <View
                style={{
                  width: '30%',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <View
                  style={
                    shop.delivery_available === true
                      ? styles.Delivery
                      : styles.not_Delivery
                  }
                />
                <Text style={styles.veg_text}>
                  {shop.delivery_available === true
                    ? 'Delivery: ' + shop.delivery_distance + 'km'
                    : null}
                </Text>
              </View>
            </View>
            {/* 
            <Text
              style={[
                styles.mints_text,
                {fontSize: 14, marginLeft: 20, marginTop: 15},
              ]}>
              {'Shop Open Time : ' + shop_open_time + ' (' + dayname + ')'}
            </Text>
            <Text style={[styles.mints_text, {fontSize: 14, marginLeft: 20}]}>
              {'Shop Closed Time : ' + shop_closed_time + ' (' + dayname + ')'}
            </Text> */}
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 30,
                marginTop: 30,
              }}>
              <View style={{width: '50%', flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => this.favorite_mark(shop._id)}>
                  <Image
                    style={{width: 35, height: 35, resizeMode: 'contain'}}
                    source={
                      !checkFav(this.props.favlist, shop._id)
                        ? require('./images/heart.png')
                        : require('./images/heart2.png')
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={this.Share}>
                  <Image
                    style={{
                      width: 35,
                      height: 35,
                      resizeMode: 'contain',
                      marginLeft: 10,
                    }}
                    source={require('./images/share.png')}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  width: '50%',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}>
                <TouchableOpacity underlayColor="#fff" onPress={this.phonecall}>
                  <Image
                    style={{width: 35, height: 35, resizeMode: 'contain'}}
                    source={require('./images/call.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity underlayColor="#fff" onPress={this.openGps}>
                  <Image
                    style={{
                      width: 35,
                      height: 35,
                      resizeMode: 'contain',
                      marginLeft: 10,
                    }}
                    source={require('./images/direction.png')}
                  />
                </TouchableOpacity>
                <TouchableOpacity underlayColor="#fff" onPress={this.openChat}>
                  <Image
                    style={{
                      width: 32,
                      height: 32,
                      resizeMode: 'contain',
                      marginLeft: 10,
                    }}
                    source={require('./images/iconn_2.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {shop.payment_pos && (
              <View
                style={{
                  marginTop: 5,
                  alignItems: 'flex-end',
                  marginRight: 30,
                  alignSelf: 'flex-end',
                  flexDirection: 'row',
                }}>
                <Image
                  style={{
                    width: 35,
                    height: 35,
                    resizeMode: 'contain',
                    marginLeft: 10,
                  }}
                  source={require('./images/visa.png')}
                />
                <Image
                  style={{
                    width: 35,
                    height: 35,
                    resizeMode: 'contain',
                    marginLeft: 10,
                  }}
                  source={require('./images/master_logo.png')}
                />
              </View>
            )}
            <View style={{paddingHorizontal: 20}}>
              <Text style={styles.shopname_text}>{shop.shop_name}</Text>
              <Text style={styles.detail_text}>
                {this.state.moreToggle
                  ? shop.description
                  : shop.description.slice(0, 180) + '...'}
              </Text>
              {shop.description.length > 180 && (
                <TouchableOpacity
                  onPress={() =>
                    this.setState({moreToggle: !this.state.moreToggle})
                  }>
                  <Text>more</Text>
                </TouchableOpacity>
              )}
            </View>
            <AnimatedLoader
              visible={this.state.catsLoading}
              overlayColor="rgba(255,255,255,0.15)"
              source={require('./loader.json')}
              animationStyle={styles.lottie}
              speed={1}
            />
          </View>
          <FlatList
            data={this.state.cats}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('ProductList', {
                    shop: shop,
                    category_id: item._id,
                  });
                }}>
                <Text style={styles.subtitle_text}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </ScrollView>
        {/* {this.state.cart_item == true ? (
          <TouchableOpacity
            onPress={() => this.cartpage()}
            style={{
              marginBottom: 20,
              marginTop: 10,
              flexDirection: 'row',
              backgroundColor: '#ad0101',
              marginHorizontal: 20,
              borderRadius: 10,
              padding: 12,
            }}>
            <View style={{width: '20%'}}>
              <Text style={styles.placeorder_1}>{total_qty}</Text>
            </View>

            <Text style={styles.placeorder_2}>View your cart</Text>
            <Text style={styles.placeorder_3}>€{this.state.grand_price}</Text>
          </TouchableOpacity>
        ) : null} */}
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // getProductDetails: (id) => dispatch(getProductDetails(id)),
    addFav: (id) => dispatch(addFav(id)),
    removeFav: (id) => dispatch(removeFav(id)),
    getInfo: (id) => dispatch(getInfo(id)),
  };
};
const mapStateToProps = (state) => {
  return {
    address: state.location.address,
    location: mapLocation(state.location.location),
    favlist: state.fav.list,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductDetail);
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS == 'ios' ? 40 : 40,
  },
  lottie: {
    width: 100,
    height: 100,
  },
  input: {
    fontSize: 18,
    marginLeft: 10,
  },
  favorite_text: {
    fontSize: 18,
    marginLeft: 10,
    alignSelf: 'center',
  },
  title_text: {
    color: '#000000',
    fontSize: 18,
    marginHorizontal: 30,
    marginTop: 30,
  },
  km_text: {
    color: '#000000',
    fontSize: 15,
  },
  mints_text: {
    color: design.theme_color_child,
    fontSize: 15,
  },
  veg_text: {
    color: design.theme_color_child,
    fontSize: 15,
    marginLeft: 3,
  },
  veg_box: {
    height: 15,
    width: 15,
    borderRadius: 8,
    backgroundColor: 'green',
  },
  non_veg_box: {
    height: 15,
    width: 15,
    borderRadius: 8,
    backgroundColor: 'red',
  },
  shopname_text: {
    color: '#000000',
    fontSize: 20,
    marginTop: 30,
    textAlign: 'center',
  },
  detail_text: {
    color: design.theme_color_child,
    fontSize: 15,
    marginTop: 10,
  },
  productname_text: {
    fontSize: 18,
    color: design.black,
  },
  qty_text: {
    fontSize: 18,
    color: design.black,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderColor: '#dcdcdc',
    borderWidth: 1,
  },
  productprice_text: {
    fontSize: 18,
    color: design.black,
  },
  item_name_text: {
    fontSize: 15,
    marginLeft: 5,
    marginTop: 8,
  },
  item_price_text: {
    fontSize: 15,
    marginLeft: 5,
    marginTop: 2,
  },
  desc_text: {
    fontSize: 15,
    marginLeft: 5,
    color: design.theme_color_child,
  },
  subtitle_text: {
    color: design.theme_color_child,
    fontSize: 18,
    marginHorizontal: 40,
    marginVertical: 10,
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
  veg_text: {
    color: design.theme_color_child,
    fontSize: 15,
    marginLeft: 3,
  },
  placeorder_1: {
    fontSize: 18,
    color: design.theme_color_parent,
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    textAlign: 'center',
  },
  placeorder_2: {
    width: '50%',
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
  },
  placeorder_3: {
    width: '30%',
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
  },
});
