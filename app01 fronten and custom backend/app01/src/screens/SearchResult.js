/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  StatusBar,
  TextInput,
  Platform,
  AsyncStorage,
  PermissionsAndroid,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import design from './StyleFile';
var title = 'Categories';
import global from './Global';
let rootRef;
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
import Toast from 'react-native-simple-toast';
let user_id = '';
import FitImage from 'react-native-fit-image';
import {getDistance, getPreciseDistance} from 'geolib';
import Geolocation from '@react-native-community/geolocation';
let arr_category = [];
import DeviceInfo from 'react-native-device-info';
import {duration} from 'moment';
import {getAllCategories} from '../redux/categorySlice';
import {connect} from 'react-redux';
import {getNearbyShops, searchShopAndProducts} from '../redux/shopSlice';
import {getNearbyProduct} from '../redux/productSlice';
import {APP_CONFIG} from '../../config';
import {ScrollView} from 'react-native-gesture-handler';
import {getRelativeDistance} from '../utils';
import {mapLocation} from '../redux/locationSlice';
// import {debounce} from 'lodash';

class SearchResult extends Component {
  backpress = () => {
    // global.click = '0';
    // this.props.navigation.replace('MainScreen');
    this.props.navigation.goBack();
  };

  constructor(props) {
    super(props);
    (this.categoryies = []),
      (this.state = {
        favorite: false,
        category_list: [],
        search_keyword: '',
        search: false,
        shop_list: [],
        current_latitude: 0.0,
        current_longitude: 0.0,
        search_res: {},
      });
  }

  handleChange = (e) => {
    const val = e.target.value;

    this.setState({value: val}, () => {
      this.changeSearch(val);
    });
  };
  async componentDidMount() {
    this.props.getAllCategories();
    // this.props.getNearbyShops();
    // this.props.getNearbyProducts();
  }

  favorite_mark = () => {
    this.props.navigation.navigate('Favorite');
  };
  nextscreen = (cat_id, cat_name) => {
    this.props.navigation.navigate('ResturentDetail', {cat_id, cat_name});
  };

  onInput = (value) => {
    var duration = 1000;
    clearTimeout(this.inputTimer);
    this.inputTimer = setTimeout(async () => {
      if (value.length == 0) {
        this.setState({search_res: {}});
        //this.getFirebasedate();
      } else {
        const searchRes = await searchShopAndProducts(value);
        console.log(searchRes);
        this.setState({search_res: searchRes.data});
      }
    }, duration);
  };
  product_details = (index) => {
    this.props.navigation.navigate('ProductPage', {
      id: this.props.products[index]._id,
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
            onPress={this.backpress}
            style={{
              width: '40%',
              flexDirection: 'row',
              marginBottom: 8,
              paddingLeft: 15,
              paddingRight: 10,
              overflow: 'hidden',
            }}>
            <TouchableOpacity
              onPress={this.backpress}
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

        <View
          style={{
            backgroundColor: '#DCDCDC',
            padding: Platform.OS == 'ios' ? 10 : 2,
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: '#dcdcdc',
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 40,
            borderRadius: 5,
            marginTop: 25,
            overflow: 'hidden',
          }}>
          <View
            style={{
              width: '15%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{width: 25, height: 25, resizeMode: 'contain'}}
              source={require('./images/search.png')}
            />
          </View>
          <View style={{width: '70%'}}>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              numberOfLines={1}
              placeholder={'Search for market products'}
              returnKeyLabel={'next'}
              ref={(input) => {
                this.textInput = input;
              }}
              onChangeText={(value) => this.onInput(value)}
            />
          </View>
        </View>
        {Object.keys(this.state.search_res).length === 0 && (
          <TouchableOpacity
            onPress={this.favorite_mark}
            style={{
              flexDirection: 'row',
              marginHorizontal: 30,
              marginTop: 30,
            }}>
            <Image
              style={{
                width: 30,
                height: 30,
                resizeMode: 'contain',
                tintColor: design.theme_color_parent,
                marginLeft: 15,
              }}
              source={
                this.state.favorite == false
                  ? require('./images/heart2.png')
                  : require('./images/heart2.png')
              }
            />
            <Text style={styles.favorite_text}>Favorite</Text>
          </TouchableOpacity>
        )}
        {this.props.categories !== 0 &&
        Object.keys(this.state.search_res).length === 0 ? (
          <Text style={styles.title_text}>Categories</Text>
        ) : null}

        {Object.keys(this.state.search_res).length === 0 && (
          <FlatList
            horizontal={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            numColumns={1}
            style={{
              flexGrow: 0,
            }}
            data={this.props.categories}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => {
                  this.nextscreen(item._id, item.name);
                }}>
                <Text style={styles.subtitle_text}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        {/* <FlatList
            horizontal={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item._id}
            numColumns={1}
            style={{marginTop: 30}}
            data={
              Object.keys(this.state.search_res).length === 0
                ? this.props.products
                : this.state.search_res.products
            }
            renderItem={({item, index}) => (
              <View>
                <TouchableOpacity
                  onPress={() => this.product_details(index)}
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
                            '/image/products/' +
                            item.images[0],
                        }}
                      />
                    </View>

                    {item.product_discount != '' ? (
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          backgroundColor: design.theme_color_parent,
                          width: '60%',
                          borderTopRightRadius: 7,
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: '#fff',
                            fontSize: 13,
                            paddingVertical: 2,
                          }}>
                          {((item.product_price - item.selling_price) * 100) /
                            item.product_price}
                          % off
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <View
                    style={{width: '70%', marginLeft: 10, paddingRight: 20}}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.shoptitle_text}>
                        {item.product_name}
                      </Text>
                      {item.product_available_status == true ? null : (
                        <Text style={styles.soldout_text}>(Not Available)</Text>
                      )}
                    </View>

                    <Text numberOfLines={1} style={styles.subtitle_text_2}>
                      {item.product_description}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <Text numberOfLines={1} style={styles.pricetitle_text}>
                        €{item.selling_price}
                      </Text>

                      {item.product_discount == '' ? null : (
                        <Text
                          numberOfLines={1}
                          style={styles.pricetitle_text_2}>
                          €{item.product_price}
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          /> */}
      </View>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    getAllCategories: () => dispatch(getAllCategories()),
    getNearbyShops: () => dispatch(getNearbyShops()),
    getNearbyProducts: () => dispatch(getNearbyProduct()),
  };
};
const mapStateToProps = (state) => {
  return {
    categories: state.categories.list,
    cat_loading: state.categories.loading,
    shops: state.shop.list,
    products: state.product.list,
    address: state.location.address,
    location: mapLocation(state.location.location),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SearchResult);
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS == 'ios' ? 40 : 40,
    // paddingBottom: Platform.OS == 'ios' ? 80 : 65,
  },
  lottie: {
    width: 180,
    height: 180,
  },
  input: {
    fontSize: 18,
    marginLeft: 5,
  },
  favorite_text: {
    fontSize: 18,
    marginLeft: 10,
    alignSelf: 'center',
  },
  title_text: {
    color: '#000000',
    fontSize: 18,
    marginTop: 30,
    textAlign: 'center',
    width: '100%',
  },
  soldout_text: {
    color: 'red',
    fontSize: 18,
    marginLeft: 10,
  },
  subtitle_text: {
    color: design.theme_color_child,
    fontSize: 18,
    marginHorizontal: 40,
    marginTop: 30,
  },
  shop_title_text: {
    color: '#000000',
    fontSize: 18,
  },
  shop_subtitle_text: {
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
  product_price_text: {
    color: design.theme_color_child,
    fontSize: 16,
    marginTop: 5,
  },
  shoptitle_text: {
    color: '#000000',
    fontSize: 18,
  },
  subtitle_text_2: {
    color: design.theme_color_child,
    fontSize: 16,
    marginTop: 5,
  },
  pricetitle_text: {
    color: design.theme_color_parent,
    fontSize: 18,
    marginTop: 5,
  },
  pricetitle_text_2: {
    color: design.theme_color_child,
    fontSize: 16,
    marginTop: 5,
    marginLeft: 10,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
});
