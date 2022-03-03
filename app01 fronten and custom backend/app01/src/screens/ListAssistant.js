import React, {Component, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  Dimensions,
  ToastAndroid,
  Alert,
  Text,
} from 'react-native';
import Header from './Header';
import AnimatedLoader from 'react-native-animated-loader';
import {useDispatch, useSelector} from 'react-redux';
import {FlatList} from 'react-native-gesture-handler';
import {Avatar, Dialog, List} from 'react-native-paper';
import {APP_CONFIG} from '../../config';
import FitImage from 'react-native-fit-image';
import {deleteAssistant, getAllAssistant} from '../redux/assistantSlice';
import {DialogContent, ScaleAnimation} from 'react-native-popup-dialog';
import {setLatlng} from '../redux/locationSlice';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingBottom: Platform.OS == 'ios' ? 80 : 65,
  },
  lottie: {
    width: 200,
    height: 200,
  },
  add_card_text: {
    fontSize: 20,
    color: '#000000',
    marginLeft: 10,
  },
  options: {
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    paddingBottom: Platform.OS === 'ios' ? 5 : 0,
    marginHorizontal: 40,
    fontSize: 18,
    marginTop: 15,
  },
});

const {width, height} = Dimensions.get('window');
export default function ListAssistant({navigation}) {
  const {list, loading} = useSelector((state) => state.assistant);
  const [option, setOption] = useState(false);
  const [selected, setSelected] = useState();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllAssistant());
  }, []);
  const deleteAss = async () => {
    await deleteAssistant(selected);
    setOption(false);
    dispatch(getAllAssistant());
  };
  const onSelect = (item) => {
    setSelected(item);
    setOption(true);
  };
  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      <AnimatedLoader
        visible={loading}
        overlayColor="rgba(255,255,255,0.15)"
        source={require('./loader.json')}
        animationStyle={styles.lottie}
        speed={1}
      />
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Add_Assistant', {
            shop_id: navigation.getParam('shop_id'),
          });
        }}
        style={{flexDirection: 'row', marginLeft: 30, marginTop: 25}}>
        <Image
          style={{width: 30, height: 30, resizeMode: 'contain'}}
          source={require('./images/add_new.png')}
        />
        <Text style={styles.add_card_text}>Add Assistant</Text>
      </TouchableOpacity>

      <FlatList
        data={list}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{paddingHorizontal: 20, paddingTop: 10}}
        renderItem={({item, index}) => (
          <List.Item
            title={item.first_name + ' ' + item.last_name}
            description={item.email}
            left={() => (
              <Avatar.Image
                size={50}
                source={
                  item.avatar
                    ? {
                        uri:
                          APP_CONFIG.backend_url +
                          '/image/avatar/' +
                          item.avatar,
                      }
                    : require('./images/avatar.png')
                }
              />
            )}
            right={() => (
              <TouchableOpacity onPress={() => onSelect(item)}>
                <FitImage
                  style={{
                    width: 30,
                    height: 30,
                    resizeMode: 'contain',
                    overflow: 'hidden',
                  }}
                  source={require('./images/dots.png')}
                />
              </TouchableOpacity>
            )}
          />
        )}
      />

      <Dialog
        width={0.9}
        visible={option}
        onDismiss={() => setOption(false)}
        dialogAnimation={new ScaleAnimation()}
        onHardwareBackPress={() => {
          setOption(false);
          return true;
        }}>
        <DialogContent>
          <View>
            {/* <Text style={styles.options}>QR</Text> */}
            <TouchableOpacity onPress={() => deleteAss()}>
              <Text style={styles.options}>Delete</Text>
            </TouchableOpacity>
          </View>
        </DialogContent>
      </Dialog>
    </View>
  );
}
