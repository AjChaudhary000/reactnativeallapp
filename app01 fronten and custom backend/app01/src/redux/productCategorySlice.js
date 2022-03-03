import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {APP_CONFIG} from '../../config';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import {DELETE, GET, getJWTToken, PATCH, POST} from './helpers';
import {updateApplePaySummaryItems} from '@stripe/stripe-react-native';

export const getAllProductCategories = createAsyncThunk(
  'productCategories/getAllProductCategories',
  async (shop_id, {getState}) => {
    const token = await getJWTToken();
    const cats = await GET(token, '/productCategories', {shop_id: shop_id});
    return cats;
  },
);
export const addProductCategory = createAsyncThunk(
  'addCategories/addProductCategory',
  async (obj, {getState}) => {
    const token = await getJWTToken();
    const cats = await POST(token, '/productCategories', obj);
    return cats;
  },
);
export const deleteProductCategory = createAsyncThunk(
  'addCategories/deleteProductCategory',
  async (obj, {getState}) => {
    const token = await getJWTToken();
    const cats = await DELETE(token, '/productCategories', obj);
    return cats;
  },
);
export const updateProductCategory = createAsyncThunk(
  'addCategories/deleteProductCategory',
  async (obj, {getState}) => {
    const token = await getJWTToken();
    const cats = await PATCH(token, '/productCategories', obj);
    return cats;
  },
);
export const getAllProductCategoriesByShopId = async (shopid) => {
  const token = await getJWTToken();
  return await GET(token, '/productCategories/' + shopid, {});
};
export const orderProductCategory = async (data) => {
  const token = await getJWTToken();
  await POST(token, '/productCategories/order', data);
};
export const categoriesSlice = createSlice({
  name: 'product_categories',
  initialState: {
    list: [],
    loading: false,
    errorMessage: '',
  },
  reducers: {
    setProductCategoryList: (state, action) => {
      state.list = action.payload;
    },
  },
  extraReducers: {
    [getAllProductCategories.fulfilled]: (state, action) => {
      state.loading = false;
      const {categories, status, message} = action.payload;
      if (status === false) {
        state.errorMessage = message;
      } else {
        state.list = categories;
      }
    },
    [getAllProductCategories.pending]: (state, action) => {
      state.loading = true;
    },
    [addProductCategory.fulfilled]: (state, action) => {
      state.loading = false;
      const {categories, status, message} = action.payload;
      if (status === false) {
        state.errorMessage = message;
      } else {
        state.list = categories;
      }
    },
    [addProductCategory.pending]: (state, action) => {
      state.loading = true;
    },
    [addProductCategory.rejected]: (state, action) => {
      state.loading = false;
      console.log(action.error);
      state.errorMessage = action.error.message;
    },
    [updateProductCategory.fulfilled]: (state, action) => {
      state.loading = false;
      const {categories, status, message} = action.payload;
      if (status === false) {
        state.errorMessage = message;
      } else {
        state.list = categories;
      }
    },
    [updateProductCategory.pending]: (state, action) => {
      state.loading = true;
    },
    [updateProductCategory.rejected]: (state, action) => {
      state.loading = false;
      console.log(action.error);
      state.errorMessage = action.error.message;
    },
    [deleteProductCategory.fulfilled]: (state, action) => {
      state.loading = false;
      const {categories, status, message} = action.payload;
      if (status === false) {
        state.errorMessage = message;
      } else {
        state.list = categories;
      }
    },
    [deleteProductCategory.pending]: (state, action) => {
      state.loading = true;
    },
    [deleteProductCategory.rejected]: (state, action) => {
      state.loading = false;
      console.log(action.error);
      state.errorMessage = action.error.message;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setProductCategoryList} = categoriesSlice.actions;

export default categoriesSlice.reducer;
