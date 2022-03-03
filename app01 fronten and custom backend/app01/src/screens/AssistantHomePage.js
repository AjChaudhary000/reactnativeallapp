import React, { Component } from 'react';
import {
	Text,
	Image,
	StatusBar,
	TouchableOpacity,
	StyleSheet,
	View,
	TextInput,
	Platform,
	AsyncStorage,
	ScrollView,
} from 'react-native';
import design from './StyleFile';
import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-picker';
let rootRef;
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
let base_64_image = '';
let fake_user_id = '';
import FitImage from 'react-native-fit-image';
import { StackActions, NavigationActions } from 'react-navigation';
import global from './Global';
var shop_id = '';
export default class AssistantHomePage extends Component {
	constructor() {
		super();
		rootRef = firebase.database().ref();
		this.state = {
			spinner: false,
		};
	}
	componentDidMount = () => {
		this.displayData();
	};
	displayData = async () => {
		try {
			fake_user_id = await AsyncStorage.getItem('fake_user_id');

			this.setState({ spinner: true });
			rootRef.child('/users/' + fake_user_id).on('value', snapshot => {
				if (snapshot.exists()) {
					shop_id = snapshot.val().shop_id;
				}
			});
			this.setState({ spinner: false });
		} catch (error) {
			alert(error);
		}
	};
	logout = () => {
		AsyncStorage.clear();
		global.login = 'false';
		const resetAction = StackActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: 'HomeScreen' })],
		});
		this.props.navigation.dispatch(resetAction);
	};
	myshop = () => {
		this.props.navigation.navigate('Shop_Detail', { shop_id: shop_id });
	};
	order_list = () => {
		this.props.navigation.navigate('ShopOrderList', { shop_id: shop_id });
	};
	my_account = () => {
		this.props.navigation.navigate('Myaccount',{'user_id':fake_user_id});
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
				<StatusBar translucent backgroundColor="white" barStyle="dark-content" />
				<View style={{ flexDirection: 'row', marginTop: 15 }}>
					<View style={{ width: '15%' }} />
					<View style={{ width: '70%' }}>
						<Image
							style={{
								width: 100,
								height: 30,
								resizeMode: 'contain',
								marginLeft: 5,
								alignSelf: 'center',
							}}
							source={require('./images/app1.png')}
						/>
					</View>
					<TouchableOpacity style={{ width: '15%' }} onPress={() => this.logout()}>
						<Image
							style={{
								width: 30,
								height: 30,
								resizeMode: 'contain',
								alignSelf: 'center',
							}}
							source={require('./images/assi_logout.png')}
						/>
					</TouchableOpacity>
				</View>

				<ScrollView>
					<TouchableOpacity style={{ marginTop: 40 }} onPress={() => this.myshop()}>
						<Image
							style={{
								width: 100,
								height: 100,
								resizeMode: 'contain',
								alignSelf: 'center',
							}}
							source={require('./images/assi_shop.png')}
						/>
						<Text style={styles.header_text}>My Shop</Text>
					</TouchableOpacity>

					<TouchableOpacity style={{ marginTop: 40 }} onPress={() => this.order_list()}>
						<Image
							style={{
								width: 100,
								height: 100,
								resizeMode: 'contain',
								alignSelf: 'center',
							}}
							source={require('./images/assi_order.png')}
						/>
						<Text style={styles.header_text}>Order List</Text>
					</TouchableOpacity>

					<TouchableOpacity style={{ marginTop: 40 }} onPress={() => this.my_account()}>
						<Image
							style={{
								width: 100,
								height: 100,
								resizeMode: 'contain',
								alignSelf: 'center',
							}}
							source={require('./images/assi_edit.png')}
						/>
						<Text style={styles.header_text}>Edit Profile</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>
		);
	}
}
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

	header_text: {
		color: design.theme_color_parent,
		fontSize: 18,
		marginTop: 5,
		textAlign: 'center',
	},
});
