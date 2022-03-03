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

export const restoreUserToken = createAsyncThunk('user/token', async () => {
  const token = await getJWTToken();
  const type = await getType();
  return {token, type};
});
export const getUserProfile = createAsyncThunk(
  'user/getUserProfile',
  async (_, {getState}) => {
    const token = await getJWTToken();
    const response = await GET(token, '/user', {});
    console.log(response);
    return response;
  },
);
export const updateUserProfile = async (data) => {
  const token = await getJWTToken();
  await PATCH(token, '/user', data);
};
export const getUserInfo = async (user_id) => {
  const token = await getJWTToken();
  return await GET(token, '/user/' + user_id, {});
};

export const login = async ({email, password}) => {
  const formdata = new URLSearchParams();
  formdata.append('email', email);
  formdata.append('password', password);
  const response = await fetch(APP_CONFIG.backend_url + '/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formdata.toString(),
  });
  const res = await response.json();
  if (res.status) {
    await saveJWTToken(res.token);
    await saveType(res.type);
  }
  return res;
};

export const signup = async ({
  email,
  password,
  first_name,
  last_name,
  phone,
  country,
}) => {
  const formdata = new URLSearchParams();
  formdata.append('email', email);
  formdata.append('password', password);
  formdata.append('first_name', first_name);
  formdata.append('last_name', last_name);
  formdata.append('phone', phone);
  formdata.append('country', country);
  const response = await fetch(APP_CONFIG.backend_url + '/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formdata.toString(),
  });
  const res = await response.json();
  if (res.status) {
    await saveJWTToken(res.token);
  }
  return res;
};
// export const login = createAsyncThunk(
//   'user/login',
//   async ({email, password}, thunkAPI) => {
//     const formdata = new URLSearchParams();
//     formdata.append('email', email);
//     formdata.append('password', password);
//     const response = await fetch(APP_CONFIG.backend_url + '/login', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: formdata.toString(),
//     });
//     const res = await response.json();
//     console.log(res);
//     if (res.status) {
//       await saveJWTToken(res.token);
//       await saveType(res.type);
//     }
//     return res;
//   },
// );
export const changePassword = async (data) => {
  const token = await getJWTToken();
  const res = await PATCH(token, '/user/changePassword', data);
  return res;
};
// export const signup = createAsyncThunk(
//   'user/signup',
//   async (
//     {email, password, first_name, last_name, phone, country},
//     thunkAPI,
//   ) => {
//     const formdata = new URLSearchParams();
//     formdata.append('email', email);
//     formdata.append('password', password);
//     formdata.append('first_name', first_name);
//     formdata.append('last_name', last_name);
//     formdata.append('phone', phone);
//     formdata.append('country', country);
//     const response = await fetch(APP_CONFIG.backend_url + '/signup', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       body: formdata.toString(),
//     });
//     const res = await response.json();
//     if (res.status) {
//       await saveJWTToken(res.token);
//     }
//     return res;
//   },
// );
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    loading: false,
    userDetails: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      avatar: '',
      _id: '',
    },
    errorMessage: '',
    token: '',
    type: '',
    loginErrorMessage: '',
    signupErrorMessage: '',
  },
  reducers: {
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setType: (state, action) => {
      state.type = action.payload;
    },
    loginAction: (state, action) => {
      const {type, token} = action.payload;
      state.type = type;
      state.token = token;
    },
    updateUser: (state, action) => {
      state.userDetails = {...state.userDetails, ...action.payload};
    },
    clearUser: (state, action) => {
      state.loading = false;
      state.userDetails = {};
      state.token = '';
      state.type = '';
    },
  },
  extraReducers: {
    // [login.fulfilled]: (state, action) => {
    //   state.loading = false;
    //   const {status, token, message, type} = action.payload;
    //   console.log(action.payload);
    //   if (status === false) {
    //     state.loginErrorMessage = message;
    //   } else {
    //     state.token = token;
    //     state.type = type;
    //   }
    // },
    // [login.pending]: (state, action) => {
    //   state.loading = true;
    // },
    // [login.rejected]: (state, action) => {
    //   state.loading = false;
    //   state.errorMessage = action.error.message;
    // },
    // [signup.fulfilled]: (state, action) => {
    //   state.loading = false;
    //   const {status, token, message} = action.payload;
    //   if (status === false) {
    //     state.signupErrorMessage = message;
    //   } else {
    //     state.token = token;
    //   }
    // },
    [restoreUserToken.fulfilled]: (state, action) => {
      state.loading = false;
      const {token, type} = action.payload;
      state.token = token || '';
      state.type = type || '';
    },
    [restoreUserToken.pending]: (state, _) => {
      state.loading = true;
    },
    // [signup.pending]: (state, action) => {
    //   state.loading = true;
    // },
    // [signup.rejected]: (state, action) => {
    //   state.loading = false;
    //   state.errorMessage = action.error.message;
    // },
    [getUserProfile.fulfilled]: (state, action) => {
      state.loading = false;
      const {status, data, message} = action.payload;
      if (status === false) {
        state.errorMessage = message;
      } else {
        state.userDetails = data;
      }
    },
    [getUserProfile.pending]: (state, action) => {
      state.loading = true;
    },
    [getUserProfile.rejected]: (state, action) => {
      state.loading = false;
      state.errorMessage = action.error.message;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setUserDetails, clearUser, setType, updateUser, loginAction} =
  userSlice.actions;

export default userSlice.reducer;
