import React from 'react'
import { View, StyleSheet, Text, Alert, TouchableOpacity, TextInput } from 'react-native'
import * as Animatable from 'react-native-animatable';
import Icons from 'react-native-vector-icons/Entypo'
import Data from '../Components/Data';
import {AuthContext} from  '../Components/Context'
function SignInPage() {
  const { SignIn }   = React.useContext(AuthContext);
  const [data,setdata]= React.useState({
    USERNAME:'',
    PASSWORD:'',
    secureTextEntry:true,
    cheackuser:false
  })
 
  
 const changeusername = (val) =>{
      
       setdata({
         ...data,
         USERNAME:val
       })
 }
 const changepassword = (val) =>{
   setdata({
     ...data,
     PASSWORD:val
   })
 }
 const changesecuretext = ()=>{
   setdata({
     ...data,
     secureTextEntry : !data.secureTextEntry
   })
 }
 const logincheck = (user,pass) =>{
   const fetch_u = Data.filter(item => {
     return (user == item.Username || user == item.Email) && pass == item.Password;
   });
   if (data.USERNAME.length == 0 && data.PASSWORD.length == 0){
   Alert.alert('Wrong Input!', 'Username or password field cannot be empty.', [ {text: 'Okay'}]);
   return;
   }
   if (fetch_u.length == 0){
     Alert.alert('Invalid User!', 'Username or password is incorrect.', [
       {text: 'Okay'}
   ]);
   return;
   }
   SignIn(fetch_u)
 
 }
  return (
    <View style={{flex:1,backgroundColor:'#D3EACF'}}>
      <View style={{ flex: 2 }} >
          <Text style={{color:'white',margin:20,marginTop:50,fontSize:40}}>WelCome</Text>
      </View>
      <Animatable.View animation="bounceInUp" style={{ flex: 2, 
        backgroundColor: 'white', 
        borderTopLeftRadius: 20, 
        borderTopRightRadius: 20 }} >
        <View 
        style={{ margin: 20,
           flexDirection: "row"
            }}>
          <Icons name="user"
           color="green" 
           size={30} />
          <TextInput 
          style={{
             marginLeft: 20,
             borderColor: "green", 
             borderBottomWidth: 2,
              width: "80%",
               fontSize: 20,
                padding: 5 
                ,color:'black'
                }} 
                placeholder="UserName & Email " 
                onChangeText={(val)=>changeusername(val)}
                />
        </View>
        <View style={{ margin: 20, flexDirection: "row" }}>
          <Icons name="lock" color="green" size={30} />
          <TextInput style={{ marginLeft: 20,
             borderColor: "green", 
             borderBottomWidth: 2, 
             width: "70%", 
             fontSize: 20, 
             padding: 5,
             color:'black'
              }} 
              placeholder="Password "
              secureTextEntry = {data.secureTextEntry}            
             onChangeText={(val)=>changepassword(val)}
               />

<TouchableOpacity onPress={changesecuretext}>
            {data.secureTextEntry ?
              <Icons  name="eye" color="green" size={40} />
              :  <Icons  name="eye-with-line" color="green" size={40} />
              }
          </TouchableOpacity>
        </View>
        <View style={{ margin: 20}}>
         <TouchableOpacity onPress={()=>{logincheck(data.USERNAME,data.PASSWORD)}}>
           <View style={{backgroundColor:'green',
           width:'100%',
           height:50,
           borderRadius:20,
           padding:10
           }}
           >
             <Text style={{color:'white',textAlign:'center',fontSize:25}}>SignIn</Text>
             </View>
         </TouchableOpacity>
         
        </View>
      </Animatable.View>
    </View>
  );
}
export default SignInPage;
