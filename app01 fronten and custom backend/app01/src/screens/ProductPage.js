import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  Share,
  StyleSheet,
  Linking,
  Platform,
  ScrollView,
  AsyncStorage,
  StatusBar,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import design from './StyleFile';
let product_id = '';
import global from './Global';
import FitImage from 'react-native-fit-image';
let rootRef;
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
let user_id = '',
  category_id = '',
  distance = '',
  duration = '';
import Toast from 'react-native-simple-toast';
var shop_id = '';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
} from 'react-native-popup-dialog';
import DeviceInfo from 'react-native-device-info';
var uniqueId = '';
var total_qty = 0;
import {SliderBox} from 'react-native-image-slider-box';
import {getProductDetails} from '../redux/productSlice';
import {APP_CONFIG} from '../../config';
import {calculateDiscountPercent, calculateProductQuantity} from '../utils';
import {connect} from 'react-redux';
import {add_product, clear_cart, remove_product} from '../redux/cartSlice';
import CartFloat from './components/CartFloat';
import {addFav, checkFav, removeFav} from '../redux/favSlice';

class ProductDetail extends Component {
  backpress = () => {
    this.props.navigation.goBack();
  };
  address = () => {
    // global.click = '0';
    // this.props.navigation.replace('MainScreen');
    this.props.navigation.navigate('Tab_Nearby');
  };
  constructor(props) {
    super(props);
    (this.categoryies = []),
      (this.state = {
        fevorite: false,
        product_in_cart: false,
        product_qty: 0,
        cart_id: '',
        get_shopid_from_cart_table: '',
        product_available_status: '',
        product_description: '',
        product_discount: '',
        product_image: '',
        product_name: '',
        product_price: '',
        total_price: '',
        shop_name: '',
        shop_image: '',
        favorite: false,
        item_count: '',
        get_total: '',
        confirmation_dialog: false,
        selling_price: '',
        regular_price: '',
        disiunt_in_percantage: '',
        cart_item: false,
        image_array: [],
      });
  }
  componentDidMount = () => {
    const id = this.props.navigation.getParam('id');
    this.props.getProductDetails(id);
  };
  remove_button = () => {
    this.props.clearCart();
    this.setState({scaleAnimationDialog: true});
    this.setState({confirmation_dialog: false});
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
    // this.props.navigation.replace('MainScreen');
    this.props.navigation.navigate('Tab_Cart');
  };
  favorite_mark = (id) => {
    let check = checkFav(this.props.favlist, id);
    if (check) {
      this.props.removeFav(id);
    } else {
      this.props.addFav(id);
    }
  };
  shop_page = (item) => {
    this.props.navigation.navigate('ProductDetail', {shop: item});
  };
  no_button = () => {
    this.setState({confirmation_dialog: false});
  };
  addToCart = (product) => {
    if (
      product.shop_id !== this.props.cart_shop_id &&
      this.props.cart_products.length !== 0
    ) {
      this.setState({confirmation_dialog: true});
    } else {
      this.props.addToCart(product);
    }
  };
  render() {
    const {navigation} = this.props;
    const {product} = this.props;
    if (Object.keys(this.props.product).length === 0) {
      return (
        <View style={styles.MainContainer}>
          <AnimatedLoader
            visible={true}
            overlayColor="rgba(255,255,255,0.15)"
            source={require('./loader.json')}
            animationStyle={styles.lottie}
            speed={1}
          />
        </View>
      );
    }
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
              paddingRight: 25,
              overflow: 'hidden',
            }}>
            <TouchableOpacity
              onPress={() => this.address()}
              style={{flexDirection: 'row', marginTop: 5}}>
              <Text numberOfLines={1} style={{width: '90%'}}>
                {this.props.address}
              </Text>
              <Image
                style={{
                  width: '10%',
                  height: 20,
                  resizeMode: 'contain',
                  marginLeft: 5,
                  tintColor: design.theme_color_parent,
                }}
                source={require('./images/down.png')}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView>
          <View style={{marginTop: 10, marginBottom: 100}}>
            <SliderBox
              images={product.images.map(
                (a) => APP_CONFIG.backend_url + '/image/products/' + a,
              )}
              onCurrentImagePressed={(index) =>
                console.warn(`image ${index} pressed`)
              }
              dotColor="#af0808"
              inactiveDotColor="#90A4AE"
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
              ImageComponentStyle={{height: 230, width: '100%'}}
              imageLoadingColor="#11d1ad"
            />

            <View
              style={{
                flexDirection: 'row',
                paddingHorizontal: 20,
                paddingTop: 8,
              }}>
              <View style={{width: '50%', flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => this.favorite_mark(product._id)}>
                  <Image
                    style={{width: 35, height: 35, resizeMode: 'contain'}}
                    source={
                      checkFav(this.props.favlist, product._id) === false
                        ? require('./images/heart.png')
                        : require('./images/heart2.png')
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.Share()}>
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
                  marginLeft: 20,
                  justifyContent: 'center',
                }}>
                <TouchableOpacity onPress={() => this.shop_page(product.shop)}>
                  <Text numberOfLines={1} style={styles.dummy_text}>
                    {product.shop.shop_name}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.shopname_text}>{product.product_name}</Text>
            <Text style={styles.detail_text}>
              {product.product_description}
            </Text>
            {product.selling_price !== product.product_price ? (
              <Text style={styles.percantage_text}>
                {calculateDiscountPercent(
                  product.product_price,
                  product.selling_price,
                )}
                % off
              </Text>
            ) : null}

            <View style={{flexDirection: 'row', marginLeft: 25, marginTop: 5}}>
              <Text style={styles.selling_price_text}>
                € {product.selling_price}
              </Text>
              {product.selling_price !== product.product_price && (
                <Text style={styles.regular_price_text}>
                  €{product.product_price}
                </Text>
              )}
            </View>

            {/* <Text style={styles.item_price_text}>{this.state.total_price}</Text> */}

            {this.props.cart_products.filter((d) => product._id === d._id)
              .length !== 0 ? (
              <View
                style={{
                  flexDirection: 'row',
                  paddingRight: 20,
                  alignSelf: 'flex-end',
                  marginTop: 10,
                }}>
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: '#dcdcdc',
                    height: 30,
                    width: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => this.props.removeFromCart(product)}>
                  <Text style={{fontSize: 15}}>-</Text>
                </TouchableOpacity>

                <Text style={styles.qty_text}>
                  {calculateProductQuantity(
                    product._id,
                    this.props.cart_products,
                  )}
                </Text>
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: '#dcdcdc',
                    height: 30,
                    width: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => this.props.addToCart(product)}>
                  <Text style={{fontSize: 15}}>+</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => this.addToCart(product)}>
                <Text style={styles.add_to_cart_text}>Add To Cart</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
        {this.props.cart_products.length !== 0 ? (
          <CartFloat navigation={this.props.navigation} />
        ) : null}

        <Dialog
          onTouchOutside={() => {
            this.setState({confirmation_dialog: false});
          }}
          width={0.9}
          visible={this.state.confirmation_dialog}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            console.log('onHardwareBackPress');
            this.setState({confirmation_dialog: false});
            return true;
          }}
          actions={[
            <DialogButton
              text="DISMISS"
              onPress={() => {
                this.setState({confirmation_dialog: false});
              }}
              key="button-1"
            />,
          ]}>
          <DialogContent>
            <View>
              <Text style={styles.dialog_title_text}>
                You still have product from another shop. Shall we start over
                with a fresh cart ?
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 10,
                  marginBottom: 10,
                  justifyContent: 'center',
                }}>
                <TouchableOpacity
                  style={{width: '45%'}}
                  onPress={() => this.no_button()}>
                  <Text style={styles.no_text}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{width: '45%'}}
                  onPress={() => this.remove_button()}>
                  <Text style={styles.remove_text}>Remove Products</Text>
                </TouchableOpacity>
              </View>
            </View>
          </DialogContent>
        </Dialog>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getProductDetails: (id) => dispatch(getProductDetails(id)),
    addToCart: (product) => dispatch(add_product(product)),
    removeFromCart: (product) => dispatch(remove_product(product)),
    clearCart: () => dispatch(clear_cart()),
    addFav: (id) => dispatch(addFav(id)),
    removeFav: (id) => dispatch(removeFav(id)),
  };
};
const mapStateToProps = (state) => {
  return {
    product: state.product.productDetails,
    loading: state.product.loading,
    cart_products: state.cart.products,
    cart_shop_id: state.cart.shop_id,
    address: state.location.address,
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
    width: 180,
    height: 180,
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
    marginHorizontal: 20,
    marginTop: 20,
    textAlign: 'center',
  },
  detail_text: {
    color: design.theme_color_child,
    fontSize: 15,
    marginHorizontal: 20,
    marginTop: 10,
  },
  productname_text: {
    fontSize: 18,
    color: design.black,
  },
  qty_text: {
    fontSize: 18,
    color: design.black,
    height: 30,
    width: 40,
    borderColor: '#dcdcdc',
    borderWidth: 1,
    textAlign: 'center',
    alignSelf: 'center',
    paddingTop: 3,
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
    fontSize: 25,
    marginLeft: 25,
    marginTop: 5,
  },
  percantage_text: {
    fontSize: 15,
    marginLeft: 25,
    marginTop: 15,
    color: design.theme_color_parent,
  },
  selling_price_text: {
    fontSize: 21,
    color: design.theme_color_parent,
  },
  regular_price_text: {
    fontSize: 21,
    marginLeft: 10,
    color: design.theme_color_child,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  desc_text: {
    fontSize: 15,
    marginLeft: 5,
    color: design.theme_color_child,
  },
  add_to_cart_text: {
    fontSize: 15,
    color: design.white,
    backgroundColor: design.theme_color_parent,
    alignSelf: 'flex-end',
    marginRight: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
  },
  dummy_text: {
    color: '#000000',
    fontSize: 20,
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
  dialog_title_text: {
    color: design.black,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 15,
    marginTop: 25,
  },
  no_text: {
    color: design.theme_color_parent,
    backgroundColor: design.white,
    fontSize: 18,
    textAlign: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: design.theme_color_parent,
    borderRadius: 10,
    overflow: 'hidden',
    // width:'45%',
    marginRight: 5,
  },
  remove_text: {
    color: design.white,
    backgroundColor: design.theme_color_parent,
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: design.theme_color_parent,
    borderRadius: 10,
    overflow: 'hidden',
    // width:'45%',
    marginLeft: 5,
  },
});
