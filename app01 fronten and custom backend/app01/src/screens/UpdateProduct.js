import React, { Component } from 'react';
import {
	Text,
	Image,
	StatusBar,
	TouchableOpacity,
	StyleSheet,
	View,
	Switch,
	FlatList,
	Platform,
	TextInput,
} from 'react-native';
import design from './StyleFile';
import Dialog, {
	DialogTitle,
	DialogContent,
	DialogFooter,
	DialogButton,
	SlideAnimation,
	ScaleAnimation,
} from 'react-native-popup-dialog';
let selected_cat_name = '';
import FitImage from 'react-native-fit-image';
import ImagePicker from 'react-native-image-picker';
let shop_id = '',
	category_id = '',
	base_64_image = '';
let rootRef;
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
import Toast from 'react-native-simple-toast';
import { floor } from 'react-native-reanimated';
var product_id = '';
let image_arr = [];

export default class UpdateProduct extends Component {
	constructor(props) {
		super(props);
		rootRef = firebase.database().ref();
		(this.categoryies = []), (this.state = {
			product_name: '',
			product_description: '',
			product_price: '',
			product_discount: '',
			product_image:
							'https://firebasestorage.googleapis.com/v0/b/app01-9a39b.appspot.com/o/add_shop.png?alt=media&token=13586f5f-900b-4143-8fbc-e0c890066302',
			test: true,
			selected_product_avalable_status: false,
			seleted_product_id: '',
			selling_price: '',
			shop_images:[],
		});
	}
	backpress = () => {
		this.props.navigation.goBack();
	};
	componentDidMount = () => {
		image_arr = [];
		this.setState({ shop_images: [] });
		this.setState({ spinner: true });
		rootRef.child('/products/' + product_id).on('value', snapshot => {
			if (snapshot.exists()) {
				image_arr = snapshot.val().images;
				

				if(snapshot.val().product_discount=='')
				{
					this.setState({selling_price:''})
				}
				else
				{
					var cal_1=parseInt(snapshot.val().product_price);
					var cal_2=parseInt(snapshot.val().product_discount);
					var result = cal_1 - cal_2;
					this.setState({selling_price:result})
				}
				this.setState({
					shop_images: image_arr,
					product_name: snapshot.val().product_name,
					product_description: snapshot.val().product_description,
					product_price: snapshot.val().product_price,
					
			
				});
				console.log('selling price : ' + result);
				this.setState({ spinner: false });
			} else {
				this.setState({ spinner: false });
			}
		});
	};

	chooseFile = () => {
		if (this.state.shop_images.length > 5) {
			Toast.show('Add Maximum 6 Images');
		} else {
			var options = {
				title: 'Select Image',
				mediaType: 'image',
				multiple: true,
				storageOptions: {
					skipBackup: true,
					path: 'images',
				},
			};
			ImagePicker.showImagePicker(options, response => {
				if (response.didCancel) {
				} else if (response.error) {
				} else if (response.customButton) {
					alert(response.customButton);
				} else {
					let source = response;
	
					this.setState({
						filePath: source,
					});
	
					base_64_image = 'data:image/jpeg;base64,' + [response.data];
					this.uploadimage_to_server();
				}
			});
		}
		
	};

	uploadimage_to_server = () => {
		this.setState({ spinner: true });
		var data = new FormData();
		data.append('image', base_64_image);
		this.setState({ isLoading: true });
		// fetch('https://myfanspot.com/imageurl/', {
			fetch('https://digittrix.com/staging/soldat/imageurl/', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'multipart/form-data',
			},
			body: data,
		})
			.then(response => response.json())
			.then(responseJson => {
				this.setState({ spinner: false });
				if (responseJson.status === 'success') {
					image_arr.push(responseJson.image);
					this.setState({ shop_images: image_arr });
				} else {
					Toast.show('something_went_wrong_please_try_after_some_time');
				}
			})
			.catch(error => {
				Toast.show('error : ' + error);
				console.error(error);
				this.setState({ spinner: false });
			});
	};
	add_product_button = () => {
		if (this.state.shop_images.length == 0) {
			Toast.show('Add Product Shop Images');
		} else if (this.state.product_name == '') {
			Toast.show('Add Product Name');
		} else if (this.state.product_description == '') {
			Toast.show('Add Product Description');
		} else if (this.state.product_price == '') {
			Toast.show('Add Product Price');
		} else {
			
			var dis = '';
			if(this.state.selling_price=='')
			{
				dis = '';
			}
			else if (this.state.product_price == this.state.selling_price) {
				dis = '';
			} 
			else {
				var cal = parseInt(this.state.product_price) - parseInt(this.state.selling_price);
				dis = JSON.stringify(cal);
			}

			var adaNameRef = firebase.database().ref('products/' + product_id);
			adaNameRef.update({
				product_name: this.state.product_name,
				product_description: this.state.product_description,
				product_price: this.state.product_price,
				product_discount: dis,
				images:this.state.shop_images,
			});
			this.props.navigation.goBack();
		}
	};
	delete_shop_image = index => {
		var array = image_arr;
		array.splice(index, 1);
		this.setState({ shop_images: array });
	};
	render() {
		const { navigation } = this.props;
		product_id = navigation.getParam('id', 'null');
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
				<View style={{ flexDirection: 'row' }}>
					<View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 15, width: '80%' }}>
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
							style={{ width: 100, height: 30, resizeMode: 'contain', marginLeft: 5 }}
							source={require('./images/app1.png')}
						/>
					</View>
				</View>

				<View>
				<TouchableOpacity onPress={this.chooseFile.bind(this)}>
								<FitImage
									style={{
										alignSelf: 'center',
										width: 80,
										height: 80,
										borderRadius: 10,
										resizeMode: 'contain',
										marginVertical: 20,
										borderRadius: 10,
										overflow: 'hidden',
									}}
									source={{ uri: this.state.product_image }}
								/>
							</TouchableOpacity>
							<FlatList
							data={this.state.shop_images}
							numColumns={3}
							style={{ marginLeft: 50 }}
							renderItem={({ item, index }) =>
								<View style={{ flexDirection: 'row', width: '28%', marginTop: 10 }}>
									<FitImage
										style={{
											width: 80,
											height: 80,
											resizeMode: 'contain',
											borderRadius: 10,
											overflow: 'hidden',
										}}
										source={{ uri: item }}
									/>
									<TouchableOpacity
										style={{
											position: 'absolute',
											bottom: 5,
										}}
									>
										<View
											style={{
												width: 25,
												height: 25,
												backgroundColor: 'red',
												borderRadius: 12,
												overflow: 'hidden',
												marginLeft: 50,
											}}
										/>
									</TouchableOpacity>

									<TouchableOpacity
										style={{
											position: 'absolute',
											top: 5,
											right: 10,
										}}
										onPress={() => this.delete_shop_image(index)}
									>
										<Image
											source={require('./images/cancel.png')}
											style={{
												width: 30,
												height: 30,
												alignSelf: 'center',
												resizeMode: 'contain',
												tintColor: '#fff',
											}}
										/>
									</TouchableOpacity>
								</View>}
							keyExtractor={(item, index) => `draggable-item-${item.key}`}
							onDragEnd={({ data }) => this.setState({ categoryHolder: data })}
						/>

					<TextInput
						style={styles.input}
						autoCapitalize="none"
						placeholder={'Product Name'}
						returnKeyLabel={'next'}
						value={this.state.product_name}
						onChangeText={text => this.setState({ product_name: text })}
					/>

					<TextInput
						style={styles.input}
						autoCapitalize="none"
						placeholder={'Product Description'}
						returnKeyLabel={'next'}
						multiline={true}
						value={this.state.product_description}
						onChangeText={text => this.setState({ product_description: text })}
					/>

					<TextInput
						style={styles.input}
						autoCapitalize="none"
						placeholder={'Product Price'}
						returnKeyLabel={'next'}
						value={this.state.product_price}
						onChangeText={text => this.setState({ product_price: text })}
					/>

					<TextInput
						style={styles.input}
						autoCapitalize="none"
						placeholder={'Selling Price'}
						returnKeyLabel={'next'}
						value={this.state.selling_price}
						onChangeText={text => this.setState({ selling_price: text })}
					/>

					<TouchableOpacity
						onPress={() => this.add_product_button()}
						style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}
					>
						<Text style={styles.pay_text}>Update</Text>
					</TouchableOpacity>
				</View>
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
	add_card_text: {
		fontSize: 20,
		color: '#000000',
		marginLeft: 10,
	},
	add_card_text_2: {
		fontSize: 20,
		color: '#000000',
		marginLeft: 10,
		textAlign: 'center',
		marginVertical: 15,
	},
	cardno_text: {
		fontSize: 20,
		color: '#000000',
		marginLeft: 10,
	},
	input: {
		borderBottomWidth: 1,
		borderBottomColor: 'gray',
		marginTop: Platform.OS === 'ios' ? 20 : 0,
		paddingBottom: Platform.OS === 'ios' ? 5 : 0,
		marginHorizontal: 40,
		fontSize: 18,
		marginTop: 30,
	},
	input_2: {
		flex: 1,
		borderBottomWidth: 1,
		borderBottomColor: 'gray',
		marginTop: Platform.OS === 'ios' ? 20 : 0,
		paddingBottom: Platform.OS === 'ios' ? 5 : 0,
		marginHorizontal: 40,
		fontSize: 18,
		marginTop: 30,
	},
	fields_text: {
		fontSize: 16,
		color: '#000000',
	},
	fields_text_2: {
		fontSize: 16,
		color: '#000000',
		marginTop: 8,
	},
	done_text: {
		fontSize: 20,
		color: '#000000',
		alignSelf: 'center',
		marginTop: 10,
		color: '#af0808',
	},
	pay_text: {
		fontSize: 20,
		color: '#fff',
		backgroundColor: design.theme_color_parent,
		paddingHorizontal: 80,
		paddingVertical: 10,
		borderRadius: 12,
		overflow: 'hidden',
	},
	dialog_confirmation: {
		fontSize: 20,
		color: '#000000',
		marginLeft: 10,
		textAlign: 'center',
		marginVertical: 15,
	},
	dialog_input: {
		paddingBottom: Platform.OS === 'ios' ? 5 : 0,
		textAlign: 'center',
		fontSize: 18,
		marginTop: 15,
	},
	product_in_stock_input: {
		paddingBottom: Platform.OS === 'ios' ? 5 : 0,
		textAlign: 'center',
		fontSize: 18,
		marginLeft: 15,
	},
	option_text: {
		fontSize: 18,
		color: '#000000',
		marginTop: 15,
	},
});
