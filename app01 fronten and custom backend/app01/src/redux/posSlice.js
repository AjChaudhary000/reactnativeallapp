import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {APP_CONFIG} from '../../config';
import {GET, getJWTToken, POST} from './helpers';

export const getQRImage = async () => {
  const token = await getJWTToken();
  return await GET(token, '/qr', {});
};

// export const cartSlice = createSlice({
//   name: 'cart',
//   initialState: {
//     products: [],
//     total: 0,
//     shop_id: '12',
//     charges: 0,
//     charge_type: 'pickup',
//     discount_percent: 2,
//     payment_type: 'pay01',
//   },
//   reducers: {
//     set_charge_type(state, action) {
//       state.charge_type = action.payload;
//       state.charges = charges[action.payload];
//     },
//     set_discount_percent(state, action) {
//       state.payment_type = action.payload;
//       state.discount_percent = payment[action.payload];
//     },
//     add_product(state, action) {
//       let product = {...action.payload};
//       let copy = [...state.products];
//       state.total += product.selling_price;
//       for (let i = 0; i < copy.length; i++) {
//         if (copy[i]._id === product._id) {
//           copy[i].quantity++;
//           state.products = copy;
//           return;
//         }
//       }
//       product.quantity = 1;
//       state.shop_id = product.shop_id;
//       state.products.push(product);
//     },
//     remove_product(state, action) {
//       const product = {...action.payload};
//       let copy = [...state.products];
//       state.total -= product.selling_price;
//       for (let i = 0; i < copy.length; i++) {
//         if (copy[i]._id === product._id) {
//           if (copy[i].quantity === 1) {
//             copy.splice(i, 1);
//             state.shop_id = '';
//           } else {
//             copy[i].quantity--;
//           }
//           state.products = copy;
//         }
//       }
//     },
//     clear_cart(state) {
//       state.products = [];
//       state.total = 0;
//       state.shop_id = '';
//     },
//   },
//   extraReducers: {},
// });

// // Action creators are generated for each case reducer function
// export const {
//   set_charge_type,
//   set_discount_percent,
//   add_product,
//   remove_product,
//   clear_cart,
// } = cartSlice.actions;

// export default cartSlice.reducer;
