import {configureStore} from '@reduxjs/toolkit';
import userReducer from './userSlice';
import {combineReducers} from 'redux';
import catReducer from './categorySlice';
import productCatReducer from './productCategorySlice';
import shopReducer from './shopSlice';
import productReducer from './productSlice';
import cartReducer from './cartSlice';
import chatReducer from './chatSlice';
import orderReducer from './orderSlice';
import locationReducer from './locationSlice';
import favReducer from './favSlice';
import assistantReducer from './assistantSlice';
export default configureStore({
  reducer: combineReducers({
    user: userReducer,
    categories: catReducer,
    shop: shopReducer,
    product_categories: productCatReducer,
    product: productReducer,
    cart: cartReducer,
    chat: chatReducer,
    order: orderReducer,
    location: locationReducer,
    fav: favReducer,
    assistant: assistantReducer,
  }),
});
