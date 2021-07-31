import React from 'react'
import {View,StyleSheet} from 'react-native'
import {createStackNavigator} from '@react-navigation/stack'

import StudentAdmission from './StudentAdmission/StudentAdmissionHome'
const Stack = createStackNavigator()
function Admission(){
return(
        <Stack.Navigator initialRouteName="tabScreen" headerMode={false}>
            <Stack.Screen name="StudentAdmission" component={StudentAdmission}/>
        </Stack.Navigator>
);
}
export default Admission;