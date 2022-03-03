import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {DELETE, GET, getJWTToken, PATCH, POST} from './helpers';

export const getAllShops = createAsyncThunk(
  'shops/getAllShops',
  async (_, {getState}) => {
    const token = await getJWTToken();
    const shops = await GET(token, '/shop', {});
    return shops;
  },
);
export const getAllShopFromCategory = createAsyncThunk(
  'shops/getAllShopFromCategory',
  async (id, {getState}) => {
    const token = await getJWTToken();
    const shops = await GET(token, '/shop/all', {category_id: id});
    return shops;
  },
);
export const getNearbyShops = createAsyncThunk(
  'shops/getNeabyShops',
  async (_, {getState}) => {
    const token = await getJWTToken();
    const shops = await GET(token, '/shop/nearby', {});
    return shops;
  },
);
export const orderShop = async (data) => {
  const token = await getJWTToken();
  await POST(token, '/shop/order', data);
};
export const addShop = async (data) => {
  const token = await getJWTToken();
  await POST(token, '/shop', data);
};
export const getOneShop = async (id) => {
  const token = await getJWTToken();
  return await GET(token, '/shop/' + id, {});
};
export const updateShop = async (data) => {
  const token = await getJWTToken();
  await PATCH(token, '/shop', data);
};
export const deleteShop = async (data) => {
  const token = await getJWTToken();
  await DELETE(token, '/shop', data);
};
export const searchShopAndProducts = async (keyword) => {
  const token = await getJWTToken();
  return await GET(token, '/search/' + keyword, {});
};
// export const
export const shopSlice = createSlice({
  name: 'shop',
  initialState: {
    list: [],
    loading: false,
    errorMessage: '',
  },
  reducers: {
    setList: (state, action) => {
      state.list = action.payload;
    },
  },
  extraReducers: {
    [getAllShops.fulfilled]: (state, action) => {
      state.loading = false;
      const {data, status, message} = action.payload;
      if (status === false) {
        state.errorMessage = message;
      } else {
        state.list = data;
      }
    },
    [getAllShops.pending]: (state, action) => {
      state.loading = true;
    },
    [getAllShops.rejected]: (state, action) => {
      state.loading = false;
      console.log(action.error);
      state.errorMessage = action.error.message;
    },
    [getNearbyShops.fulfilled]: (state, action) => {
      state.loading = false;
      const {data, status, message} = action.payload;
      if (status === false) {
        state.errorMessage = message;
      } else {
        state.list = data;
      }
    },
    [getNearbyShops.pending]: (state, action) => {
      state.loading = true;
    },
    [getNearbyShops.rejected]: (state, action) => {
      state.loading = false;
      console.log(action.error);
      state.errorMessage = action.error.message;
    },

    [getAllShopFromCategory.fulfilled]: (state, action) => {
      state.loading = false;
      const {data, status, message} = action.payload;
      if (status === false) {
        state.errorMessage = message;
      } else {
        state.list = data;
      }
    },
    [getAllShopFromCategory.pending]: (state, action) => {
      state.loading = true;
    },
    [getAllShopFromCategory.rejected]: (state, action) => {
      state.loading = false;
      console.log(action.error);
      state.errorMessage = action.error.message;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setList} = shopSlice.actions;

export default shopSlice.reducer;
