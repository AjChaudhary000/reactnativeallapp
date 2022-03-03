import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {FluidNavigator, Transition} from 'react-navigation-fluid-transitions';
import Splash from './src/screens/Splash';
import HomeScreen from './src/screens/HomeScreen';
import MainScreen from './src/screens/MainScreen';
import MessageScreen from './src/screens/MessageScreen';
import ResturentDetail from './src/screens/ResturentDetail';
import SearchResult from './src/screens/SearchResult';
import ProductDetail from './src/screens/ProductDetail';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import Myaccount from './src/screens/Myaccount';
import Favorite from './src/screens/Favorite';
import Myorder from './src/screens/Myorder';
import Legal from './src/screens/Legal';
import ProductPage from './src/screens/ProductPage';
import Change_password from './src/screens/Change_password';
import App01 from './src/screens/App01';
import Shop from './src/screens/Shop';
import Add_Shop from './src/screens/Add_Shop';
import Shop_Detail from './src/screens/Shop_Detail';
import Shop_Assistant from './src/screens/Shop_Assistant';
import ScanScreen from './src/screens/ScanScreen';
import OrderDetail from './src/screens/OrderDetail';
import Edit_Shop from './src/screens/Edit_Shop';
import Shop_QR from './src/screens/Shop_QR';
import Add_products from './src/screens/Add_products';
import POS from './src/screens/POS';
import ProductList from './src/screens/ProductList';
import ShopOrderList from './src/screens/ShopOrderList';
import ShopOrderDetail from './src/screens/ShopOrderDetail';
import ShopCompleteOrderList from './src/screens/ShopCompleteOrderList';
import Tab_Cart from './src/screens/Tab_Cart';
import MapLocation from './src/screens/MapLocation';
import UpdateProduct from './src/screens/UpdateProduct';
import AssistantHomePage from './src/screens/AssistantHomePage';
import SignUp from './src/screens/Signup';
import SignIn from './src/screens/SignIn';
import Otp from './src/screens/Otp';
import AssistantHome from './src/screens/AssistantHome';
const Project = createStackNavigator({
  // const Project = FluidNavigator({
  Splash: {
    screen: Splash,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  HomeScreen: {
    screen: HomeScreen,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  MainScreen: {
    screen: MainScreen,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  MessageScreen: {
    screen: MessageScreen,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  ResturentDetail: {
    screen: ResturentDetail,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  ProductPage: {
    screen: ProductPage,
    navigationOptions: ({navigation}) => ({
      headerShown: false,
    }),
  },
  SearchResult: {
    screen: SearchResult,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  ProductDetail: {
    screen: ProductDetail,
    navigationOptions: ({navigation}) => ({
      headerShown: false,
    }),
  },

  Login: {
    screen: Login,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  Signup: {
    screen: Signup,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  Myaccount: {
    screen: Myaccount,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  Favorite: {
    screen: Favorite,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  Myorder: {
    screen: Myorder,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  Legal: {
    screen: Legal,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  ProductPage: {
    screen: ProductPage,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  Change_password: {
    screen: Change_password,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  App01: {
    screen: App01,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  Shop: {
    screen: Shop,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  Add_Shop: {
    screen: Add_Shop,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  Shop_Detail: {
    screen: Shop_Detail,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  Shop_Assistant: {
    screen: Shop_Assistant,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  ScanScreen: {
    screen: ScanScreen,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  OrderDetail: {
    screen: OrderDetail,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  Edit_Shop: {
    screen: Edit_Shop,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  Shop_QR: {
    screen: Shop_QR,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  Add_products: {
    screen: Add_products,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  POS: {
    screen: POS,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  ProductList: {
    screen: ProductList,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  ShopOrderList: {
    screen: ShopOrderList,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  ShopOrderDetail: {
    screen: ShopOrderDetail,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  ShopCompleteOrderList: {
    screen: ShopCompleteOrderList,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  Tab_Cart: {
    screen: Tab_Cart,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  MapLocation: {
    screen: MapLocation,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  UpdateProduct: {
    screen: UpdateProduct,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  AssistantHome: {
    screen: AssistantHome,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  SignIn: {
    screen: SignIn,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
  Otp: {
    screen: Otp,
    navigationOptions: {
      headerShown: false, // this will do your task
    },
  },
});
export default createAppContainer(Project);
