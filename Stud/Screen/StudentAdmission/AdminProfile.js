import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput} from 'react-native'
import * as Animatable from 'react-native-animatable'
import { ScrollView } from 'react-native-gesture-handler';
import { Caption, Title } from 'react-native-paper';
import Icons from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/Feather'

function AdminProfile({ navigation }) {
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Animatable.View style={{ flexDirection: 'row', flex: 1 }}>
                <TouchableOpacity style={{ margin: 10, width: 50, height: 50, borderRadius: 25, backgroundColor: '#D3EACF', alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.openDrawer()}>
                    <Icons name="menu" color="white" size={30} />
                </TouchableOpacity>
                <View style={{ marginTop: 10, height: 50, width: 220, justifyContent: 'center' ,backgroundColor:'gray',borderRadius:20}}>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', letterSpacing: 2, fontSize: 25 }}>Profile</Text>
                </View>
                <View style={{ margin: 10 }}>
                    <Image style={{ height: 50, width: 50, borderRadius: 25 }} source={{ uri: "https://devtalk.blender.org/uploads/default/original/2X/c/cbd0b1a6345a44b58dda0f6a355eb39ce4e8a56a.png" }} />
                </View>
            </Animatable.View >
            
            <Animatable.View animation="bounceIn" duration={1000} style={{
                width: '100%', flex: 3, backgroundColor: '#D3EACF',
                borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: 50
            }}>
                
               <View style={{alignSelf:'center',top:-90,backgroundColor:'red',height:200,width:200,borderRadius:100}}>
               <Image style={{height:200,width:200,borderRadius:100}} source={{ uri: "https://devtalk.blender.org/uploads/default/original/2X/c/cbd0b1a6345a44b58dda0f6a355eb39ce4e8a56a.png" }} />
               </View>
               <ScrollView style={{top:-80,marginBottom:-100}}>
               <View style={{alignItems:'center'}}>
                   <Title>Arjun Chuadhary</Title>
                   <Caption>@AjChaudhary000</Caption>
                </View>
                <TouchableOpacity>
                <View style={{justifyContent:'center',marginTop:20,width:200,height:50,padding:10,borderWidth:2,borderRadius:20,alignSelf:'center',borderColor:'white',flexDirection:'row'}} >
                    <View style={{marginTop:-5}}>
                    <Icon name="edit" color="black" size={30} />
                    </View>
                    <View>
                        <Text style={{fontSize:20,fontWeight:'bold',marginLeft:20}}>
                                Edit Profile
                        </Text>
                    </View>
                </View>
                </TouchableOpacity>
                <View style={{marginLeft:20,marginTop:20,flexDirection:'row',paddingBottom:5}}> 
                <View>
                <Text style={{fontSize:20,fontWeight:'bold'}}>
                 Email :
                </Text>
                </View>
                <View>
                <Text style={{fontSize:20,fontWeight:'bold',marginLeft:10,paddingBottom:5,borderBottomWidth:1}}>
                 Arjun@gmail.com
                </Text>
                </View>
                </View>
                <View style={{marginLeft:20,marginTop:20,flexDirection:'row'}}> 
                <View>
                <Text style={{fontSize:20,fontWeight:'bold'}}>
                 Stream :
                </Text>
                </View>
                <View>
                <Text style={{fontSize:20,fontWeight:'bold',marginLeft:10,paddingBottom:5,borderBottomWidth:1}}>
                 BCA
                </Text>
                </View>
                </View>
                
                <View style={{marginLeft:20,marginTop:20,flexDirection:'row'}}> 
                <View>
                <Text style={{fontSize:20,fontWeight:'bold'}}>
                 Class :
                </Text>
                </View>
                <View>
                <Text style={{fontSize:20,fontWeight:'bold',marginLeft:10,paddingBottom:5,borderBottomWidth:1}}>
                 FY-BCA
                </Text>
                </View>
                </View>
                <View style={{marginLeft:20,marginTop:20,flexDirection:'row'}}> 
                <View>
                <Text style={{fontSize:20,fontWeight:'bold'}}>
                 Div :
                </Text>
                </View>
                <View>
                <Text style={{fontSize:20,fontWeight:'bold',marginLeft:10,paddingBottom:5,borderBottomWidth:1}}>
                B
                </Text>
                </View>
                </View>
                <View style={{marginLeft:20,marginTop:20,flexDirection:'row'}}> 
                <View>
                <Text style={{fontSize:20,fontWeight:'bold'}}>
                 Roll No :
                </Text>
                </View>
                <View>
                <Text style={{fontSize:20,fontWeight:'bold',marginLeft:10,paddingBottom:5,borderBottomWidth:1}}>
                 101
                </Text>
                </View>
                </View>
                <View style={{marginLeft:20,marginTop:20,flexDirection:'row'}}> 
                <View>
                <Text style={{fontSize:20,fontWeight:'bold'}}>
                 Addresss :
                </Text>
                </View>
                <View>
                <Text style={{fontSize:20,fontWeight:'bold',marginLeft:10,paddingBottom:5,borderBottomWidth:1,marginRight:10}}>
                 372,pandesra,surat.
                </Text>
                </View>
                </View>
                <View style={{marginLeft:20,marginTop:20,flexDirection:'row'}}> 
                <View>
                <Text style={{fontSize:20,fontWeight:'bold'}}>
                 Mobile No :
                </Text>
                </View>
                <View>
                <Text style={{fontSize:20,fontWeight:'bold',marginLeft:10,paddingBottom:5,borderBottomWidth:1,marginBottom:100}}>
                +91 9106614742
                </Text>
                </View>
                </View>
                </ScrollView>
            </Animatable.View>
           
        </View>
    );
}
export default AdminProfile;


















