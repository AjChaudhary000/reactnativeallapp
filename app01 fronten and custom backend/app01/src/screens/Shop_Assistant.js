import React, { Component } from 'react';
import {
	Text,
	Image,
	StatusBar,
	TouchableOpacity,
	StyleSheet,
	View,
	FlatList,
	Platform,
	TextInput,
	Switch,
	AsyncStorage,
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
import FitImage from 'react-native-fit-image';
let shop_id = '';
let rootRef;
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-picker';
let image = '';
let arr_assistant = [];
var image_send = '';
let user_id = '';
export default class Shop_Assistant extends Component {
	constructor(props) {
		super(props);
		rootRef = firebase.database().ref();
		(this.categoryies = []), (this.state = {
			Add_shop_assistant_dialog: false,
			switch_button: false,
			categoryHolder: [
				{
					image: require('./images/icon1.png'),
					name: 'Smith Johan',
					phone: '4568564848',
					password: '123456',
					status: true,
				},
				{
					image: require('./images/icon1.png'),
					name: 'Johanson',
					phone: '4584784658',
					password: '123456',
					status: false,
				},
			],
			assistant_list: [],
			assistant_name: '',
			assistant_email: '',
			assistant_phone_number: '',
			assistant_password: '',
			assitant_image:
				'https://firebasestorage.googleapis.com/v0/b/app01-9a39b.appspot.com/o/user-dummy.png?alt=media&token=478518e2-fb49-465d-9619-616800a47e41',
			select_assitant_id: '',
			select_assitant_status: '',
			select_assitant_image: '',
			select_assitant_name: '',
			select_assitant_email: '',
			select_assitant_telephone: '',
			select_assitant_password: '',
		});
	}
	componentDidMount = () => {
		this.displayData();

		arr_assistant = [];
		this.setState({ assistant_list: arr_assistant });
		this.setState({ spinner: true });
		rootRef.child('/users/').orderByChild('login_type').equalTo('Assistant').on('value', snapshot => {
			let i = 0;
			arr_assistant = [];

			this.setState({ assistant_list: arr_assistant });
			if (snapshot.exists()) {
				console.log('TESTING');
				snapshot.forEach(childSnapshot => {
					var key = childSnapshot.key;
					var childData = childSnapshot.val();
					if (childData.shop_id == shop_id) {
						var object = {
							assistant_id: key,
							assistant_image: childData.image,
							assistant_name: childData.first_name,
							assistant_phone: childData.mobile,
							password: childData.password,
							status: childData.status,
						};
						i++;
						arr_assistant.push(object);
					}
				});
				this.update_shop(arr_assistant);
			} else {
				this.setState({ spinner: false });
				console.log('TESTING');
			}
		});
	};
	displayData = async () => {
		try {
			user_id = await AsyncStorage.getItem('user_id');
		} catch (error) {
			alert(error);
			this.setState({ spinner: false });
		}
	};
	update_shop = object => {
		var self = this;
		setTimeout(() => {
			this.setState({ spinner: false });
			self.setState({ assistant_list: object });
		}, 1000);
	};
	switch_button = (value, id) => {
		var adaNameRef = firebase.database().ref('shop_assistant/' + shop_id + '/' + id);
		adaNameRef.update({ status: value });
		this.setState({ product_action_dialog: false });
	};
	backpress = () => {
		this.props.navigation.goBack();
	};
	add_shop = () => {
		this.setState({ Add_shop_assistant_dialog: true });
	};
	chooseFile = () => {
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
	};

	uploadimage_to_server = () => {
		this.setState({ spinner: true });
		var data = new FormData();
		data.append('image', base_64_image);
		this.setState({ isLoading: true });
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
					image = responseJson.image;
					this.setState({ assitant_image: responseJson.image });
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
	add_assistant = () => {
		let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if ((this.state.image = '')) {
			Toast.show('Add Assistant Image');
		} else if (this.state.assistant_name == '') {
			Toast.show('Add Assistant Name');
		} else if (this.state.assistant_email == '') {
			Toast.show('Add Assistant Email');
		} else if (reg.test(this.state.assistant_email) === false) {
			Toast.show('Email is not correct');
		} else if (this.state.assistant_phone_number == '') {
			Toast.show('Add Assistant Phone Number');
		} else if (this.state.assistant_password == '') {
			Toast.show('Add Password');
		} else {
			this.setState({ spinner: true });
			const { assistant_email, assistant_password } = this.state;
			firebase
				.auth()
				.createUserWithEmailAndPassword(assistant_email, assistant_password)
				.then(res => {
					rootRef
						.child('users/' + res.user.uid)
						.set({
							uid: res.user.uid,
							POS: '1',
							country: '',
							created: '',
							email: assistant_email,
							first_name: this.state.assistant_name,
							last_name: '',
							image: image,
							mobile: this.state.assistant_phone_number,
							password: assistant_password,
							status: '1',
							user_name: this.state.assistant_name,
							shop_owner_id: user_id,
							login_type: 'Assistant',
							shop_id: shop_id,
						})
						.then(data => {
							this.setState({ spinner: false });
							this.setState({ Add_shop_assistant_dialog: false });
						})
						.catch(error => {
							console.log('error');
							Toast.show(error);
							this.setState({ spinner: false });
						});
				})
				.catch(error => {
					console.log(error);
					this.setState({ spinner: false });
					Toast.show('The email address is already in use by another account.');
				});
			// this.setState({ spinner: true });
			// let postRef = firebase.database().ref('/shop_assistant/' + shop_id);
			// postRef
			// 	.push({
			// 		created: new Date().getTime(),
			// 		assistant_image: image,
			// 		assistant_name: this.state.assistant_name,
			// 		assistant_phone: this.state.assistant_phone_number,
			// 		password: this.state.assistant_password,
			// 		shop_id: shop_id,
			// 		status: true,
			// 	})
			// 	.then(res => {
			// 		console.log('done');
			// 		this.setState({ spinner: false });
			// 		this.setState({ Add_shop_assistant_dialog: false });
			// 		this.setState({
			// 			assitant_image:
			// 				'https://firebasestorage.googleapis.com/v0/b/app01-9a39b.appspot.com/o/user-dummy.png?alt=media&token=478518e2-fb49-465d-9619-616800a47e41',
			// 		});
			// 		image = '';
			// 	})
			// 	.catch(error => console.log(error));
		}
	};
	select_option = (id, status, image, name, telephone, password) => {
		this.setState({ select_assitant_id: id });
		this.setState({ select_assitant_status: status });
		this.setState({ product_action_dialog: true });
		this.setState({ select_assitant_image: image });
		this.setState({ select_assitant_name: name });
		this.setState({ select_assitant_telephone: telephone });
		this.setState({ select_assitant_password: password });
		image_send = image;
	};
	Delete_dialog = () => {
		// this.setState({ product_action_dialog: false });
		// this.setState({ confirmation_dialog: true });
	};
	ok_button_handle = () => {
		var adaRef = firebase.database().ref('shop_assistant/' + shop_id + '/' + this.state.select_assitant_id);
		adaRef.remove();
		this.setState({ confirmation_dialog: false });
	};
	Update_dialog = () => {
		this.setState({ product_action_dialog: false });
		this.setState({ Update_shop_assistant_dialog: true });
	};
	chooseFile_2 = () => {
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

				var base_64 = 'data:image/jpeg;base64,' + [response.data];
				this.uploadimage_to_server_2(base_64);
			}
		});
	};

	uploadimage_to_server_2 = image_base64 => {
		this.setState({ spinner: true });
		var data = new FormData();
		data.append('image', image_base64);
		this.setState({ isLoading: true });
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
					image = responseJson.image;
					this.setState({ select_assitant_image: responseJson.image });
					image_send = responseJson.image;
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
	update_assistant = () => {
		console.log('users/' + this.state.select_assitant_id)
		if ((this.state.select_assitant_image = '')) {
			Toast.show('Add Assistant Image');
		} else if (this.state.select_assitant_name == '') {
			Toast.show('Add Assistant Name');
		} else if (this.state.select_assitant_telephone == '') {
			Toast.show('Add Assistant Phone Number');
		} else if (this.state.select_assitant_password == '') {
			Toast.show('Add Password');
		} else {
			this.setState({ spinner: true });
			console.log('users/' + this.state.select_assitant_id)
			var adaNameRef = firebase.database().ref('users/' + this.state.select_assitant_id);
			adaNameRef.update({
				image: image_send,
				first_name: this.state.select_assitant_name,
				mobile: this.state.select_assitant_telephone,
				// password: this.state.select_assitant_password,
			});
			this.setState({ spinner: false });
			this.setState({ Update_shop_assistant_dialog: false });
		}
	};
	render() {
		const { navigation } = this.props;
		shop_id = navigation.getParam('shop_id', 'null');
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
				<View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 15 }}>
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

				<TouchableOpacity
					onPress={() => this.add_shop()}
					style={{ flexDirection: 'row', marginLeft: 30, marginTop: 25 }}
				>
					<Image
						style={{ width: 30, height: 30, resizeMode: 'contain' }}
						source={require('./images/add_new.png')}
					/>
					<Text style={styles.add_card_text}>Add Shop Assist</Text>
				</TouchableOpacity>

				<FlatList
					horizontal={false}
					showsVerticalScrollIndicator={false}
					numColumns={1}
					data={this.state.assistant_list}
					renderItem={({ item, index }) =>
						<View style={{ flexDirection: 'row', marginLeft: 30, marginTop: 35 }}>
							<View style={{ width: '20%' }}>
								<FitImage
									style={{
										width: 70,
										height: 70,
										resizeMode: 'contain',
										borderRadius: 35,
										overflow: 'hidden',
									}}
									source={{ uri: item.assistant_image }}
								/>
							</View>
							<View style={{ width: '60%', marginLeft: 20 }}>
								<Text style={styles.fields_text}>
									{item.assistant_name}
								</Text>
								<Text style={styles.fields_text_2}>
									{item.assistant_phone}
								</Text>
								<Text style={styles.fields_text_2}>
									{item.assistant_password}
								</Text>
							</View>
							<TouchableOpacity
								style={{ width: '20%' }}
								onPress={() =>
									this.select_option(
										item.assistant_id,
										item.status,
										item.assistant_image,
										item.assistant_name,
										item.assistant_phone,
										item.password
									)}
							>
								<Image
									style={{ width: 30, height: 30, resizeMode: 'contain' }}
									source={require('./images/dots.png')}
								/>
								{/* <Switch
                                    style={{}}
                                    value={item.status}
                                    onValueChange={(value) => this.switch_button(value, index,item.assistant_id)} /> */}
							</TouchableOpacity>
						</View>}
				/>

				<Dialog
					onTouchOutside={() => {
						this.setState({ Add_shop_assistant_dialog: false });
					}}
					width={0.9}
					visible={this.state.Add_shop_assistant_dialog}
					dialogAnimation={new ScaleAnimation()}
					onHardwareBackPress={() => {
						console.log('onHardwareBackPress');
						this.setState({ Add_shop_assistant_dialog: false });
						return true;
					}}
					actions={[
						<DialogButton
							text="DISMISS"
							onPress={() => {
								this.setState({ Add_shop_assistant_dialog: false });
							}}
							key="button-1"
						/>,
					]}
				>
					<DialogContent>
						<View>
							<Text style={styles.create_a_pin_text}>Shop Assistant</Text>
							<FitImage
								style={{
									overflow: 'hidden',
									width: 100,
									height: 100,
									resizeMode: 'contain',
									borderWidth: 1,
									borderColor: '#dcdcdc',
									alignSelf: 'center',
									marginTop: 20,
									borderRadius: 50,
								}}
								source={{ uri: this.state.assitant_image }}
							/>
							<TouchableOpacity onPress={this.chooseFile.bind(this)}>
								<Text style={styles.create_a_pin_text}>Upload Image</Text>
							</TouchableOpacity>

							<TextInput
								style={styles.input}
								autoCapitalize="none"
								placeholder={'Name'}
								returnKeyLabel={'next'}
								onChangeText={text => this.setState({ assistant_name: text })}
							/>

							<TextInput
								style={styles.input}
								autoCapitalize="none"
								placeholder={'Email'}
								returnKeyLabel={'next'}
								onChangeText={text => this.setState({ assistant_email: text })}
							/>

							<TextInput
								style={styles.input}
								autoCapitalize="none"
								placeholder={'Telephone Number'}
								returnKeyLabel={'next'}
								onChangeText={text => this.setState({ assistant_phone_number: text })}
							/>

							<TextInput
								style={styles.input}
								autoCapitalize="none"
								placeholder={'Password'}
								returnKeyLabel={'next'}
								onChangeText={text => this.setState({ assistant_password: text })}
							/>

							<TouchableOpacity
								onPress={() => this.add_assistant()}
								style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}
							>
								<Text style={styles.pay_text}>Save</Text>
							</TouchableOpacity>
						</View>
					</DialogContent>
				</Dialog>

				<Dialog
					onTouchOutside={() => {
						this.setState({ product_action_dialog: false });
					}}
					width={0.9}
					visible={this.state.product_action_dialog}
					dialogAnimation={new ScaleAnimation()}
					onHardwareBackPress={() => {
						console.log('onHardwareBackPress');
						this.setState({ product_action_dialog: false });
						return true;
					}}
					actions={[
						<DialogButton
							text="DISMISS"
							onPress={() => {
								this.setState({ product_action_dialog: false });
							}}
							key="button-1"
						/>,
					]}
				>
					<DialogContent>
						<View>
							<TouchableOpacity onPress={() => this.Delete_dialog()}>
								<Text style={styles.dialog_input}>Delete Assistant</Text>
							</TouchableOpacity>

							<TouchableOpacity onPress={() => this.Update_dialog()}>
								<Text style={styles.dialog_input}>Update Assistant</Text>
							</TouchableOpacity>

							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									marginTop: 15,
								}}
							>
								<Switch
									style={{}}
									value={this.state.select_assitant_status}
									onValueChange={value => this.switch_button(value, this.state.select_assitant_id)}
								/>
								<Text style={styles.product_in_stock_input}>Active</Text>
							</View>
						</View>
					</DialogContent>
				</Dialog>

				<Dialog
					onTouchOutside={() => {
						this.setState({ confirmation_dialog: false });
					}}
					width={0.9}
					visible={this.state.confirmation_dialog}
					dialogAnimation={new ScaleAnimation()}
					onHardwareBackPress={() => {
						console.log('onHardwareBackPress');
						this.setState({ confirmation_dialog: false });
						return true;
					}}
					actions={[
						<DialogButton
							text="DISMISS"
							onPress={() => {
								this.setState({ confirmation_dialog: false });
							}}
							key="button-1"
						/>,
					]}
				>
					<DialogContent>
						<View>
							<Text style={[styles.option_text, { textAlign: 'center' }]}>
								Are you want to sure to delete this assistant ?
							</Text>
							<TouchableOpacity
								onPress={() => this.ok_button_handle()}
								style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}
							>
								<Text style={styles.pay_text}>Ok</Text>
							</TouchableOpacity>
						</View>
					</DialogContent>
				</Dialog>

				<Dialog
					onTouchOutside={() => {
						this.setState({ Update_shop_assistant_dialog: false });
					}}
					width={0.9}
					visible={this.state.Update_shop_assistant_dialog}
					dialogAnimation={new ScaleAnimation()}
					onHardwareBackPress={() => {
						console.log('onHardwareBackPress');
						this.setState({ Update_shop_assistant_dialog: false });
						return true;
					}}
					actions={[
						<DialogButton
							text="DISMISS"
							onPress={() => {
								this.setState({ Update_shop_assistant_dialog: false });
							}}
							key="button-1"
						/>,
					]}
				>
					<DialogContent>
						<View>
							<Text style={styles.create_a_pin_text}>Update Shop Assistant</Text>
							<FitImage
								style={{
									overflow: 'hidden',
									width: 100,
									height: 100,
									resizeMode: 'contain',
									borderWidth: 1,
									borderColor: '#dcdcdc',
									alignSelf: 'center',
									marginTop: 20,
									borderRadius: 50,
								}}
								source={{ uri: this.state.select_assitant_image }}
							/>
							<TouchableOpacity onPress={this.chooseFile_2.bind(this)}>
								<Text style={styles.create_a_pin_text}>Update Image</Text>
							</TouchableOpacity>

							<TextInput
								style={[styles.input, { marginTop: 10 }]}
								autoCapitalize="none"
								placeholder={'Name'}
								returnKeyLabel={'next'}
								value={this.state.select_assitant_name}
								onChangeText={text => this.setState({ select_assitant_name: text })}
							/>

							<TextInput
								style={styles.input}
								autoCapitalize="none"
								placeholder={'Telephone Number'}
								returnKeyLabel={'next'}
								value={this.state.select_assitant_telephone}
								onChangeText={text => this.setState({ select_assitant_telephone: text })}
							/>

							{/* <TextInput
								style={styles.input}
								autoCapitalize="none"
								placeholder={'Password'}
								returnKeyLabel={'next'}
								value={this.state.select_assitant_password}
								onChangeText={text => this.setState({ select_assitant_password: text })}
							/> */}

							<TouchableOpacity
								onPress={() => this.update_assistant()}
								style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}
							>
								<Text style={styles.pay_text}>Update</Text>
							</TouchableOpacity>
						</View>
					</DialogContent>
				</Dialog>
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
		alignSelf: 'center',
	},
	resturent_text: {
		fontSize: 16,
		color: '#000000',
		marginTop: 7,
		marginLeft: 10,
	},
	create_a_pin_text: {
		fontSize: 18,
		color: '#000000',
		textAlign: 'center',
		fontFamily: 'HiraMaruPro-W4',
		marginTop: 10,
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
	pay_text: {
		fontSize: 20,
		color: '#fff',
		backgroundColor: design.theme_color_parent,
		paddingHorizontal: 80,
		paddingVertical: 10,
		borderRadius: 22,
		overflow: 'hidden',
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
