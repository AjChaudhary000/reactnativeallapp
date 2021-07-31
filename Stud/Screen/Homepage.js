import React from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView, Text, Image } from 'react-native'
import { Caption } from 'react-native-paper'
import * as Animatable from 'react-native-animatable'
import Icons from 'react-native-vector-icons/Ionicons'

function Homepage({ navigation }) {
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
             <ScrollView>
            <View style={{flexDirection:'row'}} >
            <TouchableOpacity style={{ margin: 10, width: 50, height: 50, borderRadius: 25, backgroundColor: '#D3EACF', alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.openDrawer()}>
                <Icons name="menu" color="white" size={30} />
            </TouchableOpacity>
            <View style={{marginTop:10,height:50,width:220,justifyContent:'center',backgroundColor:'gray',borderRadius:20}}>
                <Text style={{textAlign:'center',fontWeight:'bold',letterSpacing:2,fontSize:25}}>Welcome To Home</Text>
            </View>
            <TouchableOpacity onPress={()=>navigation.navigate("AdminProfile")}>
            <View style={{margin:10}}>
                <Image style={{height:50,width:50,borderRadius:25}} source={{uri:"https://devtalk.blender.org/uploads/default/original/2X/c/cbd0b1a6345a44b58dda0f6a355eb39ce4e8a56a.png"}}/>
            </View>
            </TouchableOpacity>
            </View>
           <TouchableOpacity onPress={()=>navigation.navigate('StudentAdmission')}>
                <Animatable.View animation="bounceIn" duration={1000} style={{ marginLeft: 20, width: '90%', height: 150, 
                backgroundColor: '#D3EACF', borderRadius: 20, marginTop: 50 }} >
                    <View style={{ backgroundColor:'#D3EACF',marginLeft:20,marginTop:15 }}>
                        <Text style={{ fontSize: 30, letterSpacing: 2, fontWeight: 'bold' }}>Student Admission</Text>
                        </View>
                        <View style={{ backgroundColor:'#E9C9C2',paddingLeft:20,paddingTop:10,marginTop:10,height:100, borderBottomRightRadius:20,borderBottomLeftRadius:20 }}>
                        <Caption>Add Students </Caption>
                        <Caption>Update Students </Caption>
                        <Caption>Delete Students </Caption>
                        <Caption>Manage Students </Caption>
                    </View>
                </Animatable.View>
                </TouchableOpacity>
                <Animatable.View animation="bounceIn" duration={2000} style={{ marginLeft: 20, width: '90%', height: 150, backgroundColor: '#D3EACF', borderRadius: 20, marginTop: 50 }}>
                    <View style={{ backgroundColor:'#D3EACF',marginLeft:20,marginTop:15 }}>
                        <Text style={{ fontSize: 30, letterSpacing: 2, fontWeight: 'bold' }}>Attendence</Text>
                        </View>
                        <View style={{ backgroundColor:'#E9C9C2',paddingLeft:20,paddingTop:10,marginTop:10,height:100, borderBottomRightRadius:20,borderBottomLeftRadius:20 }}>
                        <Caption>Attendence Students </Caption>
                        <Caption>Attendence Facutly </Caption>
                        <Caption>Attendence Manage </Caption>
                       
                    </View>
                </Animatable.View>
                <Animatable.View animation="bounceIn" duration={3000} style={{ marginLeft: 20, width: '90%', height: 150, backgroundColor: '#D3EACF', borderRadius: 20, marginTop: 50 }}>
                    <View style={{ backgroundColor:'#D3EACF',marginLeft:20,marginTop:15 }}>
                        <Text style={{ fontSize: 30, letterSpacing: 2, fontWeight: 'bold' }}>Facutly Managment</Text>
                        </View>
                        <View style={{ backgroundColor:'#E9C9C2',paddingLeft:20,paddingTop:10,marginTop:10,height:100, borderBottomRightRadius:20,borderBottomLeftRadius:20 }}>
                        <Caption> Add Facutly </Caption>
                        <Caption> Update Facutly </Caption>
                        <Caption> Delete Facutly </Caption>
                        <Caption> Manage Facutly </Caption>
                    </View>
                </Animatable.View>
                <Animatable.View animation="bounceIn" duration={4000} style={{ margin: 20, width: '90%', height: 150, backgroundColor: '#D3EACF', borderRadius: 20, marginTop: 50 }}>
                    <View style={{ backgroundColor:'#D3EACF',marginLeft:20,marginTop:15 }}>
                        <Text style={{ fontSize: 30, letterSpacing: 2, fontWeight: 'bold' }}>Time Table</Text>
                        </View>
                        <View style={{ backgroundColor:'#E9C9C2',paddingLeft:20,paddingTop:10,marginTop:10,height:100, borderBottomRightRadius:20,borderBottomLeftRadius:20 }}>
                        <Caption>Add Time-Table </Caption>
                        <Caption>Update Time-Table </Caption>
                        <Caption>Delete Time-Table </Caption>
                        <Caption>Manage Time-Table </Caption>
                    </View>
                </Animatable.View>
                <Animatable.View animation="bounceIn" duration={5000} style={{ margin: 20, width: '90%', height: 150, backgroundColor: '#D3EACF', borderRadius: 20, marginTop: 50 }}>
                    <View style={{ backgroundColor:'#D3EACF',marginLeft:20,marginTop:15 }}>
                        <Text style={{ fontSize: 30, letterSpacing: 2, fontWeight: 'bold' }}>Notices</Text>
                        </View>
                        <View style={{ backgroundColor:'#E9C9C2',paddingLeft:20,paddingTop:10,marginTop:10,height:100, borderBottomRightRadius:20,borderBottomLeftRadius:20 }}>
                        <Caption>Add Notices</Caption>
                        <Caption>Update Notices </Caption>
                        <Caption>Delete Notices </Caption>
                        <Caption>Manage Notices </Caption>
                    </View>
                </Animatable.View>
                <Animatable.View animation="bounceIn" duration={6000} style={{ margin: 20, width: '90%', height: 150, backgroundColor: '#D3EACF', borderRadius: 20, marginTop: 50 }}>
                    <View style={{ backgroundColor:'#D3EACF',marginLeft:20,marginTop:15 }}>
                        <Text style={{ fontSize: 30, letterSpacing: 2, fontWeight: 'bold' }}>Exam Time-Table</Text>
                        </View>
                        <View style={{ backgroundColor:'#E9C9C2',paddingLeft:20,paddingTop:10,marginTop:10,height:100, borderBottomRightRadius:20,borderBottomLeftRadius:20 }}>
                        <Caption>Add Exam Time-Table</Caption>
                        <Caption>Update Exam Time-Table </Caption>
                        <Caption>Delete Exam Time-Table </Caption>
                        <Caption>Manage Exam Time-Table </Caption>
                    </View>  
                </Animatable.View>
                <Animatable.View animation="bounceIn" duration={7000} style={{ margin: 20, width: '90%', height: 150, backgroundColor: '#D3EACF', borderRadius: 20, marginTop: 50 ,marginBottom:100}}>
                    <View style={{ backgroundColor:'#D3EACF',marginLeft:20,marginTop:15 }}>
                        <Text style={{ fontSize: 30, letterSpacing: 2, fontWeight: 'bold' }}>Syllabus</Text>
                        </View>
                        <View style={{ backgroundColor:'#E9C9C2',paddingLeft:20,paddingTop:10,marginTop:10,height:100, borderBottomRightRadius:20,borderBottomLeftRadius:20 }}>
                        <Caption>Add Syllabus</Caption>
                        <Caption>Update Syllabus </Caption>
                        <Caption>Delete Syllabus </Caption>
                        <Caption>Manage Syllabus </Caption>
                    </View>  
                </Animatable.View>
            </ScrollView>
        </View>
    );
}
export default Homepage;


















