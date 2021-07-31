import React from 'react'
import {View,StyleSheet} from 'react-native'
import {createStackNavigator} from '@react-navigation/stack'
import Tabscreen from './Tabscreen'
import AddCategory from './StudentAdmission/AddCategory'
import StudentAdmission from './StudentAdmission/StudentAdmissionHome'
import AddSubCategory from './StudentAdmission/AddSubCategory'
import AddStudent from './StudentAdmission/AddStudent'
import CategoryDetails from './StudentAdmission/CategoryDetails'
import StudentDetails from './StudentAdmission/StudentDetails'
import SubCategoryDetails from './StudentAdmission/SubCategoryDetails'
import AdminProfile from './StudentAdmission/AdminProfile'
const Stack = createStackNavigator()
function AdminPage(){
return(
        <Stack.Navigator initialRouteName="tabScreen" headerMode={false}>
            <Stack.Screen name="tabScreen" component={Tabscreen}/>
            
            <Stack.Screen name="StudentAdmission" component={StudentAdmission}/>
            <Stack.Screen name="AddCategory" component={AddCategory}/>
            <Stack.Screen name="AddSubCategory" component={AddSubCategory}/>
            <Stack.Screen name="AddStudent" component={AddStudent}/>
            <Stack.Screen name="CategoryDetails" component={CategoryDetails}/>
            <Stack.Screen name="StudentDetails" component={StudentDetails}/>
            <Stack.Screen name="SubCategoryDetails" component={SubCategoryDetails}/>
            <Stack.Screen name="AdminProfile" component={AdminProfile}/>
        </Stack.Navigator>
);
}
export default AdminPage;