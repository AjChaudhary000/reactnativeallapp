import React,{useEffect} from 'react'
import {View, ActivityIndicator} from 'react-native'
import {Provider as PaperProvider} from 'react-native-paper'
import { NavigationContainer} from '@react-navigation/native'
import {createDrawerNavigator} from '@react-navigation/drawer'
import AdminPage from './Screen/Adminpage'
import DrawerContent from './Screen/DrawerContent'
import LoginPage from './Screen/Loginpage'
import {AuthContext} from  './Components/Context'
import AsyncStorage from '@react-native-async-storage/async-storage'
const Drawer = createDrawerNavigator()
function App(){
  const initializeLoginState = {
    isLoading: true,
    tokenKey : null,
      username : null,

  };
  const loginreducer =(prev,action)=>{
    switch(action.type){
      case 'RETRIEVE_DATA': 
      return{
        ...prev,
        tokenKey : action.token,
        isLoading: false
      };
      case 'SIGNIN': 
      return{
        ...prev,
        tokenKey : action.token,
        username : action.name,
        isLoading: false
    };
      case 'SIGNOUT': 
      return{
        ...prev,
        tokenKey : null,
        username : null,
        isLoading: false
      };
    }; 
  };
  const authContext  = React.useMemo(()=>({
    SignIn:async(fatch_u)=>{
      username = fatch_u[0].Username
      tokenKey = fatch_u[0].tokenKey
      Uname = fatch_u[0].name
      Id = String(fatch_u[0].id)
      try{
        await AsyncStorage.setItem("@username",username)
        await AsyncStorage.setItem("@Uname",Uname)
        await AsyncStorage.setItem("@tokenkey",tokenKey)
        await AsyncStorage.setItem("@id",Id)
      }catch(e){
        console.log(e)
      }
      dispatch({type:'SIGNIN',name:username,token:tokenKey})
    },
    SignOut:async()=>{
      try{    
        await AsyncStorage.removeItem("@tokenkey")
        await AsyncStorage.removeItem("@Uname")
        await AsyncStorage.removeItem("@username")
        await AsyncStorage.removeItem("@id")
      }catch(e){
        console.log(e)
      }
      dispatch({type:'SIGNOUT'})
    },
  }),[])
const [Loginstate,dispatch] = React.useReducer(loginreducer,initializeLoginState)
 useEffect(()=>{
   setTimeout(async()=>{
     let tokanKey;
     tokanKey = null;
     try{
     tokanKey = await AsyncStorage.getItem("@tokenkey")
    }catch(e){
      console.log(e)
    }
    dispatch({type:'RETRIEVE_DATA',token:tokanKey})
   },1000)
 },[])
 if( Loginstate.isLoading ) {
  return(
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <ActivityIndicator size="large"/>
    </View>
  );
}
return(
  <AuthContext.Provider value={authContext}>
  <NavigationContainer>
    { 
    Loginstate.tokenKey !== null ? ( 
           <Drawer.Navigator drawerContent={props =><DrawerContent {...props}/>}>
             <Drawer.Screen name = "Home" component={AdminPage}/>
           </Drawer.Navigator> 
     ) :(
          <LoginPage />
     )}
  </NavigationContainer>
  </AuthContext.Provider>
);
}
export default App;