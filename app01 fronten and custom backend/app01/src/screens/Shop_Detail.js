import React, {Component} from 'react';
import {
  Text,
  Image,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  View,
  AsyncStorage,
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
import DraggableFlatList from 'react-native-draggable-flatlist';
let rootRef;
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
import Toast from 'react-native-simple-toast';
import {addCategory, getAllCategories} from '../redux/categorySlice';
import {connect} from 'react-redux';
import {
  addProductCategory,
  deleteProductCategory,
  getAllProductCategories,
  updateProductCategory,
  orderProductCategory,
  setProductCategoryList,
} from '../redux/productCategorySlice';
import {addFav, removeFav} from '../redux/favSlice';
let user_id = '';
let arr_category = [];
let selected_index;
class Shop_Detail extends Component {
  constructor(props) {
    super(props);
    (this.categoryies = []),
      (this.state = {
        Add_Category_Dialog: false,
        Edit_Category_Dialog: false,
        Delete_Category_Dialog: false,
        Add_product_dialog: false,
        edit_cat_name: '',
        delete_cat_name: '',
        drag_drop: false,
        categoryHolder: [
          {
            category_name: 'Test',
            key: `item-${1}`,
          },
          {
            category_name: 'Groceries',
            key: `item-${2}`,
          },
          {
            category_name: 'Bar and Pubs',
            key: `item-${3}`,
          },
          {
            category_name: 'Resturents',
            key: `item-${4}`,
          },
        ],
        category_name: '',
        category_list: [],
        select_category_index: 0,
        duplicate_arr: [],
        category_id: '',
        shop_name: '',
        shop_description: '',
        shop_image: '',
        shop_delivery_status: '',
        latitude: 0.0,
        longitude: 0.0,
        sno: 0,
      });
  }
  componentDidMount = () => {
    const shop_id = this.props.navigation.getParam('shop_id');
    this.props.getAllProductCategories(shop_id);
  };

  // update_shop = (object) => {
  //   var self = this;
  //   setTimeout(() => {
  //     this.setState({spinner: false});
  //     const closest = object.sort((a, b) => a.sno - b.sno);
  //     self.setState({category_list: closest});
  //   }, 1000);
  // };
  backpress = () => {
    this.props.navigation.goBack();
  };
  add_cat = () => {
    this.setState({Add_Category_Dialog: true});
  };
  Edit_dialog = () => {
    this.setState({Edit_Category_Dialog: true});
  };
  Delete_dialog = () => {
    this.setState({Delete_Category_Dialog: true});
  };

  // confirm_delete_ok = () => {
  //   var adaRef = firebase
  //     .database()
  //     .ref('shop_category/' + shop_id + '/' + this.state.category_id);
  //   adaRef.remove();
  //   this.setState({Delete_Category_Dialog: false});
  //   this.setState({shop_option_dialog: false});
  // };
  Add_product = (id) => {
    this.props.navigation.navigate('Add_products', {
      shop_id: this.props.navigation.getParam('shop_id'),
      category_id: id,
    });
  };

  add_categoory_button = () => {
    if (this.state.category_name.length === 0) {
      alert('Category cannot be empty');
    }
    const shop_id = this.props.navigation.getParam('shop_id');
    this.props.addProductCategory({name: this.state.category_name, shop_id});
    this.setState({Add_Category_Dialog: false});
  };
  move_category = () => {
    this.setState({drag_drop: true, shop_option_dialog: false});
  };
  order = (data) => {
    this.props.setProductCategoryList(data);
    this.setState({drag_drop: false});
    const list = data.map((d) => d._id);
    orderProductCategory({list});
  };
  delete = () => {
    this.props.deleteProductCategory({_id: this.state.category_id});
    this.setState({Delete_Category_Dialog: false});
    this.setState({shop_option_dialog: false});
  };
  update = () => {
    this.props.updateProductCategory({
      _id: this.state.category_id,
      name: this.state.category_name,
    });
    this.setState({Edit_Category_Dialog: false});
    this.setState({shop_option_dialog: false});
  };
  shop_option = (name, id) => {
    this.setState({shop_option_dialog: true});
    this.setState({category_name: name});
    this.setState({category_id: id});
  };
  render() {
    // const {navigation} = this.props;
    // shop_id = navigation.getParam('shop_id', 'null');
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
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 15,
              marginBottom: 15,
              width: '80%',
            }}>
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
          {/* 
          {this.state.drag_drop == true ? (
            <TouchableOpacity onPress={() => this.done_top()}>
              <Text style={styles.done_text}>Done</Text>
            </TouchableOpacity>
          ) : null} */}
        </View>
        <TouchableOpacity
          onPress={() => this.add_cat()}
          style={{flexDirection: 'row', marginLeft: 30, marginTop: 25}}>
          <Image
            style={{width: 30, height: 30, resizeMode: 'contain'}}
            source={require('./images/add_new.png')}
          />
          <Text style={styles.add_card_text}>Add category</Text>
        </TouchableOpacity>

        <DraggableFlatList
          horizontal={false}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          data={this.props.categories}
          renderItem={({item, index, drag}) => (
            <View style={{flexDirection: 'row', marginLeft: 30, marginTop: 25}}>
              {this.state.drag_drop == true ? (
                <TouchableOpacity
                  style={{
                    width: '15%',
                  }}
                  onLongPress={drag}>
                  <FitImage
                    style={{
                      width: 30,
                      height: 30,
                      resizeMode: 'contain',
                      overflow: 'hidden',
                    }}
                    source={require('./images/drag.png')}
                  />
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={{width: '84%'}}
                onPress={() => this.Add_product(item._id)}>
                <Text style={styles.cardno_text}>{item.name}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.shop_option(item.name, item._id)}
                style={{
                  width: '15%',
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  paddingRight: 24,
                }}>
                <Image
                  style={{width: 30, height: 30, resizeMode: 'contain'}}
                  source={require('./images/dots.png')}
                />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => `draggable-item-${item._id}`}
          onDragEnd={({data}) => this.order(data)}
        />
        <Dialog
          onTouchOutside={() => {
            this.setState({shop_option_dialog: false});
          }}
          width={0.9}
          visible={this.state.shop_option_dialog}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            console.log('onHardwareBackPress');
            this.setState({shop_option_dialog: false});
            return true;
          }}
          actions={[
            <DialogButton
              text="DISMISS"
              onPress={() => {
                this.setState({shop_option_dialog: false});
              }}
              key="button-1"
            />,
          ]}>
          <DialogContent>
            <View>
              <TouchableOpacity onPress={() => this.Delete_dialog()}>
                <Text style={styles.dialog_input}>Delete Category</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.Edit_dialog()}>
                <Text style={styles.dialog_input}>Update Category</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.move_category()}>
                <Text style={styles.dialog_input}>Move Category</Text>
              </TouchableOpacity>
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          onTouchOutside={() => {
            this.setState({Add_Category_Dialog: false});
          }}
          width={0.9}
          visible={this.state.Add_Category_Dialog}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            console.log('onHardwareBackPress');
            this.setState({Add_Category_Dialog: false});
            return true;
          }}
          actions={[
            <DialogButton
              text="DISMISS"
              onPress={() => {
                this.setState({Add_Category_Dialog: false});
              }}
              key="button-1"
            />,
          ]}>
          <DialogContent>
            <View>
              <Text style={styles.add_card_text_2}>Add Category</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                placeholder={'Category Name'}
                returnKeyLabel={'next'}
                onChangeText={(text) => this.setState({category_name: text})}
              />
              <TouchableOpacity
                onPress={() => this.add_categoory_button()}
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
            this.setState({Edit_Category_Dialog: false});
          }}
          width={0.9}
          visible={this.state.Edit_Category_Dialog}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            console.log('onHardwareBackPress');
            this.setState({Edit_Category_Dialog: false});
            return true;
          }}
          actions={[
            <DialogButton
              text="DISMISS"
              onPress={() => {
                this.setState({Edit_Category_Dialog: false});
              }}
              key="button-1"
            />,
          ]}>
          <DialogContent>
            <View>
              <Text style={styles.add_card_text_2}>Edit Category</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                placeholder={'Category Name'}
                returnKeyLabel={'next'}
                value={this.state.category_name}
                onChangeText={(text) => this.setState({category_name: text})}
              />
              <TouchableOpacity
                onPress={() => this.update()}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 50,
                }}>
                <Text style={styles.pay_text}>Update</Text>
              </TouchableOpacity>
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          onTouchOutside={() => {
            this.setState({Delete_Category_Dialog: false});
          }}
          width={0.9}
          visible={this.state.Delete_Category_Dialog}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            console.log('onHardwareBackPress');
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
              <Text style={styles.add_card_text_2}>Delete Category</Text>
              <Text style={styles.add_card_text_2}>
                {this.state.category_name}
              </Text>
              <TouchableOpacity
                onPress={() => this.delete()}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 50,
                }}>
                <Text style={styles.pay_text}>Ok</Text>
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
    getAllProductCategories: (shop_id) =>
      dispatch(getAllProductCategories(shop_id)),
    addProductCategory: (obj) => dispatch(addProductCategory(obj)),
    deleteProductCategory: (obj) => dispatch(deleteProductCategory(obj)),
    updateProductCategory: (obj) => dispatch(updateProductCategory(obj)),
    setProductCategoryList: (list) => dispatch(setProductCategoryList(list)),
  };
};
const mapStateToProps = (state) => {
  return {
    categories: state.product_categories.list,
    loading: state.product_categories.loading,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Shop_Detail);

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
    marginTop: 10,
  },
});
