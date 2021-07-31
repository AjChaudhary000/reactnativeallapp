import React,{useEffect} from 'react'
import {View,Text, TouchableOpacity, TextInput,StatusBar} from 'react-native'
import Icons from 'react-native-vector-icons/Octicons'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
function Header(){
    const [date ,setdate] = React.useState('')
    const [searchbar,setsearchbar] = React.useState(false)
    useEffect(()=>{     
   const d = Date()
   var dt = ""
   for (let i = 0; i < 15; i++) {
      dt += d[i]    
   }
   setdate(dt)
    },[])
    const visibleSearch = () =>{
      setsearchbar(true)
    } 
    const disbleSearch = () =>{
        setsearchbar(false)
      } 
return(
<View style={{flex:1}}>
    <StatusBar hidden/>
    <View style={{flexDirection:'row',backgroundColor:'white',height:60,borderBottomLeftRadius:10,borderBottomRightRadius:10}}>
        <View style={{marginTop:20,marginLeft:10,flex:1}}>
            <Icons name="settings" size={32} color='blue'/>
        </View>
        <View style={{marginTop:10,flex:5}}>
            {searchbar ? 
            <View >
                <TextInput placeholder="Search..." style={{height:40,width:'90%',borderRadius:20,borderWidth:2,padding:10,borderColor:'blue'}} />
            </View>
            : 
            <View>
             <Text style={{fontSize:18,color:'gray',textAlign:'center'}}>{date}</Text>
             <Text style={{fontSize:24,color:'black',textAlign:'center'}}>All Group</Text>
             </View>
            }
           
        </View>
        <View style={{marginTop:20 ,flex:1}}>
        {searchbar ? 
            <TouchableOpacity onPress={disbleSearch}>
            <Icon name="close" size={32} color='blue'/>
            </TouchableOpacity>
        :
        <TouchableOpacity onPress={visibleSearch}>
            <Icons name="search" size={32} color='blue'/>
            </TouchableOpacity>
        }
        </View>
    </View>
</View>
);
} 
export default Header;  