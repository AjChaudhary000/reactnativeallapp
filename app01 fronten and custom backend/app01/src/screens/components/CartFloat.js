import React from 'react';
import {StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {useSelector} from 'react-redux';

import design from '../StyleFile';

const styles = StyleSheet.create({
  placeorder_1: {
    fontSize: 18,
    color: design.theme_color_parent,
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    textAlign: 'center',
  },
  placeorder_2: {
    width: '50%',
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
  },
  placeorder_3: {
    width: '30%',
    textAlign: 'center',
    fontSize: 20,
    color: '#fff',
  },
});
export default function CartFloat({navigation}) {
  const {products, total} = useSelector((state) => state.cart);
  const cartpage = () => {
    navigation.navigate('Tab_Cart');
  };
  const totalItems = (products) => {
    console.log(products);
    return products.reduce((acc, curr) => (acc += curr.quantity), 0);
  };
  return (
    <TouchableOpacity
      onPress={() => cartpage()}
      style={{
        marginBottom: 20,
        marginTop: 10,
        flexDirection: 'row',
        backgroundColor: '#ad0101',
        marginHorizontal: 20,
        borderRadius: 10,
        padding: 12,
      }}>
      <View style={{width: '20%'}}>
        <Text style={styles.placeorder_1}>{products.length}</Text>
      </View>

      <Text style={styles.placeorder_2}>View your cart</Text>
      <Text style={styles.placeorder_3}>€{total}</Text>
    </TouchableOpacity>
  );
}
