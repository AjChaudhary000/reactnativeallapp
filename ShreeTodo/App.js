import React,{useEffect} from  'react'
import {View,StatusBar} from 'react-native'
import LottieView from 'lottie-react-native';
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'
import Onboardring from './Screen/Onbordring';
import HomeScreen from './Screen/HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage'
const Stack = createStackNavigator();
function App () {
 const [isloading,setloading] = React.useState(true)
 const [onbordringValue,setonbordringValue] = React.useState(false)
useEffect(()=>{
  setTimeout(async()=>{
    
    setloading(false)
  },2000)
 
})
useEffect(()=>{
  checkonbording()
})
 const checkonbording =async()=>{
  try {
    const onborder = await AsyncStorage.getItem("@Onbordring")
    if (onborder != null){
    setonbordringValue(true)
    }
   } catch (e) {
     console.log(e)
   }
 }
if (isloading){
  return(
    <View style={{backgroundColor:'blue',flex:1}}>
      <StatusBar hidden />
  <LottieView source={require('./Todo.json')} autoPlay loop />
  </View>
  );
}
  return(
  
  <NavigationContainer>
    
      {onbordringValue ?
      <Stack.Navigator >
   <Stack.Screen name="HomeScreen" component={HomeScreen}  options={{
      headerShown:false
    }}/> 
   </Stack.Navigator> 
    : 
    <Stack.Navigator >
     <Stack.Screen name="Onboardring" component={Onboardring} options={{
      headerShown:false
    }}/>
    <Stack.Screen name="HomeScreen" component={HomeScreen}  options={{
      headerShown:false
    }}/> 
    </Stack.Navigator>
  } 
  </NavigationContainer>
);
}
export default App;