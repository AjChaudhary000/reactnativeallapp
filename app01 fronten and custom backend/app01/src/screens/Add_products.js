import React, {Component} from 'react';
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
import ImagePicker, {launchImageLibrary} from 'react-native-image-picker';
import firebase from 'firebase';
import AnimatedLoader from 'react-native-animated-loader';
import Toast from 'react-native-simple-toast';
import DraggableFlatList from 'react-native-draggable-flatlist';
import {connect} from 'react-redux';
import {getAllProductCategories} from '../redux/productCategorySlice';
import {
  addProduct,
  deleteProduct,
  getProductFromShop,
  updateProduct,
  setProductList,
  orderProducts,
} from '../redux/productSlice';
import {APP_CONFIG} from '../../config';
import {calculateDiscountPercent} from '../utils';

class Add_products extends Component {
  constructor(props) {
    super(props);

    this.state = {
      product_name: '',
      product_description: '',
      product_price: '',
      product_discount: '',
      test: true,
      selected_product_avalable_status: false,
      selling_price: '',
      drag_drop: false,
      productList: [],
      images: [],
      selected_index: 0,
      Add_product_dialog: false,
      add_product_loading: false,
      product_action_dialog: false,
      confirmation_dialog: false,
      product_stock_indicator: false,
    };
  }
  move_product = () => {
    this.setState({drag_drop: true, product_action_dialog: false});
  };
  backpress = () => {
    this.props.navigation.goBack();
  };
  componentDidMount = () => {
    const shop_id = this.props.navigation.getParam('shop_id');
    const category_id = this.props.navigation.getParam('category_id');
    this.props.getProductFromShop(shop_id, category_id);
  };

  add_product = () => {
    this.setState({
      Add_product_dialog: true,
      selected_index: null,
      product_description: '',
      product_name: '',
      selling_price: '',
      product_price: '',
      images: [],
    });
  };
  order = (data) => {
    this.props.setProducts(data);
    this.setState({drag_drop: false});
    const list = data.map((d) => d._id);
    orderProducts({list});
  };
  switch_button = (value, position) => {
    const newArray = [...this.state.categoryHolder];
    newArray[position].status = value;
    this.setState({categoryHolder: newArray});
  };

  chooseFile = () => {
    if (this.state.images.length > 5) {
      Toast.show('Add Maximum 6 Images');
    } else {
      var options = {
        mediaType: 'photo',
        selectionLimit: 0,
        quality: 0.5,
        includeBase64: true,
      };

      launchImageLibrary(options, (response) => {
        this.setState({
          images: [
            ...response.assets.filter((d) => d.type !== null),
            ...this.state.images,
          ],
        });
      });
    }
  };
  add_product_button = async () => {
    if (this.state.images.length == 0) {
      Toast.show('Add Product Shop Images');
    } else if (this.state.product_name == '') {
      Toast.show('Add Product Name');
    } else if (this.state.product_description == '') {
      Toast.show('Add Product Description');
    } else if (this.state.product_price == '') {
      Toast.show('Add Product Price');
    } else {
      let selling_price = this.state.selling_price;
      if (this.state.selling_price === '' || this.state.selling_price === '0') {
        selling_price = this.state.product_price;
      }
      const shop_id = this.props.navigation.getParam('shop_id');
      const category_id = this.props.navigation.getParam('category_id');
      const data = {
        category_id,
        shop_id,
        images: this.state.images,
        product_name: this.state.product_name,
        product_description: this.state.product_description,
        product_price: this.state.product_price,
        selling_price,
      };
      try {
        this.setState({add_product_loading: true});
        if (this.state.selected_index !== null) {
          await updateProduct({
            ...data,
            _id: this.props.products[this.state.selected_index]._id,
          });
        } else {
          await addProduct(data);
        }
        this.props.getProductFromShop(shop_id, category_id);
        this.setState({add_product_loading: false, Add_product_dialog: false});
      } catch (e) {
        Toast.show('Error on adding product');
      }
    }
  };
  product_status = async (value) => {
    this.setState({
      product_stock_indicator: !this.state.product_stock_indicator,
    });
    const product = this.props.products[this.state.selected_index];
    await updateProduct({
      ...product,
      product_available_status: value,
    });
    const shop_id = this.props.navigation.getParam('shop_id');
    const category_id = this.props.navigation.getParam('category_id');
    this.props.getProductFromShop(shop_id, category_id);
    this.setState({product_action_dialog: false});
  };
  product_option = (index) => {
    const product = this.props.products[index];
    this.setState({
      selected_index: index,
      product_stock_indicator: product.product_available_status,
    });
    this.setState({product_action_dialog: true});
  };
  Delete_dialog = () => {
    this.setState({product_action_dialog: false});
    this.setState({confirmation_dialog: true});
  };
  ok_button_handle = async () => {
    await deleteProduct(this.props.products[this.state.selected_index]);
    let shop_id = '60b4e3b5c9b6c030a629be29';
    this.props.getProductFromShop(shop_id);
    this.setState({confirmation_dialog: false});
    this.setState({product_action_dialog: false});
  };
  update_product = () => {
    this.setState({product_action_dialog: false});
    const product = this.props.products[this.state.selected_index];
    this.setState({
      images: product.images,
      product_name: product.product_name,
      product_description: product.product_description,
      product_price: product.product_price + '',
      selling_price: product.selling_price + '',
    });
    this.setState({Add_product_dialog: true});
  };
  drag_drop_choose = () => {
    this.setState({product_action_dialog: false});
    this.setState({drag_drop: true});
  };
  done_top = () => {
    this.setState({drag_drop: false});
    var num = 0;

    for (var a = 0; a < this.state.productList.length; a++) {
      num = num + 1;
      var adaNameRef = firebase
        .database()
        .ref('products/' + this.state.productList[a].product_id);
      adaNameRef.update({sno: num});
    }
  };
  delete_shop_image = (index) => {
    var array = [...this.state.images];
    array.splice(index, 1);
    this.setState({images: array});
  };
  render() {
    const {navigation} = this.props;
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
          {/* {this.state.drag_drop == true ? (
            <TouchableOpacity onPress={() => this.done_top()}>
              <Text style={styles.done_text}>Done</Text>
            </TouchableOpacity>
          ) : null} */}
        </View>

        <TouchableOpacity
          onPress={() => this.add_product()}
          style={{flexDirection: 'row', marginLeft: 30, marginTop: 25}}>
          <Image
            style={{width: 30, height: 30, resizeMode: 'contain'}}
            source={require('./images/add_new.png')}
          />
          <Text style={styles.add_card_text}>Add Product</Text>
        </TouchableOpacity>

        <DraggableFlatList
          horizontal={false}
          showsVerticalScrollIndicator={false}
          numColumns={1}
          data={this.props.products}
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
              <TouchableOpacity style={{flexDirection: 'row'}}>
                <View style={{width: '20%'}}>
                  <FitImage
                    style={{
                      width: 70,
                      height: 70,
                      resizeMode: 'contain',
                      borderRadius: 10,
                      overflow: 'hidden',
                    }}
                    source={{
                      uri:
                        APP_CONFIG.backend_url +
                        '/image/products/' +
                        item.images[0],
                    }}
                  />
                  {item.selling_price !== item.product_price && (
                    <View
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        backgroundColor: design.theme_color_parent,
                        width: '80%',
                        borderTopRightRadius: 7,
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          color: '#fff',
                          fontSize: 13,
                          paddingVertical: 2,
                        }}>
                        {calculateDiscountPercent(
                          item.product_price,
                          item.selling_price,
                        ) + '% off'}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={{width: '60%', marginLeft: 20}}>
                  <Text style={styles.fields_text}>{item.product_name}</Text>

                  <View style={{flexDirection: 'row'}}>
                    <Text numberOfLines={1} style={styles.pricetitle_text}>
                      €{item.selling_price}
                    </Text>

                    {item.product_price === item.selling_price ? null : (
                      <Text numberOfLines={1} style={styles.pricetitle_text_2}>
                        €{item.product_price}
                      </Text>
                    )}
                  </View>
                  <Text numberOfLines={1} style={styles.pricetitle_text}>
                    {item.product_available_status == true
                      ? ''
                      : 'Not Available'}
                  </Text>
                </View>

                <TouchableOpacity
                  style={{width: '10%'}}
                  onPress={() => this.product_option(index)}>
                  <Image
                    style={{width: 30, height: 30, resizeMode: 'contain'}}
                    source={require('./images/dots.png')}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => `draggable-item-${item._id}`}
          onDragEnd={({data}) => this.order(data)}
        />

        <Dialog
          onTouchOutside={() => {
            this.setState({Add_product_dialog: false});
          }}
          width={0.9}
          visible={this.state.Add_product_dialog}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            this.setState({Add_product_dialog: false});
            return true;
          }}
          actions={[
            <DialogButton
              text="DISMISS"
              onPress={() => {
                this.setState({Add_product_dialog: false});
              }}
              key="button-1"
            />,
          ]}>
          <DialogContent>
            <View>
              <TouchableOpacity onPress={() => this.chooseFile()}>
                <FitImage
                  style={{
                    alignSelf: 'center',
                    width: 90,
                    height: 90,
                    borderRadius: 10,
                    resizeMode: 'contain',
                    marginVertical: 20,
                    borderRadius: 10,
                    overflow: 'hidden',
                  }}
                  source={require('./images/add_shop.png')}
                />
              </TouchableOpacity>

              <View style={{marginLeft: 35}}>
                <FlatList
                  data={this.state.images}
                  horizontal
                  // onDragEnd={({data}) => this.setState({images: data})}
                  renderItem={({item, index, drag}) => (
                    <TouchableOpacity
                      onLongPress={drag}
                      style={{marginRight: 10}}>
                      <Text>Test</Text>
                      <FitImage
                        style={{
                          width: 80,
                          height: 80,
                          resizeMode: 'contain',
                          borderRadius: 10,
                          overflow: 'hidden',
                        }}
                        source={{
                          uri: item.uri
                            ? item.uri
                            : APP_CONFIG.backend_url +
                              '/image/products/' +
                              item,
                        }}
                      />

                      <TouchableOpacity
                        style={{
                          position: 'absolute',
                          top: 5,
                          right: 5,
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
                  keyExtractor={(item, index) => `draggable-thumb-${index}`}
                />
              </View>
              <AnimatedLoader
                visible={this.state.add_product_loading}
                overlayColor="rgba(255,255,255,0.15)"
                source={require('./loader.json')}
                animationStyle={styles.lottie_small}
                speed={1}
              />
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                placeholder={'Product Name'}
                value={this.state.product_name}
                onChangeText={(text) => this.setState({product_name: text})}
              />

              <TextInput
                style={styles.input}
                autoCapitalize="none"
                placeholder={'Product Description'}
                multiline={true}
                value={this.state.product_description}
                onChangeText={(text) =>
                  this.setState({product_description: text})
                }
              />
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                keyboardType="numeric"
                value={this.state.product_price}
                placeholder={'Product Price'}
                onChangeText={(text) => this.setState({product_price: text})}
              />
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                keyboardType="numeric"
                value={this.state.selling_price}
                placeholder={'Selling Price'}
                onChangeText={(text) => this.setState({selling_price: text})}
              />
              <TouchableOpacity
                onPress={() => this.add_product_button()}
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
            this.setState({product_action_dialog: false});
          }}
          width={0.9}
          visible={this.state.product_action_dialog}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            console.log('onHardwareBackPress');
            this.setState({product_action_dialog: false});
            return true;
          }}
          actions={[
            <DialogButton
              text="DISMISS"
              onPress={() => {
                this.setState({product_action_dialog: false});
              }}
              key="button-1"
            />,
          ]}>
          <DialogContent>
            <View>
              <TouchableOpacity
                onPress={() => this.setState({confirmation_dialog: true})}>
                <Text style={styles.dialog_input}>Delete Product</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.update_product()}>
                <Text style={styles.dialog_input}>Update Product</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.move_product()}>
                <Text style={styles.dialog_input}>Move Product</Text>
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 15,
                }}>
                <Switch
                  value={this.state.product_stock_indicator}
                  onValueChange={(value) => this.product_status(value)}
                />
                <Text style={styles.product_in_stock_input}>
                  Product in stock
                </Text>
              </View>
            </View>
          </DialogContent>
        </Dialog>

        <Dialog
          onTouchOutside={() => {
            this.setState({confirmation_dialog: false});
          }}
          width={0.9}
          visible={this.state.confirmation_dialog}
          dialogAnimation={new ScaleAnimation()}
          onHardwareBackPress={() => {
            console.log('onHardwareBackPress');
            this.setState({confirmation_dialog: false});
            return true;
          }}
          actions={[
            <DialogButton
              text="DISMISS"
              onPress={() => {
                this.setState({confirmation_dialog: false});
              }}
              key="button-1"
            />,
          ]}>
          <DialogContent>
            <View>
              <Text style={[styles.option_text, {textAlign: 'center'}]}>
                Delete product?
              </Text>
              <TouchableOpacity
                onPress={() => this.ok_button_handle()}
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
    getProductFromShop: (shop_id, category_id) =>
      dispatch(getProductFromShop({shop_id, category_id})),
    setProducts: (list) => dispatch(setProductList(list)),
  };
};
const mapStateToProps = (state) => {
  return {
    loading: state.product.loading,
    products: state.product.list,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Add_products);

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
  lottie_small: {
    width: 120,
    height: 120,
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
