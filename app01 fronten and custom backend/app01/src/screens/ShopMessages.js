/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  Text,
  Image,
  StatusBar,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  AsyncStorage,
  Platform,
} from 'react-native';
console.disableYellowBox = true;
import {ScrollView} from 'react-native-gesture-handler';
import design from './StyleFile';
let rootRef;
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
import global from './Global';
import FitImage from 'react-native-fit-image';
import {connect} from 'react-redux';
import {getChats, getShopChats, set_selected} from '../redux/chatSlice';
import {APP_CONFIG} from '../../config';
import {formatDate} from '../utils';
import Header from './Header';

class ShopMessages extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    let shop_id = this.props.navigation.getParam('shop_id');
    this.props.getChats(shop_id);
  }
  nextscreen = (id) => {
    let shop_id = this.props.navigation.getParam('shop_id');
    this.props.navigation.navigate('ShopMessageScreen', {
      shop_id: shop_id,
      user_id: id,
    });
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
        <Header navigation={this.props.navigation} />
        {this.props.chats.length === 0 && (
          <Text style={{color: 'grey', fontSize: 25, textAlign: 'center'}}>
            No messages to display
          </Text>
        )}
        <FlatList
          horizontal={false}
          numColumns={1}
          style={{marginTop: 20}}
          showsVerticalScrollIndicator={false}
          data={this.props.chats}
          keyExtractor={(item) => item._id}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => this.nextscreen(item.user._id)}
              style={{flexDirection: 'column', paddingHorizontal: 15}}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 20,
                }}>
                <View style={{width: '20%'}}>
                  <FitImage
                    style={styles.user_image}
                    source={
                      item.user.avatar
                        ? {
                            uri:
                              APP_CONFIG.backend_url +
                              '/image/avatar/' +
                              item.user.avatar,
                          }
                        : require('./images/avatar.png')
                    }
                  />
                </View>
                <View
                  style={{
                    width: '55%',
                    flexDirection: 'column',
                    paddingLeft: 10,
                  }}>
                  <Text style={styles.name_text}>
                    {item.user.first_name + ' ' + item.user.last_name}
                  </Text>
                  <Text numberOfLines={1} style={styles.online_text}>
                    {item.messages[item.messages.length - 1].message}
                  </Text>
                </View>
                <View style={{width: '25%', marginTop: 10}}>
                  <Text style={styles.time_text}>
                    {formatDate(
                      item.messages[item.messages.length - 1].created,
                    )}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getChats: (shop_id) => dispatch(getShopChats(shop_id)),
    setChatIndex: (index) => dispatch(set_selected(index)),
  };
};
const mapStateToProps = (state) => {
  return {
    chats: state.chat.shop_list,
    loading: state.chat.loading,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ShopMessages);
const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS == 'ios' ? 30 : 30,
  },
  lottie: {
    width: 180,
    height: 180,
  },
  back_image: {
    resizeMode: 'contain',
    height: '100%',
    width: '100%',
  },
  setting_text: {
    fontSize: 20,
    textAlign: 'center',
    color: design.theme_color,
    marginTop: Platform.OS == 'ios' ? 20 : 40,
  },
  user_image: {
    resizeMode: 'contain',
    height: 60,
    width: 60,
    borderRadius: 30,
    alignSelf: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#dcdcdc',
  },
  name_text: {
    fontSize: 21,
    color: '#000000',
  },
  online_text: {
    fontSize: 14,
    color: '#000000',
  },
  time_text: {
    fontSize: 10,
    color: design.theme_color,
    marginTop: 5,
  },
  count_text: {
    fontSize: 16,
    color: design.white,
    backgroundColor: design.theme_color_parent,
    width: 25,
    height: 25,
    borderRadius: 12,
    overflow: 'hidden',
    marginLeft: 25,
    paddingTop: 0,
    textAlign: 'center',
  },
});
