import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput,FlatList} from 'react-native'
import * as Animatable from 'react-native-animatable'
import Icons from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/Feather'
import Student from '../../Components/Student'
function StudentDetails({ navigation }) {
    const [DStudent,setDStudent]=React.useState({
        Searchname:''
    })
    const SearchStudent=(val)=>{
        setDStudent({
            ...DStudent,
            Searchname:val
        })
    }
   
    const Data = (DStudent.Searchname != '') ? 
    Student.filter(item=>{return ((item.name).includes(DStudent.Searchname) || (item.Stream).includes(DStudent.Searchname ) || (item.SubCategory).includes(DStudent.Searchname))}) :
     Student.map(item=>{return item }) 
  
    
    const renderdata=({item})=>{
        return(
            <View style={{height:50,width:'95%',borderRadius:10,marginLeft:10,marginBottom:10,marginRight:10,backgroundColor:'white',flexDirection:'row',alignItems:'center'}}>
            <View style={{flex:1,margin:2}}>
                <Text style={{fontSize:15,fontWeight:'bold',textAlign:'center'}}>{item.id}</Text>
            </View>
            <View style={{flex:2,margin:2}}>
                <Text style={{fontSize:15,fontWeight:'bold',textAlign:'center'}}>{item.name}</Text>
            </View>
            <View style={{flex:2,margin:2}}>
                <Text style={{fontSize:15,fontWeight:'bold',textAlign:'center'}}>{item.Stream}</Text>
            </View>
            <View style={{flex:2,margin:2}}>
      
                <Text style={{fontSize:15,fontWeight:'bold',textAlign:'center'}}>{item.SubCategory}</Text>
            </View>
            <View style={{flex:1,margin:2}}>
                <TouchableOpacity onPress={()=>navigation.navigate("AddStudent",{ id: item.id,type:'update'})}>
                <Icon name="edit" size={20} color='green'/>
                </TouchableOpacity>
            </View>
            <View style={{flex:1,margin:2}}>
                <TouchableOpacity>
                <Icon name="delete" size={20} color='red'/>
                </TouchableOpacity>
            </View>
            <View style={{flex:1,margin:2}}>
                <TouchableOpacity>
                <Icons name="eye" size={20} color='blue'/>
                </TouchableOpacity>
            </View>
            </View>
        );
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Animatable.View style={{ flexDirection: 'row', flex: 0.5 }}>
                <TouchableOpacity style={{ margin: 10, width: 50, height: 50, borderRadius: 25, backgroundColor: '#D3EACF', alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.openDrawer()}>
                    <Icons name="menu" color="white" size={30} />
                </TouchableOpacity>
                <View style={{ marginTop: 10, height: 50, width: 220, justifyContent: 'center' ,backgroundColor:'gray',borderRadius:20}}>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', letterSpacing: 2, fontSize: 25 }}>Student Details</Text>
                </View>
                <TouchableOpacity onPress={()=>navigation.navigate("AdminProfile")}>
            <View style={{margin:10}}>
                <Image style={{height:50,width:50,borderRadius:25}} source={{uri:"https://devtalk.blender.org/uploads/default/original/2X/c/cbd0b1a6345a44b58dda0f6a355eb39ce4e8a56a.png"}}/>
            </View>
            </TouchableOpacity>
            </Animatable.View >

            <Animatable.View animation="bounceIn" duration={1000} style={{
                width: '100%', flex: 15, backgroundColor: '#D3EACF',
                borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: 50
            }}>
                 <View style={{height:50,width:'95%',borderRadius:30,margin:10,flexDirection:'row',backgroundColor:'white',flexDirection:'row'}}>
            <View style={{flex:5,margin:2}}>
            <TextInput
                     style={{
                         marginLeft: 20,
                         marginRight: 10,
                         borderColor: "green",
                         borderBottomWidth: 2,
                         width: '100%',
                         fontSize: 20,
                         padding: 5
                         , color: 'black'
                     }}
                     placeholder="Search "
                    
                     onChangeText={(val) => SearchStudent(val)}
                 />
            </View>
            <View style={{flex:1,margin:2,marginLeft:30,marginTop:10}}>
                <Icon  name="search" color="black" size={30}/>
            </View>
            </View>
                <View style={{height:50,width:'95%',borderRadius:10,marginLeft:10,marginBottom:10,marginTop:10,marginRight:10,backgroundColor:'white',flexDirection:'row',alignItems:'center'}}>
            <View style={{flex:1,margin:2}}>
                <Text style={{fontSize:15,fontWeight:'bold',textAlign:'center'}}>ID</Text>
            </View>
            <View style={{flex:2,margin:2}}>
                <Text style={{fontSize:15,fontWeight:'bold',textAlign:'center'}}>Name</Text>
            </View>
            <View style={{flex:2,margin:2}}>
                <Text style={{fontSize:15,fontWeight:'bold',textAlign:'center'}}>Category</Text>
            </View>
            <View style={{flex:2,margin:2}}>
                <Text style={{fontSize:15,fontWeight:'bold',textAlign:'center'}}>Sub-Category</Text>
            </View>
            <View style={{flex:1,margin:2}}>
            <Text style={{fontSize:12,fontWeight:'bold',textAlign:'center'}}>Edit</Text>
            </View>
            <View style={{flex:1,margin:2}}>
            <Text style={{fontSize:12,fontWeight:'bold',textAlign:'center'}}>Delete</Text>
            </View>
            <View style={{flex:1,margin:2}}>
            <Text style={{fontSize:12,fontWeight:'bold',textAlign:'center'}}>View</Text>
            </View>
            </View>
                <FlatList data = {Data} renderItem={renderdata} style={{marginTop:10}} />
            </Animatable.View>
        </View>
    );
}
export default StudentDetails;


















