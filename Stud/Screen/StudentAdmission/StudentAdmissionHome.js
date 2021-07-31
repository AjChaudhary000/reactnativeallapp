import React from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView, Text, Image } from 'react-native'
import { Caption } from 'react-native-paper'
import * as Animatable from 'react-native-animatable'
import Icons from 'react-native-vector-icons/Ionicons'
function StudentAdmission({ navigation }) {
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
             <ScrollView>
            <View style={{flexDirection:'row'}}>
            <TouchableOpacity style={{ margin: 10, width: 50, height: 50, borderRadius: 25, backgroundColor: '#D3EACF', alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.openDrawer()}>
                <Icons name="menu" color="white" size={30} />
            </TouchableOpacity>
            <View style={{marginTop:10,height:50,width:220,justifyContent:'center',backgroundColor:'gray',borderRadius:20}}>
                <Text style={{textAlign:'center',fontWeight:'bold',letterSpacing:2,fontSize:25}}>Student Admission </Text>
            </View>
            <TouchableOpacity onPress={()=>navigation.navigate("AdminProfile")}>
            <View style={{margin:10}}>
                <Image style={{height:50,width:50,borderRadius:25}} source={{uri:"https://devtalk.blender.org/uploads/default/original/2X/c/cbd0b1a6345a44b58dda0f6a355eb39ce4e8a56a.png"}}/>
            </View>
            </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={()=>navigation.navigate('AddCategory',{id:0,type:'add'})}>
                <Animatable.View animation="bounceIn" duration={1000} style={{ marginLeft: 20, width: '90%', height: 150, backgroundColor: '#D3EACF', borderRadius: 20, marginTop: 50 }}>
                    <View style={{ backgroundColor:'#D3EACF',marginLeft:20,marginTop:15 }}>
                        <Text style={{ fontSize: 30, letterSpacing: 2, fontWeight: 'bold' }}> Add Category </Text>
                        </View>
                        <View style={{ backgroundColor:'#E9C9C2',paddingLeft:20,paddingTop:10,marginTop:10,height:100, borderBottomRightRadius:20,borderBottomLeftRadius:20 }}>
                        <Caption>Add Category & Streams </Caption>
                        
                    </View>
                </Animatable.View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate('AddSubCategory',{ id:0,type:'add'})}>
                <Animatable.View animation="bounceIn" duration={2000} style={{ marginLeft: 20, width: '90%', height: 150, backgroundColor: '#D3EACF', borderRadius: 20, marginTop: 50 }}>
                    <View style={{ backgroundColor:'#D3EACF',marginLeft:20,marginTop:15 }}>
                        <Text style={{ fontSize: 30, letterSpacing: 2, fontWeight: 'bold' }}>Add Sub-Category</Text>
                        </View>
                        <View style={{ backgroundColor:'#E9C9C2',paddingLeft:20,paddingTop:10,marginTop:10,height:100, borderBottomRightRadius:20,borderBottomLeftRadius:20 }}>
                        <Caption>Select Streams </Caption>
                        <Caption>Add Sub-Category </Caption>
                    </View>
                </Animatable.View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate('AddStudent',{id:0,type:'add'})}>
                <Animatable.View animation="bounceIn" duration={3000} style={{ marginLeft: 20, width: '90%', height: 150, backgroundColor: '#D3EACF', borderRadius: 20, marginTop: 50 }}>
                    <View style={{ backgroundColor:'#D3EACF',marginLeft:20,marginTop:15 }}>
                        <Text style={{ fontSize: 30, letterSpacing: 2, fontWeight: 'bold' }}>Add-Student</Text>
                        </View>
                        <View style={{ backgroundColor:'#E9C9C2',paddingLeft:20,paddingTop:10,marginTop:10,height:100, borderBottomRightRadius:20,borderBottomLeftRadius:20 }}>
                        <Caption> Select Streams </Caption>
                        <Caption> Select Sub-Category </Caption>
                        <Caption> Add-Student</Caption>
                    </View>
                </Animatable.View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate('StudentDetails')}>
                <Animatable.View animation="bounceIn" duration={4000} style={{ margin: 20, width: '90%', height: 150, backgroundColor: '#D3EACF', borderRadius: 20, marginTop: 50 }}>
                    <View style={{ backgroundColor:'#D3EACF',marginLeft:20,marginTop:15 }}>
                        <Text style={{ fontSize: 30, letterSpacing: 2, fontWeight: 'bold' }}>Student-details</Text>
                        </View>
                        <View style={{ backgroundColor:'#E9C9C2',paddingLeft:20,paddingTop:10,marginTop:10,height:100, borderBottomRightRadius:20,borderBottomLeftRadius:20 }}>
                        
                        <Caption>Update Students </Caption>
                        <Caption>Delete Students</Caption>
                        <Caption>View Students </Caption>
                    </View>
                </Animatable.View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate('CategoryDetails')}>
                <Animatable.View animation="bounceIn" duration={5000} style={{ margin: 20, width: '90%', height: 150, backgroundColor: '#D3EACF', borderRadius: 20, marginTop: 50 }}>
                    <View style={{ backgroundColor:'#D3EACF',marginLeft:20,marginTop:15 }}>
                        <Text style={{ fontSize: 30, letterSpacing: 2, fontWeight: 'bold' }}>Category Details</Text>
                        </View>
                        <View style={{ backgroundColor:'#E9C9C2',paddingLeft:20,paddingTop:10,marginTop:10,height:100, borderBottomRightRadius:20,borderBottomLeftRadius:20 }}>
                       
                        <Caption>Update Categorys </Caption>
                        <Caption>Delete Categorys </Caption>
                        <Caption>View Categorys </Caption>
                    </View>
                </Animatable.View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate('SubCategoryDetails')}>
                <Animatable.View animation="bounceIn" duration={6000} style={{ margin: 20, width: '90%', height: 150, backgroundColor: '#D3EACF', borderRadius: 20, marginTop: 50 }}>
                    <View style={{ backgroundColor:'#D3EACF',marginLeft:20,marginTop:15 }}>
                        <Text style={{ fontSize: 30, letterSpacing: 2, fontWeight: 'bold' }}>Sub-Category Details</Text>
                        </View>
                        <View style={{ backgroundColor:'#E9C9C2',paddingLeft:20,paddingTop:10,marginTop:10,height:100, borderBottomRightRadius:20,borderBottomLeftRadius:20 }}>
                        <Caption>Update Sub-Category </Caption>
                        <Caption>Delete Sub-Category </Caption>
                        <Caption>View Sub-Category </Caption>
                    </View>  
                </Animatable.View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
export default StudentAdmission;


















