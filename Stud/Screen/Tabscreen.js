import React from 'react'
import  {View,Text,StyleSheet} from 'react-native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Homepage from './Homepage'
import  ChetPage from './ChetPage'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon from 'react-native-vector-icons/MaterialIcons'
const BottomTab = createBottomTabNavigator()
function Tabscreen(){
    return(
        <BottomTab.Navigator initialRouteName="Home"  tabBarOptions={{labelPosition:'beside-icon' ,
        style:{backgroundColor:'white',
        borderTopWidth:null,
        height:60,
        borderRadius:10,
        left:20,
        right:10,
        bottom:20,
        width:'90%',
        position:'absolute'}}}>
            <BottomTab.Screen name = "Home" component={Homepage} options={{
                   
                    tabBarIcon:({focused})=>(
                        
                        <Icons name="home-outline" color = {focused ? '#D3EACF' : 'black'} size={25} /> 
            
 
                    )
                               }} />
             <BottomTab.Screen name = "Chets" component={ChetPage} options={{
                    tabBarBadge:2,
                    tabBarIcon:({focused})=>(
                        <Icons name="message-outline" color = {focused ? '#D3EACF' : 'black'} size={25} />
                    )
            }} />
             <BottomTab.Screen name = "Settings" component={Homepage} options={{
                   
                    tabBarIcon:({focused})=>(
                        <Icon name="settings" color = {focused ? '#D3EACF' : 'black'} size={25} />
                    )
            }} />
        </BottomTab.Navigator>
    );
}
export default Tabscreen;