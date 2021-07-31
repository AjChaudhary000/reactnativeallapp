import React from 'react'
import {FlatList, Text, View,TextInput, TouchableWithoutFeedback} from 'react-native'
import database from '@react-native-firebase/database'
function AddTodo({navigation})
{    
   const [data,setdata] = React.useState({
       todoname :'',
   })
   const changeTodo=(val)=>{
        setdata({
            ...data,
            todoname:val,
        })
   }
   const Addcategory =(todoname)=>{
    const newReference = database().ref('/Todo').push();
    newReference
      .set({
        Tid: `${newReference.key}`,
        Todoname: `${todoname}`
      })
      .then(() => navigation.goBack());
   }
    return(
    <View style={{backgroundColor:'#b00be'}}>
        <View style={{margin:20}}>
            <TextInput  placeholder="Enter The Category Name : "  style ={{borderRadius:15,height:40,
                width:'100%',borderWidth:1,
                borderColor:'blue',
                padding:10,color:'black'}} 
                onChangeText={(val)=>changeTodo(val)}/>
        </View>
        <View style={{margin:20}}>
            <TouchableWithoutFeedback onPress={()=> Addcategory(data.todoname)}>
            <View style={{alignSelf:"center",height:40,width:"50%" ,backgroundColor:'green',borderRadius:20}}><Text style={{color:'white',
            textAlign:'center',
            paddingTop:10}}>Add Category</Text></View>
            </TouchableWithoutFeedback>
        </View>
    </View>
    );
}
export default AddTodo;