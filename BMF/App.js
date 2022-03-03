import React,{useEffect} from  'react'
import {View,StatusBar,Image} from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login_Page from './Screen/Login_page';
import HomePage from './Screen/HomePage';
import BDetails from './Screen/BDetails';
const Stack = createNativeStackNavigator();
function App () {

 const [isloading,setloading] = React.useState(true);
 useEffect(()=>{
  setTimeout(async()=>{
    
    setloading(false)
  },2000)
 
})
 if (isloading){
  return(
    <View style={{backgroundColor:'white',flex:1 , justifyContent:'center'}}>
      <StatusBar hidden />
      <Image  style={{width:200,height:200,alignSelf:'center'}} source={require('./assets/bmf1.png')} />
  </View>
  );
}
 return(
   <NavigationContainer>
     <Stack.Navigator>
     <Stack.Screen name="Login_Page" component={Login_Page} options={{
      headerShown:false
    }}/> 
    <Stack.Screen name="HomePage" component={HomePage} options={{
      headerShown:false
    }}/> 
     <Stack.Screen name="BDetails" component={BDetails} options={{
      headerShown:false
    }}/> 
     </Stack.Navigator>
   </NavigationContainer>
 );
}
export default App;