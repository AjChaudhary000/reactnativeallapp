import Geolocation from '@react-native-community/geolocation';
import React, {Component, useEffect} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {Provider, useDispatch, useSelector} from 'react-redux';
import {restoreFavs} from './src/redux/favSlice';
import {setLatlng, setAddress} from './src/redux/locationSlice';
import {restoreUserToken} from './src/redux/userSlice';

export async function request_device_location_runtime_permission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'App01 Location Permission',
        message: 'App01 needs access to your location ',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      // Alert.alert("Location Permission Granted.");
    } else {
      // Alert.alert("Location Permission Not Granted");
    }
  } catch (err) {}
}
const Service = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getPosition();
    dispatch(restoreUserToken());
    dispatch(restoreFavs());
  }, []);
  const getPosition = async () => {
    if (Platform.OS === 'android') {
      await request_device_location_runtime_permission();
    }
    Geolocation.getCurrentPosition(async (position) => {
      dispatch(
        setLatlng({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      );
      const req = await fetch(
        'https://maps.googleapis.com/maps/api/geocode/json?address=' +
          position.coords.latitude +
          ',' +
          position.coords.longitude +
          '&key=' +
          'AIzaSyAkHq68S7fuekxh15phIQkPYWnQgp7gF74',
      );
      const res = await req.json();
      dispatch(setAddress(res.results[0].formatted_address));
    });
  };
  return <></>;
};
export default Service;
