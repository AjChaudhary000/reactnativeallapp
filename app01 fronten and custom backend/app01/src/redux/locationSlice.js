import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {DELETE, GET, getJWTToken, PATCH, POST} from './helpers';
// export const
export const mapLocation = (location) => {
  return {latitude: location.lat, longitude: location.lng};
};
export const locationSlice = createSlice({
  name: 'chat',
  initialState: {
    location: {
      lat: 0,
      lng: 0,
    },
    address: '',
  },
  reducers: {
    setLatlng: (state, action) => {
      const {lat, lng} = action.payload;
      state.location.lat = lat;
      state.location.lng = lng;
    },
    setAddress: (state, action) => {
      console.log(action.payload);
      state.address = action.payload;
    },
  },
  extraReducers: {},
});

// Action creators are generated for each case reducer function
export const {setLatlng, setAddress} = locationSlice.actions;

export default locationSlice.reducer;
