import AsyncStorage from '@react-native-community/async-storage';
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {DELETE, GET, getJWTToken, PATCH, POST} from './helpers';

const saveFavs = async (favs) => {
  await AsyncStorage.setItem('@favs', JSON.stringify(favs));
};
const getFavs = async () => {
  return JSON.parse(await AsyncStorage.getItem('@favs')) || [];
};

export const checkFav = (list, id) => {
  return list.includes(id);
};
export const addFav = createAsyncThunk(
  'fav/addFav',
  async (data, {getState}) => {
    let favs = await getFavs();
    favs.push(data);
    await saveFavs(favs);
    return favs;
  },
);
export const restoreFavs = createAsyncThunk(
  'fav/restoreFav',
  async (_, {getState}) => {
    let favs = await getFavs();
    return favs;
  },
);
export const removeFav = createAsyncThunk(
  'fav/removeFav',
  async (data, {getState}) => {
    let favs = await getFavs();
    favs = favs.filter((item) => item !== data);
    await saveFavs(favs);
    return favs;
  },
);
export const fetchFavs = createAsyncThunk(
  'fav/fetchFavs',
  async (_, {getState}) => {
    let favs = await getFavs();
    const token = await getJWTToken();
    return await POST(token, '/fav', {data: favs});
  },
);
// export const
export const favSlice = createSlice({
  name: 'fav',
  initialState: {
    list: [],
    remoteData: {
      shops: [],
      products: [],
    },
    loading: false,
  },
  reducers: {},
  extraReducers: {
    [addFav.fulfilled]: (state, action) => {
      state.list = action.payload;
    },
    [removeFav.fulfilled]: (state, action) => {
      state.list = action.payload;
    },
    [restoreFavs.fulfilled]: (state, action) => {
      state.list = action.payload;
    },
    [fetchFavs.fulfilled]: (state, action) => {
      state.loading = false;
      const {data, status, message} = action.payload;
      if (status === false) {
        // state.errorMessage = message;
      } else {
        state.remoteData = data;
        // state.remoteData.shops = data.shops;
        // state.remoteData.products = data.products;
      }
    },
    [fetchFavs.pending]: (state, action) => {
      state.loading = true;
    },
  },
});

// Action creators are generated for each case reducer function
// export const {} = categoriesSlice.actions;

export default favSlice.reducer;
