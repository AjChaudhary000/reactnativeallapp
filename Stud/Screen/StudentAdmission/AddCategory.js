import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput } from 'react-native'
import * as Animatable from 'react-native-animatable'
import Icons from 'react-native-vector-icons/Ionicons'
import Category from '../../Components/Category'
function AddCategory({ route, navigation }) {
    const { id, type } = route.params;
    console.log(id)
    console.log(type)
   const catename = Category.filter(item => {return (item.id == id)})
   const [Data,setData] = React.useState({
       id:'',
       index:null,
       Categoryname:''
   })
 const addcategoryname =(val)=>{
    setData({
        id:Category.length + 1,
        Categoryname:val
    })
 }
 const updatecategoryname =(val)=>{
    setData({
        index:Category.findIndex(item=>(item.id==catename[0].id)),
        id:catename[0].id,
        Categoryname:val
    })
 }
 const AddCategory=(cid,name)=>{
   if( Category.push({id:cid,category:name})){
    alert("Add category")
    navigation.goBack();
 }else{
     alert("Not add category") 
 }
}
 const updateCategory =(index,cid,name)=>{
    if( Category[index].category=name ,Category[index].id=cid){
        alert("Uadate category")
        navigation.goBack();
     }else{
         alert("Not not update category") 
     }
 }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Animatable.View style={{ flexDirection: 'row', flex: 2 }}>
                <TouchableOpacity style={{ margin: 10, width: 50, height: 50, borderRadius: 25, backgroundColor: '#D3EACF', alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.openDrawer()}>
                    <Icons name="menu" color="white" size={30} />
                </TouchableOpacity>
                <View style={{ marginTop: 10, height: 50, width: 220, justifyContent: 'center' ,backgroundColor:'gray',borderRadius:20}}>
                    {(type == 'add') ?
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', letterSpacing: 2, fontSize: 25 }}> Add Category</Text>
                        : <Text style={{ textAlign: 'center', fontWeight: 'bold', letterSpacing: 2, fontSize: 25 }}> Upadte Category</Text>
                    }
                </View>
                <TouchableOpacity onPress={()=>navigation.navigate("AdminProfile")}>
            <View style={{margin:10}}>
                <Image style={{height:50,width:50,borderRadius:25}} source={{uri:"https://devtalk.blender.org/uploads/default/original/2X/c/cbd0b1a6345a44b58dda0f6a355eb39ce4e8a56a.png"}}/>
            </View>
            </TouchableOpacity>
            </Animatable.View >

            <Animatable.View animation="bounceIn" duration={1000} style={{
                width: '100%', flex: 1.5, backgroundColor: '#D3EACF',
                borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: 50
            }}>
                <View style={{ backgroundColor: '#D3EACF', marginLeft: 20, marginTop: 15 }}>
                    {(type == 'add') ?
                        <Text style={{ fontSize: 30, letterSpacing: 2, fontWeight: 'bold' }}> Add Category </Text>
                        :
                        <Text style={{ fontSize: 30, letterSpacing: 2, fontWeight: 'bold' }}> Update Category </Text>
                    }
                    <View
                        style={{
                            margin: 20,

                        }}>
                     {(type == 'add') ? 
                     <TextInput
                     style={{
                         marginLeft: 10,
                         marginRight: 10,
                         borderColor: "green",
                         borderBottomWidth: 2,
                         width: "95%",
                         fontSize: 20,
                         padding: 5
                         , color: 'black'
                     }}
                     placeholder="Streams & Category "
                    
                     onChangeText={(val) => addcategoryname(val)}
                 />
                    :
                        <TextInput
                            style={{
                                marginLeft: 10,
                                marginRight: 10,
                                borderColor: "green",
                                borderBottomWidth: 2,
                                width: "95%",
                                fontSize: 20,
                                padding: 5
                                , color: 'black'
                            }}
                            
                            placeholder= {catename[0].category}
                            onChangeText={(val) => updatecategoryname(val)}
                        /> }
                    </View>
                    {(type == 'add') ? 
                    <TouchableOpacity onPress={()=> AddCategory(Data.id,Data.Categoryname)}>
                    <View style={{ backgroundColor: 'green', width: 150, height: 50, margin: 20, borderRadius: 25, alignSelf: 'flex-end', justifyContent: 'center' }} >
                        <Text style={{ textAlign: 'center', padding: 2, fontSize: 20, fontWeight: 'bold', color: 'white' }}>Add Category
                        </Text></View>
                        </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={()=> updateCategory(Data.index,Data.id,Data.Categoryname)}>
                    <View style={{ backgroundColor: 'green', width: 150, height: 50, margin: 20, borderRadius: 25, alignSelf: 'flex-end', justifyContent: 'center' }} >
                        <Text style={{ textAlign: 'center', padding: 2, fontSize: 20, fontWeight: 'bold', color: 'white' }}>Update Category
                        </Text></View>
                        </TouchableOpacity>
                    } 
                </View>

            </Animatable.View>
        </View>
    );
}
export default AddCategory;
