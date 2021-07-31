import React from 'react'
import  {View,StyleSheet, Alert, TouchableOpacity} from 'react-native'
import{Paragraph,Caption,Avatar,Drawer,Text,Title,Switch} from 'react-native-paper'
import {DrawerItem,DrawerContentScrollView} from '@react-navigation/drawer'
import Icons from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {AuthContext} from  '../Components/Context'
import Icona from 'react-native-vector-icons/Feather'
import AsyncStorage from '@react-native-async-storage/async-storage'
function DrawerContent(props){
    const {SignOut} = React.useContext(AuthContext)
  const [data,setdata] = React.useState({
      suser:'',
      username:''
  })
    
   const Display = async ()=>{
      
        try{  
          let userq = await AsyncStorage.getItem('@Uname');  
          let u_name = await AsyncStorage.getItem('@username'); 
          setdata({
              suser:userq,
              username:u_name
          })
        }  
        catch(error){  
          alert(error)  
        }  
      }   
      Display()
    return(
        <View style={{flex:1,backgroundColor:'#D3EACF'}}>
            <DrawerContentScrollView {...props}>
                <View style={{margin:20,padding:10}}>
                    <View style={{flexDirection:'row'}}>
                   <Avatar.Image  style={{backgroundColor:'white'}} 
                   source={{uri:'https://devtalk.blender.org/uploads/default/original/2X/c/cbd0b1a6345a44b58dda0f6a355eb39ce4e8a56a.png'}}/>
                    <View style={{marginLeft:20}}>
                    <Title>{data.suser}</Title>
                    <Caption>@{data.username}</Caption>
                    </View>
                   </View>
                   <View style={{flexDirection:'row',marginTop:20}}>
                       <View style={{flexDirection:'row'}}>
                           <Caption style={{fontSize:18}}>200</Caption>
                           <Paragraph style={{marginLeft:20,fontSize:20}}>Followers</Paragraph>
                       </View>
                       <View style={{flexDirection:'row',marginLeft:20}}>
                           <Caption style={{fontSize:18}}>180</Caption>
                           <Paragraph style={{marginLeft:20,fontSize:20}}>Following</Paragraph>
                       </View>
                   </View>
                   <TouchableOpacity>
                <View style={{justifyContent:'center',marginTop:20,width:200,height:50,padding:10,borderWidth:2,borderRadius:20,alignSelf:'center',borderColor:'black',flexDirection:'row'}} >
                    <View style={{marginTop:-5}}>
                    <Icona name="edit" color="black" size={30} />
                    </View>
                    <View>
                        <Text style={{fontSize:20,fontWeight:'bold',marginLeft:20}}>
                                Edit Profile
                        </Text>
                    </View>
                </View>
                </TouchableOpacity>
                </View>
               <Drawer.Section style={{borderTopWidth:2}}>
                   <Drawer.Item
                   label ="Home"
                   icon = {()=>(
                       <Icons name="home-outline"
                       color = 'white'
                       size = {30}
                       />
                   )}
                   onPress={()=>Alert.alert('Hey','Your are Go to Home page')}
                   />
                    <Drawer.Item
                   label ="Add Student"
                   icon = {()=>(
                       <Icon name="person-add-alt"
                       color = 'white'
                       size = {30}
                       />
                   )}
                   onPress={()=>Alert.alert('Hey','Your are Go to Add Student page')}
                   />
                    <Drawer.Item
                   label ="Student Details"
                   icon = {()=>(
                       <Icons name="account-details-outline"
                       color = 'white'
                       size = {30}
                       />
                   )}
                  // onPress={()=>Alert.alert('Hey','Your are Go to Add Student page')}
                   />
                    <Drawer.Item
                   label ="Contact Us"
                   icon = {()=>(
                       <Icons name="contacts-outline"
                       color = 'white'
                       size = {30}
                       />
                   )}
                   onPress={()=>Alert.alert('Hey','Your are Go to Contact Us page')}
                   />
               </Drawer.Section>
               <Drawer.Section >
                   <TouchableOpacity>
                       <View style={{flexDirection:'row' , margin:20}}>
                           <Text>Dark Theme</Text>
                         <View style={{marginLeft:120,justifyContent:'flex-end'}}> 
                         <Switch />
                             </View>  
                      
                       </View>
                     
                   </TouchableOpacity>
               </Drawer.Section>
            </DrawerContentScrollView>
            <Drawer.Section>
            <Drawer.Item
                   label ="Sign Out"
                   icon = {()=>(
                       <Icons name="location-exit"
                       color = 'white'
                       size = {30}
                       />
                   )}
                   onPress={()=>{SignOut()}}
                   />
            </Drawer.Section>
            <Drawer.Section>
                <Paragraph style={{fontSize:20,textAlign:'center',margin:20}}>Version 1.0.01</Paragraph>
            </Drawer.Section>
        </View>
    );
}
export default DrawerContent;