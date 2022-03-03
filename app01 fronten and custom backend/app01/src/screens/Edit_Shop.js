import React, {Component} from 'react';
import {
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  View,
  Switch,
  Platform,
  TextInput,
  ScrollView,
  FlatList,
  AsyncStorage,
} from 'react-native';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
} from 'react-native-popup-dialog';
import design from './StyleFile';
import {Dropdown} from 'react-native-material-dropdown-v2';
import DraggableFlatList from 'react-native-draggable-flatlist';
import FitImage from 'react-native-fit-image';
import ImagePicker from 'react-native-image-picker';
let base_64_image = '';
let rootRef;
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
let image_arr = [];
import Toast from 'react-native-simple-toast';
import global from './Global';
import {Value} from 'react-native-reanimated';
let user_id = '';
let arr_country = [];
let arr_category = [];
let time_slot = [];
let selected_category_array = [];
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import CountryPicker from 'react-native-country-picker-modal';
import {connect} from 'react-redux';
import {getAllCategories} from '../redux/categorySlice';
import {getAllShops, updateShop} from '../redux/shopSlice';
import {APP_CONFIG} from '../../config';
class Edit_Shop extends Component {
  constructor(props) {
    super(props);
    const data = this.props.navigation.getParam('data');
    (this.categoryies = []),
      (this.state = {
        Addshop: false,
        switchValue: false,
        switch_arabic: false,
        distance: false,
        delivery: false,
        pos_gateway: data.pos || false,
        app01_gateway: false,
        pay_on_delivery: data.payment_cash || false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thrusday: false,
        friday: false,
        saturday: false,
        sunday: false,
        table_order: data.table_order || false,
        data: [
          {
            value: 'Test',
            label: 'Test',
          },
          {
            value: 'Groceries',
            label: 'Groceries',
          },
          {
            value: 'Bars and Pubs',
            label: 'Bars and Pubs',
          },
          {
            value: 'Resturent',
            label: 'Resturent',
          },
        ],
        image_array: [
          {
            image: require('./images/table_1.jpg'),
          },
          {
            image: require('./images/table_2.jpg'),
          },
          {
            image: require('./images/table_1.jpg'),
          },
          {
            image: require('./images/table_2.jpg'),
          },
          {
            image: require('./images/table_1.jpg'),
          },
          {
            image: require('./images/table_2.jpg'),
          },
        ],
        day_list: [
          {
            day: 'M',
          },
          {
            day: 'T',
          },
          {
            day: 'W',
          },
          {
            day: 'T',
          },
          {
            day: 'F',
          },
          {
            day: 'S',
          },
          {
            day: 'S',
          },
        ],
        shop_images: [],
        _id: data._id,
        shop_name: data.shop_name,
        shop_description: data.description,
        shop_address: data.address,
        shop_phone_number: data.phone,
        distance_cover_by_delivery: data.delivery_distance
          ? data.delivery_distance + ''
          : '',
        delivery_charges:
          typeof data.delivery_charges === 'number'
            ? data.delivery_charges + ''
            : '',
        table_order_price:
          typeof data.table_order_charges === 'number'
            ? data.table_order_charges + ''
            : '',
        delivery_status: data.delivery_available || false,
        country_list: [],
        country: '',
        category_list: [],
        first_name: '',
        last_name: '',
        user_name: '',
        email: '',
        shop_open_time: '',
        shop_closed_time: '',
        shop_timing_list: data.shop_timing || [],
        shop_category_list: [],
        latitude: 0.0,
        longitude: 0.0,
        category_name: '',
        category_id: data.category_id,
        images: data.images,
        sno: 0,
        timing_list: [
          {
            lable: '05:00 AM',
            value: '05:00 AM',
          },
          {
            lable: '06:00 AM',
            value: '06:00 AM',
          },
          {
            lable: '07:00 AM',
            value: '07:00 AM',
          },
          {
            lable: '08:00 AM',
            value: '08:00 AM',
          },
          {
            lable: '09:00 AM',
            value: '09:00 AM',
          },
          {
            lable: '10:00 AM',
            value: '10:00 AM',
          },
          {
            lable: '12:00 AM',
            value: '12:00 AM',
          },
          {
            lable: '12:00 PM',
            value: '12:00 PM',
          },
          {
            lable: '01:00 PM',
            value: '01:00 PM',
          },
          {
            lable: '02:00 PM',
            value: '02:00 PM',
          },
          {
            lable: '03:00 PM',
            value: '03:00 PM',
          },
          {
            lable: '04:00 PM',
            value: '04:00 PM',
          },
          {
            lable: '05:00 PM',
            value: '05:00 PM',
          },
          {
            lable: '06:00 PM',
            value: '06:00 PM',
          },
          {
            lable: '07:00 PM',
            value: '07:00 PM',
          },
          {
            lable: '08:00 PM',
            value: '08:00 PM',
          },
          {
            lable: '09:00 PM',
            value: '09:00 PM',
          },
          {
            lable: '10:00 PM',
            value: '10:00 PM',
          },
          {
            lable: '11:00 PM',
            value: '11:00 PM',
          },
          {
            lable: '12:00 AM',
            value: '12:00 AM',
          },
          {
            lable: '01:00 AM',
            value: '01:00 AM',
          },
          {
            lable: '02:00 AM',
            value: '02:00 AM',
          },
          {
            lable: '03:00 AM',
            value: '03:00 AM',
          },
          {
            lable: '04:00 AM',
            value: '04:00 AM',
          },
        ],
      });
  }

  componentDidMount() {
    this.props.getAllCategories();
  }

  backpress = () => {
    this.props.navigation.goBack();
  };
  updateLanguageEnglish = (value) => {
    this.setState({delivery: value});
  };

  distance = (value) => {
    this.setState({distance: value});
  };

  pos_gateway_click = (value) => {
    this.setState({pos_gateway: value});
  };
  app01_gateway_click = (value) => {
    this.setState({app01_gateway: value});
  };
  pay_on_delivery_gateway_click = (value) => {
    if (this.state.pos_gateway == true) {
      this.setState({pay_on_delivery: value});
    } else {
      Toast.show(
        'Pay on delivery is default payment and can be deactivated only if Pos (payment system) is set.',
      );
    }
  };

  done_top = () => {
    this.setState({drag_drop: false});
  };
  monday_choose = (value) => {
    this.setState({monday: value});
  };
  tuesday_choose = (value) => {
    this.setState({tuesday: value});
  };
  wednesday_choose = (value) => {
    this.setState({wednesday: value});
  };
  thrusday_choose = (value) => {
    this.setState({thrusday: value});
  };
  0;
  friday_choose = (value) => {
    this.setState({friday: value});
  };
  saturday_choose = (value) => {
    this.setState({saturday: value});
  };
  sunday_choose = (value) => {
    this.setState({sunday: value});
  };
  delivery_status_choose = (value) => {
    this.setState({delivery_status: value});
  };
  table_order_choose = (value) => {
    this.setState({table_order: value});
  };
  monday_select = () => {
    this.setState({
      monday: true,
      tuesday: false,
      wednesday: false,
      thrusday: false,
      friday: false,
      saturday: false,
      sunday: false,
    });
  };
  tuesday_select = () => {
    this.setState({
      monday: false,
      tuesday: true,
      wednesday: false,
      thrusday: false,
      friday: false,
      saturday: false,
      sunday: false,
    });
  };
  wednesday_select = () => {
    this.setState({
      monday: false,
      tuesday: false,
      wednesday: true,
      thrusday: false,
      friday: false,
      saturday: false,
      sunday: false,
    });
  };
  thrusday_select = () => {
    this.setState({
      monday: false,
      tuesday: false,
      wednesday: false,
      thrusday: true,
      friday: false,
      saturday: false,
      sunday: false,
    });
  };
  friday_select = () => {
    this.setState({
      monday: false,
      tuesday: false,
      wednesday: false,
      thrusday: false,
      friday: true,
      saturday: false,
      sunday: false,
    });
  };
  saturday_select = () => {
    this.setState({
      monday: false,
      tuesday: false,
      wednesday: false,
      thrusday: false,
      friday: false,
      saturday: true,
      sunday: false,
    });
  };
  sunday_select = () => {
    this.setState({
      monday: false,
      tuesday: false,
      wednesday: false,
      thrusday: false,
      friday: false,
      saturday: false,
      sunday: true,
    });
  };
  table_order_choose = (value) => {
    this.setState({table_order: value});
  };
  chooseFile = () => {
    if (this.state.shop_images.length > 5) {
      Toast.show('Add Maximum 6 Images');
    } else {
      var options = {
        mediaType: 'photo',
        selectionLimit: 0,
        quality: 0.5,
        includeBase64: true,
      };

      launchImageLibrary(options, (response) => {
        console.log(response);
        if (!response.assets) {
          return;
        }
        this.setState({
          images: [
            ...response.assets.filter((d) => d.type !== null),
            ...this.state.images,
          ],
        });
      });
      // ImagePicker.showImagePicker(options, (response) => {
      //   if (response.didCancel) {
      //   } else if (response.error) {
      //   } else if (response.customButton) {
      //     alert(response.customButton);
      //   } else {
      //     this.setState({images: [response, ...this.state.images]});
      //   }
      // });
    }
  };

  set_time = () => {
    if (
      this.state.sunday == false &&
      this.state.monday == false &&
      this.state.tuesday == false &&
      this.state.wednesday == false &&
      this.state.thrusday == false &&
      this.state.friday == false &&
      this.state.saturday == false
    ) {
      Toast.show('Select Day');
    } else if (this.state.shop_open_time == '') {
      Toast.show('Add Shop Open Time');
    } else if (this.state.shop_closed_time == '') {
      Toast.show('Add Shop Closed Time');
    } else {
      var selectedday = '';
      if (this.state.sunday != false) {
        selectedday = 'Sunday';
      } else if (this.state.monday != false) {
        selectedday = 'Monday';
      } else if (this.state.tuesday != false) {
        selectedday = 'Tuesday';
      } else if (this.state.wednesday != false) {
        selectedday = 'Wednesday';
      } else if (this.state.thrusday != false) {
        selectedday = 'Thursday';
      } else if (this.state.friday != false) {
        selectedday = 'Friday';
      } else if (this.state.saturday != false) {
        selectedday = 'Saturday';
      }
      var object = {
        day: selectedday,
        open_time: this.state.shop_open_time,
        closed_time: this.state.shop_closed_time,
      };
      this.setState({
        shop_timing_list: [...this.state.shop_timing_list, object],
      });
      this.setState({shop_open_time: ''});
      this.setState({shop_closed_time: ''});
    }
  };

  delete_shop_image = (index) => {
    var array = [...this.state.images];
    array.splice(index, 1);
    this.setState({images: array});
  };
  shop_added = async () => {
    this.setState({spinner: true});
    const data = {
      _id: this.state._id,
      address: this.state.shop_address,
      country: this.state.country,
      description: this.state.shop_description,
      image: this.state.shop_images,
      shop_name: this.state.shop_name,
      delivery_available: this.state.delivery_status,
      delivery_distance: this.state.distance_cover_by_delivery,
      delivery_charges: this.state.delivery_charges,
      table_order: this.state.table_order,
      table_order_charges: this.state.table_order_price,
      payment_pos: this.state.pos_gateway,
      payment_cash: this.state.pay_on_delivery,
      shop_timing: this.state.shop_timing_list,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      category_id: this.state.category_id,
      images: this.state.images,
      pos: this.state.pos_gateway,
      phone: this.state.shop_phone_number,
    };
    try {
      await updateShop(data);
      this.props.getAllShops();
      this.props.navigation.goBack();
    } catch (e) {
      Toast('Upload failed');
    }
    this.setState({spinner: false});
    // }
  };
  dialog_ok = () => {
    this.setState({scaleAnimationDialog: false});
    this.props.navigation.replace('Shop');
  };

  full_address = (data, detail) => {
    this.setState({shop_address: data.description});
    this.setState({latitude: detail.geometry.location.lat});
    this.setState({longitude: detail.geometry.location.lng});
  };
  category_input = (data) => {
    this.setState({category_id: data.value});
    this.setState({category_name: data.label});

    console.log(data);
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
        <View style={{flexDirection: 'row', marginTop: 15, marginBottom: 15}}>
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

        <Text style={styles.add_card_text}>Edit Shop</Text>

        <ScrollView keyboardShouldPersistTaps="always">
          <View>
            <TouchableOpacity onPress={this.chooseFile.bind(this)}>
              <Image
                style={{
                  alignSelf: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: 10,
                  resizeMode: 'contain',
                  marginVertical: 30,
                }}
                source={require('./images/add_shop.png')}
              />
            </TouchableOpacity>
            <View style={{marginLeft: 35}}>
              <DraggableFlatList
                horizontal
                data={this.state.images}
                onDragEnd={({data}) => this.setState({images: data})}
                renderItem={({item, index, drag}) => (
                  <TouchableOpacity
                    onLongPress={drag}
                    style={{marginRight: 10}}>
                    <FitImage
                      style={{
                        width: 80,
                        height: 80,
                        resizeMode: 'contain',
                        borderRadius: 10,
                        overflow: 'hidden',
                      }}
                      source={
                        typeof item === 'string'
                          ? {
                              uri:
                                APP_CONFIG.backend_url + '/image/shop/' + item,
                            }
                          : {uri: item.uri}
                      }
                    />
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        top: 5,
                        right: 10,
                      }}
                      onPress={() => this.delete_shop_image(index)}>
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
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => `draggable-item-${index}`}
              />
            </View>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={this.state.shop_name}
              placeholder={'Shop Name'}
              returnKeyLabel={'next'}
              onChangeText={(text) => this.setState({shop_name: text})}
            />

            <TextInput
              style={styles.input}
              autoCapitalize="none"
              value={this.state.shop_description}
              placeholder={'Shop Description'}
              returnKeyLabel={'next'}
              onChangeText={(text) => this.setState({shop_description: text})}
            />

            <View />

            <GooglePlacesAutocomplete
              fetchDetails={true}
              styles={{
                textInputContainer: {
                  marginHorizontal: 40,
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                  marginTop: 20,
                },
                textInput: {
                  color: '#5d5d5d',
                  fontSize: 18,
                },
                predefinedPlacesDescription: {
                  color: 'red',
                },
                listView: {
                  marginHorizontal: 40,
                },
              }}
              placeholder={this.state.shop_address}
              onPress={(data, details = null) => {
                this.full_address(data, details);
              }}
              onFail={(error) => console.error(error)}
              query={{
                key: 'AIzaSyAkHq68S7fuekxh15phIQkPYWnQgp7gF74',
                language: 'en',
              }}
            />

            {/* <TextInput
							style={styles.input}
							autoCapitalize="none"
							placeholder={'Shop Address'}
							returnKeyLabel={'next'}
							onChangeText={text => this.setState({ shop_address: text })}
						/> */}

            <TextInput
              style={styles.input}
              autoCapitalize="none"
              placeholder={'Shop Phone'}
              value={this.state.shop_phone_number}
              returnKeyLabel={'next'}
              onChangeText={(text) => this.setState({shop_phone_number: text})}
            />

            {/* <View style={styles.dropdownBackground}>
							<Dropdown
								data={this.state.category_list}
								inputContainerStyle={{ borderBottomWidth: 0 }}
								style={{ paddingLeft: 5, fontSize: 18 }}
								pickerStyle={{ borderBottomColor: 'transparent', borderWidth: 0 }}
								dropdownOffset={{ top: 11 }}
								placeholder={'Select Shop Category'}
								containerStyle={styles.dropdown}
								onChangeText={value => this.select_category(value)}
							/>
						</View>
						<FlatList
							horizontal={false}
							showsVerticalScrollIndicator={false}
							numColumns={1}
							data={this.state.shop_category_list}
							renderItem={({ item, index }) =>
								<View style={{ flexDirection: 'row', marginHorizontal: 40, marginTop: 15 }}>
									<Text style={{ width: '90%', fontSize: 16 }}>
										{item.name}
									</Text>
									<Image
										style={{
											alignSelf: 'center',
											width: 25,
											height: 25,
											borderRadius: 10,
											resizeMode: 'contain',
										}}
										source={require('./images/cancel.png')}
									/>
								</View>}
						/> */}
            {/* 
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 40,
                paddingVertical: 25,
              }}>
              <Text style={{color: 'grey', fontSize: 16}}>
                {this.state.country || 'Country not selected'}
              </Text>
              <CountryPicker
                onSelect={(c) => this.setState({country: c.name})}
                containerButtonStyle={styles.country_btn}
              />
            </View> */}
            <View style={styles.dropdownBackground}>
              <Dropdown
                data={this.props.categories.map((d) => ({
                  label: d.name,
                  value: d._id,
                }))}
                inputContainerStyle={{borderBottomWidth: 0}}
                style={{paddingLeft: 5, fontSize: 18}}
                pickerStyle={{borderBottomColor: 'transparent', borderWidth: 0}}
                dropdownOffset={{top: 11}}
                placeholder={'Select Category'}
                value={
                  (
                    this.props.categories.find(
                      (a) => a._id === this.state.category_id,
                    ) || {_id: ''}
                  )._id
                }
                containerStyle={styles.dropdown}
                onChangeText={(label, data, index) => {
                  this.setState({category_id: index[data].value});
                }}
              />
            </View>

            <Text style={styles.shoptime_text}>Shop Open Time</Text>
            <View style={{flexDirection: 'row', marginHorizontal: 40}}>
              <TouchableOpacity
                style={{marginRight: 10}}
                onPress={this.monday_select}>
                <Text style={styles.data_text}>M</Text>
                {this.state.monday == true ? (
                  <View
                    style={{
                      height: 3,
                      width: 20,
                      backgroundColor: '#af0808',
                      marginTop: 3,
                    }}
                  />
                ) : null}
              </TouchableOpacity>

              <TouchableOpacity
                style={{marginHorizontal: 10}}
                onPress={this.tuesday_select}>
                <Text style={styles.data_text}>T</Text>
                {this.state.tuesday == true ? (
                  <View
                    style={{
                      height: 3,
                      width: 20,
                      backgroundColor: '#af0808',
                      marginTop: 3,
                    }}
                  />
                ) : null}
              </TouchableOpacity>

              <TouchableOpacity
                style={{marginHorizontal: 10}}
                onPress={this.wednesday_select}>
                <Text style={styles.data_text}>W</Text>
                {this.state.wednesday == true ? (
                  <View
                    style={{
                      height: 3,
                      width: 20,
                      backgroundColor: '#af0808',
                      marginTop: 3,
                    }}
                  />
                ) : null}
              </TouchableOpacity>

              <TouchableOpacity
                style={{marginHorizontal: 10}}
                onPress={this.thrusday_select}>
                <Text style={styles.data_text}>T</Text>
                {this.state.thrusday == true ? (
                  <View
                    style={{
                      height: 3,
                      width: 20,
                      backgroundColor: '#af0808',
                      marginTop: 3,
                    }}
                  />
                ) : null}
              </TouchableOpacity>

              <TouchableOpacity
                style={{marginHorizontal: 10}}
                onPress={this.friday_select}>
                <Text style={styles.data_text}>F</Text>
                {this.state.friday == true ? (
                  <View
                    style={{
                      height: 3,
                      width: 20,
                      backgroundColor: '#af0808',
                      marginTop: 3,
                    }}
                  />
                ) : null}
              </TouchableOpacity>

              <TouchableOpacity
                style={{marginHorizontal: 10}}
                onPress={this.saturday_select}>
                <Text style={styles.data_text}>S</Text>
                {this.state.saturday == true ? (
                  <View
                    style={{
                      height: 3,
                      width: 20,
                      backgroundColor: '#af0808',
                      marginTop: 3,
                    }}
                  />
                ) : null}
              </TouchableOpacity>

              <TouchableOpacity
                style={{marginHorizontal: 10}}
                onPress={this.sunday_select}>
                <Text style={styles.data_text}>S</Text>
                {this.state.sunday == true ? (
                  <View
                    style={{
                      height: 3,
                      width: 20,
                      backgroundColor: '#af0808',
                      marginTop: 3,
                    }}
                  />
                ) : null}
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 40,
                marginTop: 15,
              }}>
              <Dropdown
                value={this.state.shop_open_time}
                data={this.state.timing_list}
                inputContainerStyle={{borderBottomWidth: 0}}
                style={{fontSize: 10}}
                pickerStyle={{borderBottomColor: 'transparent', borderWidth: 0}}
                dropdownOffset={{top: 11}}
                placeholder={'Open Time'}
                containerStyle={styles.day_input_distance}
                onChangeText={(value) => {
                  this.setState({shop_open_time: value});
                }}
              />
              <Text style={{marginHorizontal: 42, marginTop: 10}}>-</Text>

              <Dropdown
                value={this.state.shop_closed_time}
                data={this.state.timing_list}
                inputContainerStyle={{borderBottomWidth: 0}}
                style={{fontSize: 10}}
                pickerStyle={{borderBottomColor: 'transparent', borderWidth: 0}}
                dropdownOffset={{top: 11}}
                placeholder={'Closed Time'}
                containerStyle={styles.day_input_distance}
                onChangeText={(value) => {
                  this.setState({shop_closed_time: value});
                }}
              />
            </View>

            <TouchableOpacity onPress={() => this.set_time()}>
              <Text style={styles.add_time_text}>Add Time</Text>
            </TouchableOpacity>

            <FlatList
              horizontal={false}
              showsVerticalScrollIndicator={false}
              numColumns={1}
              data={this.state.shop_timing_list}
              renderItem={({item, index}) => (
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 40,
                    marginTop: 10,
                  }}>
                  <Text style={styles.day_text}>{item.day}</Text>
                  <Text style={styles.open_time_text}>{item.open_time}</Text>
                  <Text style={styles.closed_time_text}>
                    {item.closed_time}
                  </Text>

                  <TouchableOpacity
                    style={{marginLeft: 10}}
                    onPress={() =>
                      this.setState({
                        shop_timing_list: this.state.shop_timing_list.filter(
                          (item, ind) => ind !== index,
                        ),
                      })
                    }>
                    <Image
                      source={require('./images/cancel.png')}
                      style={{
                        width: 30,
                        height: 30,
                        alignSelf: 'center',
                        resizeMode: 'contain',
                        tintColor: design.theme_color_parent,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              )}
            />

            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 35,
                marginTop: 20,
              }}>
              <Text style={styles.delivery_text}>Delivery</Text>
              <Switch
                style={{marginTop: 20}}
                value={this.state.delivery_status}
                onValueChange={(value) => this.delivery_status_choose(value)}
              />
            </View>

            {this.state.delivery_status == true ? (
              <View>
                <View
                  style={{
                    marginHorizontal: 40,
                    flexDirection: 'row',
                    marginTop: 25,
                  }}>
                  <Text style={styles.delivery_price}>Distance km</Text>
                  <TextInput
                    style={styles.delivery_input}
                    autoCapitalize="none"
                    placeholder={''}
                    value={this.state.distance_cover_by_delivery}
                    keyboardType={
                      Platform.OS === 'ios' ? 'number-pad' : 'numeric'
                    }
                    returnKeyLabel={'next'}
                    onChangeText={(text) =>
                      this.setState({distance_cover_by_delivery: text})
                    }
                  />
                </View>

                <View
                  style={{
                    marginHorizontal: 40,
                    flexDirection: 'row',
                    marginTop: 25,
                  }}>
                  <Text style={styles.delivery_price}>Delivery Price €</Text>
                  <TextInput
                    style={styles.delivery_input}
                    autoCapitalize="none"
                    placeholder={''}
                    value={this.state.delivery_charges}
                    keyboardType={
                      Platform.OS === 'ios' ? 'number-pad' : 'numeric'
                    }
                    returnKeyLabel={'next'}
                    onChangeText={(text) =>
                      this.setState({delivery_charges: text})
                    }
                  />
                </View>
              </View>
            ) : null}

            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 35,
                marginTop: 20,
              }}>
              <Text style={styles.delivery_text}>Table order (Restaurant)</Text>
              <Switch
                style={{marginTop: 20}}
                value={this.state.table_order}
                onValueChange={(value) => this.table_order_choose(value)}
              />
            </View>
            {this.state.table_order == true ? (
              <View
                style={{
                  marginHorizontal: 40,
                  flexDirection: 'row',
                  marginTop: 25,
                }}>
                <Text style={styles.table_order_price}>
                  Table order price %
                </Text>
                <TextInput
                  style={styles.table_order_input}
                  autoCapitalize="none"
                  value={this.state.table_order_price}
                  placeholder={''}
                  returnKeyLabel={'next'}
                  keyboardType={
                    Platform.OS === 'ios' ? 'number-pad' : 'numeric'
                  }
                  onChangeText={(text) =>
                    this.setState({table_order_price: text})
                  }
                />
              </View>
            ) : null}

            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 35,
                marginTop: 20,
              }}>
              <Text style={styles.delivery_text}>POS</Text>
              <View
                style={{
                  width: '20%',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}>
                <Switch
                  style={{}}
                  value={this.state.pos_gateway}
                  onValueChange={(value) => this.pos_gateway_click(value)}
                />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: 35,
                marginTop: 20,
              }}>
              <Text style={styles.delivery_text}>Pay on Delivery</Text>
              <View
                style={{
                  width: '20%',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                }}>
                <Switch
                  style={{}}
                  value={this.state.pay_on_delivery}
                  onValueChange={(value) =>
                    this.pay_on_delivery_gateway_click(value)
                  }
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={this.shop_added}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 50,
              }}>
              <Text style={styles.pay_text}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Dialog
          onTouchOutside={() => {
            this.setState({scaleAnimationDialog: true});
          }}
          width={0.9}
          visible={this.state.scaleAnimationDialog}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            this.setState({scaleAnimationDialog: false});
            return true;
          }}
          actions={[
            <DialogButton
              text="DISMISS"
              onPress={() => {
                this.setState({scaleAnimationDialog: false});
              }}
              key="button-1"
            />,
          ]}>
          <DialogContent>
            <View>
              <Text style={styles.title}>Response</Text>
              <Text style={styles.sub_title}>Your Shop Added Successfully</Text>

              <View style={{flexDirection: 'row'}}>
                <Text style={styles.no} onPress={() => this.dialog_ok()}>
                  Ok
                </Text>
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
    getAllCategories: () => dispatch(getAllCategories()),
    getAllShops: () => dispatch(getAllShops()),
  };
};
const mapStateToProps = (state) => {
  return {
    categories: state.categories.list,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Edit_Shop);

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
    textAlign: 'center',
  },
  dropdownBackground: {
    marginHorizontal: 35,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    borderRadius: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginTop: Platform.OS == 'ios' ? 20 : 0,
    paddingBottom: Platform.OS == 'ios' ? 5 : 0,
    marginHorizontal: 40,
    fontSize: 18,
    marginTop: 30,
  },
  shoptime_text: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginTop: Platform.OS == 'ios' ? 20 : 0,
    paddingBottom: Platform.OS == 'ios' ? 5 : 0,
    marginHorizontal: 40,
    fontSize: 18,
    marginTop: 30,
  },
  dayname_text: {
    fontSize: 16,
    color: '#000000',
    marginTop: 3,
    width: '30%',
  },
  country_btn: {
    backgroundColor: 'lightgrey',
    alignSelf: 'center',
    borderRadius: 5,
    fontSize: 15,
    textAlign: 'center',
    overflow: 'hidden',
    padding: 10,
  },
  data_text: {
    fontSize: 18,
    color: '#000000',
    marginTop: 3,
    marginLeft: 3,
  },
  delivery_text: {
    fontSize: 18,
    color: '#000000',
    width: '80%',
    marginTop: 20,
  },
  add_time_text: {
    fontSize: 18,
    color: '#af0808',
    marginHorizontal: 40,
    marginTop: 20,
  },
  pay_text: {
    fontSize: 22,
    color: '#fff',
    backgroundColor: design.theme_color_parent,
    paddingHorizontal: 80,
    paddingVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 50,
  },
  distance_text: {
    fontSize: 18,
    color: '#000000',
    width: '25%',
  },
  input_distance: {
    marginHorizontal: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#a9a9a9',
    fontSize: 18,
    marginTop: 5,
    paddingBottom: Platform.OS == 'ios' ? 5 : 0,
  },
  add_card_text_2: {
    fontSize: 20,
    color: '#000000',
    marginLeft: 10,
    textAlign: 'center',
    marginVertical: 15,
  },
  inputttttt: {
    paddingBottom: Platform.OS === 'ios' ? 5 : 0,
    textAlign: 'center',
    fontSize: 18,
    marginTop: 10,
  },
  day_input_distance: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    fontSize: 18,
    paddingBottom: Platform.OS == 'ios' ? 5 : 0,
    width: '35%',
  },
  delivery_price: {
    fontSize: 18,
    width: '45%',
  },
  delivery_input: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    fontSize: 18,
    width: '50%',
    marginTop: Platform.OS == 'ios' ? 0 : -10,
  },
  table_order_price: {
    fontSize: 18,
    width: '60%',
  },
  table_order_input: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    fontSize: 18,
    width: '30%',
    marginTop: Platform.OS == 'ios' ? 0 : -10,
  },
  open_time_text: {
    fontSize: 16,
    marginLeft: 10,
  },
  closed_time_text: {
    fontSize: 16,
    marginLeft: 10,
  },
  day_text: {
    fontSize: 16,
    width: '40%',
  },
  title: {
    fontSize: 22,
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'HiraMaruPro-W4',
    marginTop: 30,
  },
  sub_title: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'HiraMaruPro-W4',
    marginTop: 10,
  },

  no: {
    flex: 1,
    fontSize: 20,
    color: '#000000',
    textAlign: 'center',
    fontFamily: 'HiraMaruPro-W4',
    marginTop: 30,
  },
});
