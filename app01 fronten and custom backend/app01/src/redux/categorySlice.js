import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {APP_CONFIG} from '../../config';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import {GET, getJWTToken, POST} from './helpers';

export const getAllCategories = createAsyncThunk(
  'categories/getAllCategories',
  async (_, {getState}) => {
    const token = await getJWTToken();
    const cats = await GET(token, '/categories', {});
    return cats;
  },
);
export const addCategory = createAsyncThunk(
  'categories/addCategory',
  async (obj, {getState}) => {
    const token = await getJWTToken();
    const cats = await POST(token, '/categories', obj);
    return cats;
  },
);
export const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    list: [],
    loading: false,
    errorMessage: '',
  },
  reducers: {},
  extraReducers: {
    [getAllCategories.fulfilled]: (state, action) => {
      state.loading = false;
      const {categories, status, message} = action.payload;
      if (status === false) {
        state.errorMessage = message;
      } else {
        state.list = categories;
      }
    },
    [getAllCategories.pending]: (state, action) => {
      state.loading = true;
    },
    [addCategory.fulfilled]: (state, action) => {
      state.loading = false;
      const {categories, status, message} = action.payload;
      if (status === false) {
        state.errorMessage = message;
      } else {
        state.list = categories;
      }
    },
    [addCategory.pending]: (state, action) => {
      state.loading = true;
    },
    [addCategory.rejected]: (state, action) => {
      state.loading = false;
      console.log(action.error);
      state.errorMessage = action.error.message;
    },
  },
});

// Action creators are generated for each case reducer function
// export const {} = categoriesSlice.actions;

export default categoriesSlice.reducer;
