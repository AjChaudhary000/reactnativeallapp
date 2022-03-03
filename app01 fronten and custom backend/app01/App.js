import React, {Component, useEffect} from 'react';
import Route from './Route';
import {StripeProvider} from '@stripe/stripe-react-native';
import store from './src/redux/store';
import {Provider, useDispatch} from 'react-redux';
import {restoreUserToken} from './src/redux/userSlice';
import Service from './Service';
const pub_key =
  'pk_test_51GyJ7MEathSqKpVQ9tKrDNs9cJQsm0vjBGuWUui3HwYIlm2vDyd0jbnBTmbuhlpuWuokWmNee6hnvKUjDBWXzzXD0068agKLBB';

const App = () => {
  return (
    <Provider store={store}>
      <StripeProvider
        publishableKey={pub_key}
        merchantIdentifier="merchant.identifier">
        <Route />
        <Service />
      </StripeProvider>
    </Provider>
  );
};
export default App;
