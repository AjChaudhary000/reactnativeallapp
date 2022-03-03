import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {APP_CONFIG} from '../../config';
import {
  GET,
  getJWTToken,
  PATCH,
  saveJWTToken,
  saveType,
  getType,
} from './helpers';
import {userSlice} from './userSlice';

export const restoreUserToken = createAsyncThunk('user/token', async () => {
  const token = await getJWTToken();
  const type = await getType();
  return {token, type};
});
export const tokenSlice = createSlice({
  name: 'token',
  initialState: {
    token: '',
    type: '',
    loading: false,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    clearUser: (state, action) => {
      state.token = '';
      state.type = '';
    },
  },
  extraReducers: {
    [restoreUserToken.fulfilled]: (state, action) => {
      state.loading = false;
      const {token, type} = action.payload;
      state.token = token || '';
      state.type = type || '';
    },
    [restoreUserToken.pending]: (state, _) => {
      state.loading = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const {clearUser, setType, setToken} = tokenSlice.actions;

export default userSlice.reducer;
