import React, {Component} from 'react';
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
let rootRef;
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
import Toast from 'react-native-simple-toast';
import {Dropdown} from 'react-native-material-dropdown-v2';
let user_id = '';
let arr_cartholder = [];
export default class App01 extends Component {
  constructor(props) {
    super(props);
    rootRef = firebase.database().ref();
    (this.categoryies = []),
      (this.state = {
        categoryHolder: [],
        cart_type_list: [
          {
            value: 'VISA',
            label: 'VISA',
          },
          {
            value: 'MASTER',
            label: 'MASTER',
          },
          {
            value: 'RUPAY',
            label: 'RUPAY',
          },
        ],
        name_on_cart: '',
        cart_number: '',
        cart_expiry_month: '',
        cart_expiry_year: '',
        cart_cvv: '',
        cart_type: '',
      });
  }
  componentDidMount() {
    this.displayData();
  }
  displayData = async () => {
    try {
      user_id = await AsyncStorage.getItem('user_id');

      this.setState({spinner: true});
      rootRef.child('/user_carts/' + user_id).on('value', (snapshot) => {
        arr_cartholder = [];
        this.setState({categoryHolder: arr_cartholder});
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();
            let number = childData.cart_number.substr(-4);
            var object = {
              cart_id: key,
              cart_number: '**** **** **** ' + number,
              cart_status: childData.status,
              cart_type: childData.cart_type,
            };
            arr_cartholder.push(object);
          });
          this.update_shop(arr_cartholder);
        } else {
          this.setState({spinner: false});
        }
      });
    } catch (error) {
      alert(error);
    }
  };
  update_shop = (object) => {
    var self = this;
    setTimeout(() => {
      this.setState({spinner: false});
      self.setState({categoryHolder: object});
    }, 1000);
  };
  backpress = () => {
    this.props.navigation.goBack();
  };
  add_card = () => {
    this.setState({Create_card_Dialog: true});
  };

  switch_button = (value, position) => {
    const newArray = [...this.state.categoryHolder];
    newArray[position].status = value;
    this.setState({categoryHolder: newArray});
  };
  handlerLongClick = () => {
    this.setState({card_option_dialog: true});
  };
  set_default_click = () => {
    this.setState({card_option_dialog: false});
  };
  move_click = () => {
    this.setState({card_option_dialog: false});
  };
  delete_click = () => {
    this.setState({card_option_dialog: false});
  };
  fixCardText(text) {
    if (text.length == 2 && this.state.cart_expiry == 1) {
      text += '/';
    } else if (text.length == 2 && this.state.cart_expiry.length == 3) {
      text = text.substring(0, text.length - 1);
    }
    this.setState({cart_expiry: text});
  }

  saved_pin = () => {
    if (this.state.name_on_cart == '') {
      Toast.show('Enter Name');
    } else if (this.state.cart_number == '') {
      Toast.show('Enter Cart Number');
    } else if (this.state.cart_number.length < 14) {
      Toast.show('Enter Valid Cart Number');
    } else if (this.state.cart_expiry_month == '') {
      Toast.show('Enter Cart Expiry Month');
    } else if (this.state.cart_expiry_year == '') {
      Toast.show('Enter Cart Expiry Year');
    } else if (this.state.cart_cvv == '') {
      Toast.show('Enter Cart CVV');
    } else if (this.state.cart_type == '') {
      Toast.show('Select Cart Type');
    } else {
      this.setState({spinner: true});
      let postRef = firebase.database().ref('/user_carts/' + user_id);
      postRef
        .push({
          user_id: user_id,
          status: true,
          name_on_cart: this.state.name_on_cart,
          cart_number: this.state.cart_number,
          cart_expiry_month: this.state.cart_expiry_month,
          cart_expiry_year: this.state.cart_expiry_year,
          cart_cvv: this.state.cart_cvv,
          cart_type: this.state.cart_type,
        })
        .then((res) => {
          console.log('done');
          this.setState({spinner: false});
          this.setState({Create_card_Dialog: false});
        })
        .catch((error) => console.log(error));
    }
  };
  product_status = (value, cart_id) => {
    var adaNameRef = firebase
      .database()
      .ref('user_carts/' + user_id + '/' + cart_id);
    adaNameRef.update({
      status: value,
    });
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

        <TouchableOpacity
          onPress={() => this.add_card()}
          style={{flexDirection: 'row', marginLeft: 30, marginTop: 25}}>
          <Image
            style={{width: 30, height: 30, resizeMode: 'contain'}}
            source={require('./images/add_new.png')}
          />
          <Text style={styles.add_card_text}>Add Card</Text>
        </TouchableOpacity>

        <FlatList
          horizontal={false}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          style={{marginTop: 30}}
          data={this.state.categoryHolder}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onLongPress={this.handlerLongClick}
              style={{
                flexDirection: 'row',
                marginHorizontal: 10,
                marginTop: 30,
              }}>
              <View
                style={{
                  width: '20%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  style={{width: 50, height: 40, resizeMode: 'contain'}}
                  source={
                    item.cart_type == 'VISA'
                      ? require('./images/visa.png')
                      : item.cart_type == 'MASTER'
                      ? require('./images/master.png')
                      : require('./images/rupay.png')
                  }
                />
              </View>
              <View style={{width: '50%', justifyContent: 'center'}}>
                <Text style={styles.cardno_text}>{item.cart_number}</Text>
              </View>
              <View
                style={{
                  width: '30%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Switch
                  style={{}}
                  value={item.cart_status}
                  onValueChange={(value) =>
                    this.product_status(value, item.cart_id)
                  }
                />
              </View>
            </TouchableOpacity>
          )}
        />

        <Dialog
          onTouchOutside={() => {
            this.setState({Create_card_Dialog: false});
          }}
          width={0.9}
          visible={this.state.Create_card_Dialog}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            console.log('onHardwareBackPress');
            this.setState({Create_card_Dialog: false});
            return true;
          }}
          actions={[
            <DialogButton
              text="DISMISS"
              onPress={() => {
                this.setState({Create_card_Dialog: false});
              }}
              key="button-1"
            />,
          ]}>
          <DialogContent>
            <View>
              <Text style={styles.add_card_text_2}>ADD CARD</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                placeholder={'Name on cart'}
                returnKeyLabel={'next'}
                onChangeText={(text) => this.setState({name_on_cart: text})}
              />

              <TextInput
                style={styles.input}
                autoCapitalize="none"
                placeholder={'Enter cart number'}
                returnKeyLabel={'next'}
                maxLength={16}
                onChangeText={(text) => this.setState({cart_number: text})}
              />

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TextInput
                  style={styles.input_2}
                  autoCapitalize="none"
                  maxLength={2}
                  placeholder={'MM'}
                  returnKeyLabel={'next'}
                  onChangeText={(text) =>
                    this.setState({cart_expiry_month: text})
                  }
                />
                <TextInput
                  style={styles.input_2}
                  autoCapitalize="none"
                  placeholder={'YY'}
                  maxLength={2}
                  returnKeyLabel={'next'}
                  onChangeText={(text) =>
                    this.setState({cart_expiry_year: text})
                  }
                />
                <TextInput
                  style={styles.input_2}
                  autoCapitalize="none"
                  placeholder={'CVV'}
                  maxLength={3}
                  returnKeyLabel={'next'}
                  onChangeText={(text) => this.setState({cart_cvv: text})}
                />
              </View>
              <View style={styles.dropdownBackground}>
                <Dropdown
                  data={this.state.cart_type_list}
                  inputContainerStyle={{borderBottomWidth: 0}}
                  style={{paddingLeft: 5, fontSize: 18}}
                  pickerStyle={{
                    borderBottomColor: 'transparent',
                    borderWidth: 0,
                  }}
                  dropdownOffset={{top: 11}}
                  placeholder={'Select Cart Type'}
                  containerStyle={styles.dropdown}
                  onChangeText={(value) => {
                    this.setState({cart_type: value});
                  }}
                />
              </View>

              <TouchableOpacity
                onPress={() => this.saved_pin()}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 50,
                }}>
                <Text style={styles.pay_text}>Save</Text>
              </TouchableOpacity>
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          onTouchOutside={() => {
            this.setState({card_option_dialog: false});
          }}
          width={0.9}
          visible={this.state.card_option_dialog}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            console.log('onHardwareBackPress');
            this.setState({card_option_dialog: false});
            return true;
          }}
          actions={[
            <DialogButton
              text="DISMISS"
              onPress={() => {
                this.setState({card_option_dialog: false});
              }}
              key="button-1"
            />,
          ]}>
          <DialogContent>
            <View>
              <TouchableOpacity onPress={() => this.set_default_click()}>
                <Text style={styles.header_text}>Set as default</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.move_click()}>
                <Text style={styles.header_text}>Move card</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.delete_click()}>
                <Text style={styles.header_text}>Delete card</Text>
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
  input: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginTop: Platform.OS == 'ios' ? 20 : 0,
    paddingBottom: Platform.OS == 'ios' ? 5 : 0,
    marginHorizontal: 40,
    fontSize: 18,
    marginTop: 30,
  },
  input_2: {
    width: '22%',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginTop: Platform.OS == 'ios' ? 20 : 0,
    paddingBottom: Platform.OS == 'ios' ? 5 : 0,
    marginHorizontal: 5,
    fontSize: 18,
    marginTop: 30,
  },
  pay_text: {
    fontSize: 20,
    color: '#fff',
    backgroundColor: design.theme_color_parent,
    paddingHorizontal: 80,
    paddingVertical: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  header_text: {
    fontSize: 20,
    color: '#000000',
    marginLeft: 10,
    textAlign: 'center',
    marginTop: 15,
  },
  dropdownBackground: {
    marginHorizontal: 35,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    borderRadius: 8,
  },
});
