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
  ImageBackground,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import design from './StyleFile';
var title = 'Chez Panisse';
import global from './Global';
let rootRef;
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
import FitImage from 'react-native-fit-image';
let user_id = '',
  category_name = '',
  shop_name = '',
  shop_image = '',
  distance = '',
  duration = '';
import DeviceInfo from 'react-native-device-info';
var uniqueId = '';
import Toast from 'react-native-simple-toast';
import {getProductFromShop} from '../redux/productSlice';
import {connect} from 'react-redux';
import {APP_CONFIG} from '../../config';
import {calculateDiscountPercent} from '../utils';
var total_qty = 0;
class ProductList extends Component {
  backpress = () => {
    this.props.navigation.goBack();
  };

  constructor(props) {
    super(props);
    this.state = {
      product_list: [],
      loading: false,
    };
  }
  componentDidMount = () => {
    const shop = this.props.navigation.getParam('shop');
    const category_id = this.props.navigation.getParam('category_id');
    this.props.getProducts({shop_id: shop._id, category_id});
  };

  nextscreen = (item) => {
    if (item.product_available_status == true) {
      this.props.navigation.navigate('ProductPage', {id: item._id});
    } else {
      Toast.show('This product is not available');
    }

    // console.log(this.state.cart_item)
  };
  address = () => {
    // global.click = '0';
    // this.props.navigation.replace('MainScreen');
    this.props.navigation.navigate('Tab_Nearby');
  };
  cartpage = () => {
    // global.click = '4';
    // this.props.navigation.replace('MainScreen');
    this.props.navigation.navigate('Tab_Cart');
  };

  render() {
    const {navigation} = this.props;
    const shop = navigation.getParam('shop');
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
        <TouchableOpacity onPress={() => this.backpress()}>
          <Text style={styles.shopname_text}>{shop.shop_name}</Text>
        </TouchableOpacity>

        {this.props.products.length !== 0 ? (
          <FlatList
            horizontal={false}
            showsVerticalScrollIndicator={false}
            numColumns={1}
            style={{marginTop: 20}}
            data={this.props.products}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => this.nextscreen(item)}
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 20,
                  marginBottom: 30,
                }}>
                <View style={{width: '35%', overflow: 'hidden'}}>
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
                  {item.product_price !== item.selling_price && (
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
                        {calculateDiscountPercent(
                          item.product_price,
                          item.selling_price,
                        )}
                        % off
                      </Text>
                    </View>
                  )}
                </View>
                <View style={{width: '65%', marginLeft: 7, paddingRight: 20}}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.title_text}>{item.product_name}</Text>
                    {item.product_available_status == true ? null : (
                      <Text style={styles.soldout_text}>(Not Available)</Text>
                    )}
                  </View>

                  <Text numberOfLines={1} style={styles.subtitle_text}>
                    {item.product_description}
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text numberOfLines={1} style={styles.pricetitle_text}>
                      €{item.selling_price}
                    </Text>

                    {item.product_price === item.selling_price ? null : (
                      <Text numberOfLines={1} style={styles.pricetitle_text_2}>
                        €{item.product_price}
                      </Text>
                    )}
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
              flex: 1,
            }}>
            <Text style={styles.nodata_found_text}>Opps! It's Empty</Text>
            <Text style={styles.nodata_found_text_2}>
              There are no product under this category right now.
            </Text>
          </View>
        )}
      </View>
    );
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    getProducts: (id) => dispatch(getProductFromShop(id)),
  };
};
const mapStateToProps = (state) => {
  return {
    products: state.product.list,
    loading: state.product.loading,
    address: state.location.address,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProductList);
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS == 'ios' ? 40 : 40,
    //paddingBottom: Platform.OS == 'ios' ? 80 : 65,
  },
  lottie: {
    width: 180,
    height: 180,
  },
  title_text: {
    color: '#000000',
    fontSize: 18,
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
  subtitle_text: {
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
  soldout_text: {
    color: 'red',
    fontSize: 12,
    marginLeft: 10,
    marginTop: 5,
  },
  shopname_text: {
    color: '#000000',
    fontSize: 20,
    marginHorizontal: 20,
    marginTop: 20,
    textAlign: 'center',
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
