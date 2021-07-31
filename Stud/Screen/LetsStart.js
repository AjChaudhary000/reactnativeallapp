import React from 'react'
import {View,StyleSheet,Text,TouchableOpacity} from 'react-native'
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialIcons'
function LetsStart({navigation}){
return(
<View style={{flex:1,backgroundColor:'#D3EACF'}}>
        <Animatable.View animation="bounceOutLeft" style={{flex:2}}>
            
        </Animatable.View>
        <Animatable.View animation="bounceInUp"  style={{flex:1,backgroundColor:'white', borderTopLeftRadius:20 , borderTopRightRadius:20}} >
              <Text style={{margin:20,fontSize:25,fontWeight:'bold'}}> Lets Start To Student Admission Process ..</Text>
              <TouchableOpacity onPress={()=>navigation.navigate("SignIn")}>
              <View style={{backgroundColor:'green',width:150,height:50,margin:20,borderRadius:25,alignSelf:'flex-end'}} >
                <Text style={{textAlign:'center',padding:2,fontSize:20,fontWeight:'bold',color:'white'}}>Lets Start  <Icon name="navigate-next" size={40} color="white" />
               </Text>
              </View>
              </TouchableOpacity>
            </Animatable.View>

</View>
);
}
export default LetsStart;