import AsyncStorage from '@react-native-community/async-storage';

const {APP_CONFIG} = require('../../config');

export const GET = async (token, url, params) => {
  const api_url =
    APP_CONFIG.backend_url +
    url +
    '?' +
    new URLSearchParams({secret_token: token, ...params}).toString();
  let response = await fetch(api_url);
  return await response.json();
};
export const POST = async (token, url, data) => {
  const api_url =
    APP_CONFIG.backend_url +
    url +
    '?' +
    new URLSearchParams({secret_token: token}).toString();
  let response = await fetch(api_url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
};
export const PATCH = async (token, url, data) => {
  const api_url =
    APP_CONFIG.backend_url +
    url +
    '?' +
    new URLSearchParams({secret_token: token}).toString();
  let response = await fetch(api_url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
};
export const DELETE = async (token, url, data) => {
  const api_url =
    APP_CONFIG.backend_url +
    url +
    '?' +
    new URLSearchParams({secret_token: token}).toString();
  let response = await fetch(api_url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
};
export const saveJWTToken = async (token) => {
  await AsyncStorage.setItem('@usertoken', token);
};
export const removeJWTToken = async () => {
  await AsyncStorage.removeItem('@usertoken');
};
export const getJWTToken = async () => {
  return await AsyncStorage.getItem('@usertoken');
};

export const saveType = async (type) => {
  await AsyncStorage.setItem('@usertype', type);
};
export const removeType = async () => {
  await AsyncStorage.removeItem('@usertype');
};
export const getType = async () => {
  return await AsyncStorage.getItem('@usertype');
};
