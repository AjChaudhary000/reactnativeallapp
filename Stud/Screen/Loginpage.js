import React from 'react'
import {View,StyleSheet} from 'react-native'
import {createStackNavigator} from '@react-navigation/stack'
import LetsStart from './LetsStart'
import SignInPage from './SignInPage'
const Stack = createStackNavigator()
function LoginPage(){
return(
        <Stack.Navigator headerMode={false}>
            <Stack.Screen name="LetsStart" component={LetsStart}/>
            <Stack.Screen name="SignIn" component={SignInPage}/>
        </Stack.Navigator>
);
}
export default LoginPage;