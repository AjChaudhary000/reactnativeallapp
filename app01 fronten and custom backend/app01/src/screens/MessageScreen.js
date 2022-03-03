import React, {Component} from 'react';
import {
  Text,
  Image,
  FlatList,
  View,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  Platform,
} from 'react-native';
import {BackHandler} from 'react-native';
import design from './StyleFile';
let rootRef;
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
import global from './Global';
import FitImage from 'react-native-fit-image';
import Toast from 'react-native-simple-toast';
let current_time = '';
import moment from 'moment';
import {db} from './config';
import ImagePicker from 'react-native-image-picker';
let base_64_image = '',
  shop_name = '';
let token_array = [];
import axios from 'axios';
import Dialog, {
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogButton,
  SlideAnimation,
  ScaleAnimation,
} from 'react-native-popup-dialog';
import {
  filterById,
  getChats,
  getChatsForShop,
  getInfo,
  postChat,
} from '../redux/chatSlice';
import {connect} from 'react-redux';
import {APP_CONFIG} from '../../config';
import {getUserProfile} from '../redux/userSlice';
import {formatDate} from '../utils';
class MessageScreen extends Component {
  constructor(props) {
    super(props);
    const data = this.props.navigation.getParam('data');
    this.state = {
      user_name: '',
      user_image: '',
      chat_with_username: '',
      chat_with_userimage: '',
      message: '',
      disable_send: false,
      message_list: [],
      set_count: 0,
      Delete_Category_Dialog: false,
      data: data,
      loading: false,
      shop_info: {
        shop_name: '',
        avatar: '',
      },
      chats: [],
    };
  }
  componentDidMount() {
    this.fetchData();
  }
  fetchData = async () => {
    let shop_id = this.props.navigation.getParam('shop_id');
    try {
      this.setState({loading: true});
      const {data} = await getChatsForShop(shop_id);
      this.setState({
        shop_info: data.shop,
        chats: data.messages,
        loading: false,
      });
    } catch (e) {
      Toast.show('Error fetching messages!');
    }
  };
  backpress = () => {
    this.props.navigation.goBack();
  };
  handleSubmit = async () => {
    if (this.state.message == '') {
      Toast.show('Write a message');
    } else {
      this.setState({disable_send: true});
      const newchat = {
        message: this.state.message,
        to: this.state.shop_info._id,
        from: this.props.userDetails._id,
        created: new Date(),
      };
      this.setState({chats: [...this.state.chats, newchat], message: ''});
      try {
        await postChat(newchat);
        this.props.getChats();
      } catch (e) {
        Toast('Network error');
      }
      this.setState({disable_send: false});
    }
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
    ImagePicker.showImagePicker(options, (response) => {
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
  isMine = (item) => {
    if (item.from === this.props.userDetails._id) {
      return true;
    }
    return false;
  };
  message_click = (id, type, time_stamp) => {
    this.setState({Delete_Category_Dialog: true});
  };
  render() {
    const {shop_info} = this.state;
    return (
      <View style={styles.container}>
        <AnimatedLoader
          visible={this.state.loading}
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
          <TouchableOpacity style={{width: '15%'}} onPress={this.backpress}>
            <Image
              style={{
                width: 30,
                height: 30,
                resizeMode: 'contain',
                marginTop: 13,
                marginLeft: 5,
                tintColor: design.theme_color_parent,
              }}
              source={require('./images/back.png')}
            />
          </TouchableOpacity>
          <View style={{width: '15%'}}>
            <FitImage
              style={{
                width: 45,
                height: 45,
                borderRadius: 22,
                resizeMode: 'contain',
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: '#dcdcdc',
              }}
              source={
                shop_info.images
                  ? {
                      uri:
                        APP_CONFIG.backend_url +
                        '/image/shop/' +
                        shop_info.images[0],
                    }
                  : require('./images/avatar.png')
              }
            />
          </View>
          <View style={{width: '40%'}}>
            <Text style={styles.doctor_name}>{shop_info.shop_name}</Text>
          </View>
          <TouchableOpacity
            style={{
              width: '15%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={this.voicecall}
          />
          <TouchableOpacity
            style={{
              width: '15%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={this.videocall}
          />
        </View>

        <FlatList
          horizontal={false}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          contentContainerStyle={{flex: 1}}
          style={{marginTop: 20}}
          data={this.state.chats}
          ref="flatList"
          keyExtractor={(item) => item._id}
          onContentSizeChange={() => this.refs.flatList.scrollToEnd()}
          renderItem={({item, index}) => (
            <View>
              <TouchableOpacity
                style={
                  this.isMine(item)
                    ? styles.message_container_in
                    : styles.message_container_out
                }
                onPress={() =>
                  this.message_click(item.id, item.type, item.time_stamp)
                }>
                {item.image ? (
                  <TouchableOpacity
                    onPress={() => this.openImage(item.message)}>
                    <FitImage
                      style={{width: 150, height: 150, resizeMode: 'contain'}}
                      source={{uri: item.image}}
                    />
                  </TouchableOpacity>
                ) : (
                  <Text
                    style={
                      this.isMine(item) ? styles.in_text : styles.out_text
                    }>
                    {item.message}
                  </Text>
                )}
                <Text
                  style={
                    this.isMine(item) ? styles.d_text_in : styles.d_text_out
                  }>
                  {formatDate(item.created)}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />

        <View style={styles.footer}>
          {/* <TouchableOpacity
            style={styles.btnSend}
            onPress={this.chooseFile.bind(this)}>
            <Image
              source={require('./images/attach.png')}
              style={styles.iconSend}
            />
          </TouchableOpacity> */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputs}
              value={this.state.message}
              placeholder="Write a message"
              underlineColorAndroid="transparent"
              onChangeText={(value) => this.setState({message: value})}
            />
          </View>

          <TouchableOpacity
            style={styles.btnSend}
            onPress={() => this.handleSubmit()}>
            <Image
              source={require('./images/filled-sent.png')}
              style={styles.iconSend}
            />
          </TouchableOpacity>
        </View>
        <Dialog
          onTouchOutside={() => {
            this.setState({Delete_Category_Dialog: false});
          }}
          width={0.9}
          visible={this.state.Delete_Category_Dialog}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            this.setState({Delete_Category_Dialog: false});
            return true;
          }}
          actions={[
            <DialogButton
              text="DISMISS"
              onPress={() => {
                this.setState({Delete_Category_Dialog: false});
              }}
              key="button-1"
            />,
          ]}>
          <DialogContent>
            <View>
              <Text style={styles.add_card_text_2}>Confirmation</Text>
              <Text style={styles.input}>
                Are you want to sure to delete this message ?
              </Text>
              <TouchableOpacity
                onPress={() => this.delete_message_button()}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 50,
                }}>
                <Text style={styles.pay_text}>Yes</Text>
              </TouchableOpacity>
            </View>
          </DialogContent>
        </Dialog>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getUserInfo: () => dispatch(getUserProfile()),
    getChats: () => dispatch(getChats()),
  };
};
const mapStateToProps = (state) => {
  return {
    loading: state.chat.loading,
    userDetails: state.user.userDetails,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MessageScreen);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 30 : 30,
    backgroundColor: '#fff',
  },
  lottie: {
    width: 180,
    height: 180,
  },
  delete_message_text_left: {
    textAlign: 'left',
    fontSize: 12,
    color: '#777777',
    backgroundColor: '#dcdcdc',
    borderRadius: 10,
    overflow: 'hidden',
    width: '70%',
    marginLeft: 20,
    padding: 10,
    marginTop: 15,
  },
  delete_message_text_right: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#777777',
    backgroundColor: '#dcdcdc',
    borderRadius: 10,
    overflow: 'hidden',
    width: '70%',
    marginRight: 20,
    padding: 10,
    marginTop: 15,
  },
  message_container_in: {
    maxWidth: 300,
    backgroundColor: '#dcdcdc',
    alignSelf: 'flex-start',
    borderRadius: 15,
    marginVertical: 10,
    padding: 10,
    marginHorizontal: 20,
  },
  message_container_out: {
    maxWidth: 300,
    backgroundColor: design.theme_color_parent,
    alignSelf: 'flex-end',
    borderRadius: 10,
    marginVertical: 10,
    padding: 10,
    marginHorizontal: 20,
  },
  container2: {
    flex: 1,
  },
  lottie: {
    width: 180,
    height: 180,
  },
  list: {
    paddingHorizontal: 5,
  },
  footer: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    padding: 5,
  },
  btnSend: {
    backgroundColor: design.theme_color_parent,
    width: 40,
    height: 40,
    borderRadius: 360,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSend: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  iconAttach: {
    width: 20,
    height: 20,
    alignSelf: 'center',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#eeeeee',
    borderRadius: 30,
    borderBottomWidth: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
    marginLeft: 10,
  },
  inputs: {
    height: 40,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  balloon: {
    maxWidth: 200,

    borderRadius: 5,
    flexDirection: 'row',
  },
  in_text: {
    fontSize: 16,
    color: '#000000',
  },
  out_text: {
    fontSize: 16,
    color: '#fff',
  },
  d_text_in: {
    fontSize: 12,
    color: '#a9a9a9',
    textAlign: 'left',
    marginTop: 5,
  },
  d_text_out: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'right',
    marginTop: 5,
  },
  itemIn: {
    alignSelf: 'flex-start',
  },
  itemOut: {
    alignSelf: 'flex-end',
  },
  time: {
    alignSelf: 'flex-end',
    margin: 15,
    fontSize: 12,
    color: '#808080',
  },
  item: {
    marginVertical: 14,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#eeeeee',
    borderRadius: 30,
  },
  rightContainer: {
    justifyContent: 'flex-end',
    width: '100%',
  },
  leftContainer: {
    justifyContent: 'flex-start',
    width: '100%',
  },

  left_view: {
    backgroundColor: '#dadada',
    marginTop: 10,
    marginRight: 50,
    marginLeft: 10,
    textAlign: 'left',
    padding: 8,
    borderRadius: 10,
    fontSize: 17,
    fontFamily: 'HiraMaruPro-W4',
    color: '#000000',
  },
  right_view: {
    backgroundColor: '#11d1ad',
    marginTop: 10,
    textAlign: 'right',
    marginLeft: 50,
    right: 10,
    padding: 8,
    borderRadius: 10,
    fontSize: 17,
    fontFamily: 'HiraMaruPro-W4',
    color: '#000000',
  },

  search_therapist: {
    color: '#000000',
    width: '90%',
    fontSize: 15,
    marginLeft: 28,
    fontFamily: 'HiraMaruPro-W4',
  },
  search_therapist_ar: {
    color: '#000000',
    width: '90%',
    fontSize: 15,
    marginLeft: 28,
    fontFamily: 'HiraMaruPro-W4',
  },
  doctor_name: {
    fontSize: 17,
    fontFamily: 'HiraMaruPro-W4',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: 7,
    marginLeft: 10,
    paddingTop: Platform.OS == 'ios' ? 10 : 5,
  },
  backpress: {
    flexDirection: 'row',
    width: '10%',
    bottom: 6,
  },
  backpress_ar: {
    flexDirection: 'row',
    width: '10%',
    bottom: 6,
    marginLeft: -10,
  },
  image_name: {
    flexDirection: 'row',
    width: '60%',
    marginLeft: 12,
  },
  image_name_ar: {
    flexDirection: 'row',
    width: '60%',
    marginRight: -10,
  },
  call_section: {
    flexDirection: 'row',
    width: '30%',
  },

  toolbar: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 20,
  },
  bottomView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    position: 'absolute', //Here is the trick
    bottom: Platform.OS === 'ios' ? 20 : 0,
  },
  bottom_bar: {
    width: '100%',
    flexDirection: 'row',
  },
  message_type: {
    flexDirection: 'row',
    width: '60%',
  },
  recording: {
    flexDirection: 'row',
    width: '20%',
  },
  add_card_text_2: {
    fontSize: 20,
    color: '#000000',
    marginLeft: 10,
    textAlign: 'center',
    marginVertical: 15,
  },
  input: {
    paddingBottom: Platform.OS === 'ios' ? 5 : 0,
    textAlign: 'center',
    fontSize: 18,
    marginTop: 10,
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
});
