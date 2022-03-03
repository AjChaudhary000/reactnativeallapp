import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {APP_CONFIG} from '../../config';
import {DELETE, GET, getJWTToken, PATCH, POST, saveJWTToken} from './helpers';

export const addAssistant = async (data) => {
  const token = await getJWTToken();
  return await POST(token, '/assistant', data);
};
export const deleteAssistant = async (data) => {
  const token = await getJWTToken();
  return await DELETE(token, '/assistant', data);
};
export const getAllAssistant = createAsyncThunk(
  'assistant/getAllAssistant',
  async (_, {getState}) => {
    const token = await getJWTToken();
    const assistant = await GET(token, '/assistant', {});
    return assistant;
  },
);
export const assistantSlice = createSlice({
  name: 'assistant',
  initialState: {
    loading: false,
    list: [],
    errorMessage: '',
  },
  reducers: {},
  extraReducers: {
    [getAllAssistant.fulfilled]: (state, action) => {
      state.loading = false;
      const {data, status, message} = action.payload;
      if (status === false) {
        state.errorMessage = message;
      } else {
        state.list = data;
      }
    },
    [getAllAssistant.pending]: (state, action) => {
      state.loading = true;
    },
    [getAllAssistant.rejected]: (state, action) => {
      state.loading = false;
      console.log(action.error);
      state.errorMessage = action.error.message;
    },
  },
});

// Action creators are generated for each case reducer function
// export const {setUserDetails} = assistantSlice.actions;

export default assistantSlice.reducer;
