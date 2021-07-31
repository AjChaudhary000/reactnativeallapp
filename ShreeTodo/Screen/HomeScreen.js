import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon from 'react-native-vector-icons/MaterialIcons'
import GroupTodoScreen from './GroupTodoScreen'
import AddGroup from './AddGroup'
const Tabs = createBottomTabNavigator()
const CustomButton = ({ children, onPress }) => (
  <TouchableOpacity style={{ top: -30, justifyContent: 'center', alignItems: 'center' }} onPress={onPress}>
    <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: 'blue', borderColor: '#E6DDDA', borderWidth: 5 }}>{children}</View>
  </TouchableOpacity>
);
function HomeScreen() {
  return (

    <Tabs.Navigator tabBarOptions={{
      style: {
        backgroundColor: 'white',
        borderTopWidth: null,
        width: '95%',
        position: 'absolute',
        // borderTopLeftRadius:20,
        // borderTopRightRadius:20,
        bottom: 10,
        borderRadius: 10,
        left: 10,
        height: 60
      }, showLabel: false
    }}>
      <Tabs.Screen name="Home" component={GroupTodoScreen} options={{
        tabBarIcon: ({ focused }) => (
          <Icons name="home-circle-outline" color={focused ? 'blue' : 'black'} size={30} />)
      }} />

      <Tabs.Screen name="reminder" component={GroupTodoScreen} options={{
        tabBarIcon: ({ focused }) => (
          <Icons name="reminder" size={30} color={focused ? 'blue' : 'black'} />)
      }} />

      <Tabs.Screen name="add" component={AddGroup} options={{
        tabBarIcon: ({ focused }) => (
          <Icon name="add" color="white" size={30} />), tabBarButton: (props) => (
            <CustomButton {...props} />)
      }} />

      <Tabs.Screen name="Events" component={GroupTodoScreen} options={{
        tabBarIcon: ({ focused }) => (
          <Icons name="calendar-month-outline" color={focused ? 'blue' : 'black'} size={30} />)
      }} />

      <Tabs.Screen name="Notes" component={GroupTodoScreen} options={{
        tabBarIcon: ({ focused }) => (
          <Icons name="page-next-outline" size={30} color={focused ? 'blue' : 'black'} />)
      }} />
    </Tabs.Navigator>
  );
}
export default HomeScreen;