import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  AsyncStorage,
  StatusBar,
  Platform,
  DevSettings,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import design from './StyleFile';

import FitImage from 'react-native-fit-image';
let rootRef;
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
import {connect} from 'react-redux';
import {fetchFavs} from '../redux/favSlice';
import {APP_CONFIG} from '../../config';
import {getRelativeDistance, parseOpenTime} from '../utils';
import {mapLocation} from '../redux/locationSlice';
import SimpleToast from 'react-native-simple-toast';
let user_id = '';
class Favorite extends Component {
  constructor(props) {
    super(props);
    (this.categoryies = []),
      (this.state = {
        categoryHolder: [
          {
            title: 'Chez Panisse',
            subtitle: 'Chez Panisse',
            km: '2.8km',
            duration: '30',
            type: 'veg',
          },
          {
            title: 'Manresa',
            subtitle: 'Manresa',
            km: '2.8km',
            duration: '30',
            type: 'non veg',
          },
        ],
        shop_list: [],
      });
  }
  componentDidMount = () => {
    if (this.props.token === '') {
      this.props.navigation.goBack();
      this.props.navigation.navigate('SignIn');
      SimpleToast.show('User need to be logged in to use this feature.');
    } else {
      this.props.fetchFavs();
    }
  };
  backpress = () => {
    this.props.navigation.goBack();
  };
  render() {
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
        <View style={{flexDirection: 'row', marginTop: 15}}>
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
        <View>
          <FlatList
            horizontal={false}
            showsVerticalScrollIndicator={false}
            numColumns={1}
            keyExtractor={(item) => item._id}
            style={{marginTop: 30}}
            data={this.props.data.shops}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('ProductDetail', {shop: item});
                }}
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 20,
                  marginBottom: 30,
                }}>
                <View style={{width: '25%'}}>
                  <FitImage
                    style={{
                      width: 80,
                      height: 80,
                      resizeMode: 'contain',
                      borderRadius: 10,
                      marginLeft: 7,
                      overflow: 'hidden',
                    }}
                    source={{
                      uri:
                        APP_CONFIG.backend_url +
                        '/image/shop/' +
                        item.images[0],
                    }}
                  />
                </View>
                <View style={{width: '75%', marginLeft: 10}}>
                  <Text style={styles.title_text}>{item.shop_name}</Text>
                  <Text numberOfLines={1} style={styles.subtitle_text}>
                    {item.address}
                  </Text>
                  <View
                    style={{
                      position: 'absolute',
                      bottom: 3,
                      flexDirection: 'row',
                    }}>
                    <View style={{width: '33%', flexDirection: 'row'}}>
                      <Text style={styles.km_text}>
                        {getRelativeDistance(this.props.location, {
                          latitude: item.latitude,
                          longitude: item.longitude,
                        })}{' '}
                      </Text>
                      {/* <Text style={styles.mints_text}>2.8</Text> */}
                    </View>
                    <View style={{width: '30%', flexDirection: 'row'}}>
                      {/* <Text style={styles.mints_text}>{item.duration} </Text> */}
                      <Text style={styles.mints_text}>
                        {parseOpenTime(item.shop_timing)}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: '36%',
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <View
                        style={
                          item.delivery_available === true
                            ? styles.Delivery
                            : styles.not_Delivery
                        }
                      />
                      <Text style={styles.veg_text}>
                        {item.delivery_available === true ? 'Delivery' : null}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
          <FlatList
            horizontal={false}
            showsVerticalScrollIndicator={false}
            numColumns={1}
            keyExtractor={(item) => item._id}
            data={this.props.data.products}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('ProductPage', {id: item._id})
                }
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 20,
                  marginBottom: 30,
                }}>
                <View style={{width: '25%'}}>
                  <FitImage
                    style={{
                      width: 80,
                      height: 80,
                      resizeMode: 'contain',
                      borderRadius: 10,
                      marginLeft: 7,
                      overflow: 'hidden',
                    }}
                    source={{
                      uri:
                        APP_CONFIG.backend_url +
                        '/image/products/' +
                        item.images[0],
                    }}
                  />
                </View>
                <View style={{marginLeft: 10, flex: 1}}>
                  <Text style={styles.title_text}>{item.product_name}</Text>
                  <Text numberOfLines={1} style={styles.subtitle_text}>
                    {item.product_description}
                  </Text>
                  <Text>{' €' + item.selling_price}</Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View
                    style={
                      item.product_available_status
                        ? styles.Delivery
                        : styles.not_Delivery
                    }
                  />
                  <Text style={styles.veg_text}>
                    {item.product_available_status
                      ? 'Available'
                      : 'Not Available'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // getProductDetails: (id) => dispatch(getProductDetails(id)),
    // addToCart: (product) => dispatch(add_product(product)),
    fetchFavs: (id) => dispatch(fetchFavs(id)),
  };
};
const mapStateToProps = (state) => {
  return {
    data: state.fav.remoteData,
    loading: state.fav.loading,
    favlist: state.fav.list,
    location: mapLocation(state.location.location),
    token: state.user.token,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Favorite);

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS == 'ios' ? 35 : 40,
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
});
