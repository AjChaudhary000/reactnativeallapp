import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {DELETE, GET, getJWTToken, PATCH, POST} from './helpers';

export const getProductFromShop = createAsyncThunk(
  'product/getProductFromShop',
  async ({shop_id, category_id}, {getState}) => {
    const token = await getJWTToken();
    const products = await GET(token, '/product', {shop_id, category_id});
    return products;
  },
);
export const getProductDetails = createAsyncThunk(
  'product/getProductDetails',
  async (id, {getState}) => {
    const token = await getJWTToken();
    const product = await GET(token, '/product/' + id);
    return product;
  },
);
export const orderProducts = async (data) => {
  const token = await getJWTToken();
  await POST(token, '/product/order', data);
};
export const getNearbyProduct = createAsyncThunk(
  'product/getNearbyProducts',
  async (shop_id, {getState}) => {
    const token = await getJWTToken();
    const products = await GET(token, '/product/nearby', {shop_id});
    return products;
  },
);

export const addProduct = async (data) => {
  const token = await getJWTToken();
  await POST(token, '/product', data);
};
export const updateProduct = async (data) => {
  const token = await getJWTToken();
  await PATCH(token, '/product', data);
};
export const deleteProduct = async (obj) => {
  const token = await getJWTToken();
  const cats = await DELETE(token, '/product', obj);
  return cats;
};
// export const
export const productSlice = createSlice({
  name: 'product',
  initialState: {
    list: [],
    loading: false,
    errorMessage: '',
    productDetails: {},
  },
  reducers: {
    setProductList: (state, action) => {
      state.list = action.payload;
    },
  },
  extraReducers: {
    [getProductFromShop.fulfilled]: (state, action) => {
      state.loading = false;
      const {data, status, message} = action.payload;
      if (status === false) {
        state.errorMessage = message;
      } else {
        state.list = data;
      }
    },
    [getProductFromShop.pending]: (state, action) => {
      state.loading = true;
    },
    [getProductFromShop.rejected]: (state, action) => {
      state.loading = false;
      console.log(action.error);
      state.errorMessage = action.error.message;
    },

    [getProductDetails.fulfilled]: (state, action) => {
      state.loading = false;
      const {data, status, message} = action.payload;
      if (status === false) {
        state.errorMessage = message;
      } else {
        state.productDetails = data[0];
      }
    },
    [getProductDetails.pending]: (state, action) => {
      state.loading = true;
    },
    [getProductDetails.rejected]: (state, action) => {
      state.loading = false;
      console.log(action.error);
      state.errorMessage = action.error.message;
    },
    [getNearbyProduct.fulfilled]: (state, action) => {
      state.loading = false;
      const {data, status, message} = action.payload;
      if (status === false) {
        state.errorMessage = message;
      } else {
        state.list = data;
      }
    },
    [getNearbyProduct.pending]: (state, action) => {
      state.loading = true;
    },
    [getNearbyProduct.rejected]: (state, action) => {
      state.loading = false;
      console.log(action.error);
      state.errorMessage = action.error.message;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setProductList} = productSlice.actions;

export default productSlice.reducer;
