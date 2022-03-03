import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {GET, getJWTToken, PATCH, POST} from './helpers';

export const getOrders = createAsyncThunk(
  'orders/getAllOrders',
  async (_, {getState}) => {
    const token = await getJWTToken();
    const shops = await GET(token, '/order', {});
    return shops;
  },
);
export const getShopOrders = createAsyncThunk(
  'orders/getShopOrders',
  async (id, {getState}) => {
    const token = await getJWTToken();
    const shops = await GET(token, '/order/' + id, {});
    return shops;
  },
);
export const updateOrder = async (data) => {
  const token = await getJWTToken();
  const order = await PATCH(token, '/order', data);
  return order;
};
// export const
export const orderSlice = createSlice({
  name: 'order',
  initialState: {
    list: [],
    loading: false,
    errorMessage: '',
  },
  reducers: {},
  extraReducers: {
    [getOrders.fulfilled]: (state, action) => {
      state.loading = false;
      const {data, status, message} = action.payload;
      if (status === false) {
        state.errorMessage = message;
      } else {
        state.list = data;
      }
    },
    [getOrders.pending]: (state, action) => {
      state.loading = true;
    },
    [getOrders.rejected]: (state, action) => {
      state.loading = false;
      console.log(action.error);
      state.errorMessage = action.error.message;
    },
    [getShopOrders.fulfilled]: (state, action) => {
      state.loading = false;
      const {data, status, message} = action.payload;
      if (status === false) {
        state.errorMessage = message;
      } else {
        state.list = data;
      }
    },
    [getShopOrders.pending]: (state, action) => {
      state.loading = true;
    },
    [getShopOrders.rejected]: (state, action) => {
      state.loading = false;
      console.log(action.error);
      state.errorMessage = action.error.message;
    },
  },
});

// Action creators are generated for each case reducer function
// export const {} = categoriesSlice.actions;

export default orderSlice.reducer;
