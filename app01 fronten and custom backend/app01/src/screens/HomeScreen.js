import React from 'react';
import {Text, Image, View, Dimensions, StatusBar} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  BottomTabBar,
} from 'react-navigation-tabs';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import Tab_Nearby from './Tab_Nearby';
import Tab_message from './Tab_Messages';
import Tab_scan from './Tab_Scan';
import Tab_cart from './Tab_Cart';
import Tab_profile from './Tab_Setting';
import CustomTabBar from './CustomTabBar';
import SearchResult from './SearchResult';
import ResturentDetail from './ResturentDetail';
import Shop from './Shop';
import Add_products from './Add_products';
import ProductDetail from './ProductDetail';
import ProductPage from './ProductPage';
import Myaccount from './Myaccount';
import MessageScreen from './MessageScreen';
import Tab_Messages from './Tab_Messages';
import Myorder from './Myorder';
import OrderDetail from './OrderDetail';
import ShopOrderList from './ShopOrderList';
import ShopCompleteOrderList from './ShopCompleteOrderList';
import Add_Shop from './Add_Shop';
import Edit_Shop from './Edit_Shop';
import Favorite from './Favorite';
import Checkout from './Checkout';
import OnBoarding from './OnBoarding';
import Cards from './Cards';
import ListAssistant from './ListAssistant';
import Add_Assistant from './Add_Assistant';
import ShopMessages from './ShopMessages';
import ShopMessageScreen from './ShopMessageScreen';
const Home = createStackNavigator(
  {
    Tab_Nearby: {
      screen: Tab_Nearby,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
      }),
    },
    SearchResult: {
      screen: SearchResult,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
      }),
    },
    ResturentDetail: {
      screen: ResturentDetail,
      navigationOptions: ({navigation}) => ({
        headerShown: false,
      }),
    },
  },
  // {initialRouteName: 'ProductPage'},
);
const Message = createStackNavigator({
  Tab_message: {
    screen: Tab_Messages,
    navigationOptions: ({navigation}) => ({
      headerShown: false,
    }),
  },
});
const Scan = createStackNavigator({
  Tab_scan: {
    screen: Tab_scan,
    navigationOptions: {
      headerShown: false,
    },
  },
});
const Cart = createStackNavigator({
  Tab_cart: {
    screen: Tab_cart,
    navigationOptions: {
      headerShown: false,
    },
  },
  Checkout: {
    screen: Checkout,
    navigationOptions: {
      headerShown: false,
    },
  },
});
const Profile = createStackNavigator(
  {
    Tab_profile: {
      screen: Tab_profile,
      navigationOptions: {
        headerShown: false,
      },
    },

    OnBoarding: {
      screen: OnBoarding,
      navigationOptions: {
        headerShown: false,
      },
    },

    Cards: {
      screen: Cards,
      navigationOptions: {
        headerShown: false,
      },
    },
    Add_Assistant: {
      screen: Add_Assistant,
      navigationOptions: {
        headerShown: false,
      },
    },
    ListAssistant: {
      screen: ListAssistant,
      navigationOptions: {
        headerShown: false,
      },
    },
    ShopMessages: {
      screen: ShopMessages,
      navigationOptions: {
        headerShown: false,
      },
    },
    ShopMessageScreen: {
      screen: ShopMessageScreen,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {initialRouteName: 'Tab_profile'},
);
const bottomTabNavigator = createMaterialTopTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: ({navigation}) => ({}),
    },
    Message: {
      screen: Message,
      navigationOptions: ({navigation}) => ({}),
    },
    Scan: {
      screen: Scan,
      navigationOptions: {},
    },
    Cart: {
      screen: Cart,
      navigationOptions: {},
    },
    Profile: {
      screen: Profile,
      navigationOptions: {},
    },
  },
  {
    lazy: true,
    tabBarComponent: ({navigation, focused}) => (
      <CustomTabBar navigation={navigation} focused={focused} />
    ),
    initialRouteName: 'Home',
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    tabBarOptions: {},
  },
);
export default createAppContainer(bottomTabNavigator);
