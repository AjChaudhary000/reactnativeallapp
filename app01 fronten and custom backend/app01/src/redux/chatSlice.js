import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {DELETE, GET, getJWTToken, PATCH, POST} from './helpers';
export const getInfo = createAsyncThunk(
  'chat/getInfo',
  async (id, {getState}) => {
    const token = await getJWTToken();
    const profile = await GET(token, '/user/' + id, {});
    return profile;
  },
);

export const getChats = createAsyncThunk(
  'chat/getChats',
  async (_, {getState}) => {
    const token = await getJWTToken();
    const chats = await GET(token, '/chat', {});
    return chats;
  },
);

export const getShopChats = createAsyncThunk(
  'chat/getShopChats',
  async (id, {getState}) => {
    const token = await getJWTToken();
    const chats = await GET(token, '/chat/shop/' + id, {});
    return chats;
  },
);
export const postChat = async (data) => {
  const token = await getJWTToken();
  const chats = await POST(token, '/chat', data);
  return chats;
};
export const postChatUser = async (data) => {
  const token = await getJWTToken();
  const chats = await POST(token, '/chat/user', data);
  return chats;
};
export const getChatsForShop = async (shop_id) => {
  const token = await getJWTToken();
  return await GET(token, '/chat/' + shop_id, {});
};
export const getChatsForUser = async (user_id, shop_id) => {
  const token = await getJWTToken();
  return await GET(token, '/chat/user/' + user_id, {shop_id});
};
export const filterById = (data, id) => {
  if (data.length === 0 || id === null) {
    return [];
  }
  return data.filter((d) => d.to === id || d.from === id);
};
// export const
export const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    to: {_id: null},
    loading: false,
    errorMessage: '',
    list: [],
    selected: 0,
    shop_list: [],
  },
  reducers: {
    set_selected: (state, action) => {
      state.selected = action.payload;
    },
  },
  extraReducers: {
    [getInfo.fulfilled]: (state, action) => {
      state.loading = false;
      const {data, status, message} = action.payload;
      if (status === false) {
        state.errorMessage = message;
      } else {
        state.to = data;
      }
    },
    [getInfo.pending]: (state, action) => {
      state.loading = true;
    },
    [getInfo.rejected]: (state, action) => {
      state.loading = false;
      console.log(action.error);
      state.errorMessage = action.error.message;
    },

    [getChats.fulfilled]: (state, action) => {
      state.loading = false;
      const {data, status, message} = action.payload;
      if (status === false) {
        state.errorMessage = message;
      } else {
        state.list = data;
      }
    },
    [getChats.pending]: (state, action) => {
      state.loading = true;
      state.list = [];
    },
    [getChats.rejected]: (state, action) => {
      state.loading = false;
      console.log(action.error);
      state.errorMessage = action.error.message;
    },
    [getShopChats.fulfilled]: (state, action) => {
      state.loading = false;
      const {data, status, message} = action.payload;
      if (status === false) {
        state.errorMessage = message;
      } else {
        state.shop_list = data;
      }
    },
    [getShopChats.pending]: (state, action) => {
      state.loading = true;
    },
    [getShopChats.rejected]: (state, action) => {
      state.loading = false;
      console.log(action.error);
      state.errorMessage = action.error.message;
    },
  },
});

// Action creators are generated for each case reducer function
export const {set_selected} = chatSlice.actions;

export default chatSlice.reducer;
