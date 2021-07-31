import React from 'react'
import {View,Text,TouchableOpacity,Image} from 'react-native'
import * as ImagePicker from 'react-native-image-picker'
function App(){
  const [data,setdata] = React.useState({
    imagepath:null,
  })
  const camaraLaunch =() =>{
    let options = {
      title: 'You can choose one image',
      mediaType:'photo',
      storageOptions:{
        skipBackup:true,
        path:'images',
      },
    };
    ImagePicker.launchCamera(options,(Response)=>{console.log('Response = ', Response)
    if (Response.didCancel) {
      console.log('User cancelled image picker');
    } else if (Response.error) {
      console.log('ImagePicker Error: ', Response.error);
    } else if (Response.customButton) {
      console.log('User tapped custom button: ', Response.customButton);
    } else {
      
      const source = Object.values(Response.assets)
      for (const item in source) {
        if (Object.hasOwnProperty.call(source, item)) {
          const element = source[item];
          setdata({
            ...data,
            imagepath:element.uri
          })
        }
      }
    }
  });
  }
  const GalleryLaunch =()=>{
    let options = {
      title: 'You can choose one image',
      storageOptions:{
        skipBackup:true,
        path:'images',
      },
    };
    ImagePicker.launchImageLibrary(options,(response)=>{console.log('Response = ', response)
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      
      const source = Object.values(response.assets)
      for (const item in source) {
        if (Object.hasOwnProperty.call(source, item)) {
          const element = source[item];
          setdata({
            ...data,
            imagepath:element.uri
          })
        }
      }
    }
  });
  }
  return(
    <View style={{flex:1,justifyContent:'center'}}>
<TouchableOpacity>

      <View style={{width:200,height:200,justifyContent:'center',borderRadius:100,backgroundColor:'green',alignSelf:"center",marginBottom:20}}>
        <Image style={{width:200,height:200,justifyContent:'center',borderRadius:100}} source={{uri:data.imagepath}} />
      </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={camaraLaunch}>
      <View style={{width:140,height:45,justifyContent:'center',borderRadius:20,backgroundColor:'green',alignSelf:"center",marginBottom:20}}>
        <Text style={{color:'white',textAlign:'center',fontSize:20}}>Open a Camara </Text>
      </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={GalleryLaunch}>
      <View style={{width:140,height:45,justifyContent:'center',borderRadius:20,backgroundColor:'green',alignSelf:"center"}}>
        <Text style={{color:'white',textAlign:'center',fontSize:20}}>Open a Gallery </Text>
      </View>
      </TouchableOpacity>
    </View>
  );
}
export default App;