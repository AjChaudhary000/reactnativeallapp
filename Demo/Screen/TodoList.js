
import React,{useEffect,useState } from 'react'
import { Alert, FlatList, Text, View, Dimensions, TouchableWithoutFeedback } from 'react-native'
import { FAB } from 'react-native-paper'
import database from '@react-native-firebase/database'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
function TodoList({ navigation }) {
    const [data,SetData] = useState([])

useEffect(() => {
   
    fetchdata()
   
},[])
 const fetchdata=()=>
 { 
    database()
    .ref(`/Todo/`) 
    .on('value', snapshot => {
        if (snapshot.val() === null) {
            console.log("data not found..")
        }else{
       const Todata = Object.values(null ? console.log("error") : snapshot.val())
          SetData(Todata)
        }
    })
 }
const DeleteTodo=(id)=>{

if (database().ref(`/Todo/${id}`).remove()){
    Alert.alert('Delete ','YOur data Are Sucssefully Deleted ...')
}
} 
 const renderItem = ({ item }) => {
     return(
    <View  style={{margin:10 , backgroundColor:'blue',height:50,width:"95%" , borderRadius:20,flexDirection:'row'}}>
        <View style={{flex:5}}>
    <Text style={{marginLeft:20,paddingTop:15,color:'white',fontSize:20,fontWeight:'bold'}} >{item.Todoname}</Text>
    </View>
    <View style={{flex:1,marginTop:10}}>
    <TouchableWithoutFeedback onPress={()=>navigation.navigate("EditTodo")}>
        <Icon name="circle-edit-outline" size={30} color="white" />
        </TouchableWithoutFeedback>
    </View>  
       
    <View style={{flex:1,marginTop:10}}>
    <TouchableWithoutFeedback  onPress={()=>DeleteTodo(item.Tid)}>
        <Icon name="delete-empty" size={30} color="white" />
        </TouchableWithoutFeedback>
    </View>
  </View>
  );
 }
    return (

            <View style={{ flex: 1 }}>
                <FlatList
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={item => item.Tid}
                />
                <FAB icon="plus" style={{
                        position: 'absolute',
                        margin: 16,
                        right: 0,
                        bottom: 0, backgroundColor: 'green'
                    }}
                        onPress={() => navigation.navigate("AddTodo")} />
            </View>
        );
    }
export default TodoList;