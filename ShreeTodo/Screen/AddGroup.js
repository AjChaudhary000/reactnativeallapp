import React from 'react'
import { View, Dimensions, Text, TextInput, TouchableOpacity, Modal ,Image} from 'react-native'
import { TriangleColorPicker } from 'react-native-color-picker'
import Icon from 'react-native-vector-icons/AntDesign'
import * as ImagePicker from 'react-native-image-picker'
function AddGroup() {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalVisible1, setModalVisible1] = React.useState(false);
    const [colorcode, setcolorcode] = React.useState('blue')
    const [color1, setcolor1] = React.useState(colorcode)
    React.useEffect(() => {
        if (colorcode == color1) {

        } else {
            setcolor1(colorcode)
            setModalVisible(false)
        }
    })
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
    return (
        <View style={{ flex: 1, backgroundColor: '#E6DDDA' }}>

            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => { setModalVisible(!modalVisible) }}>
                <View style={{
                    flex: 1,
                    width: Dimensions.get('window').width - 20,
                    backgroundColor: 'white',
                    borderRadius: 20,
                    marginTop: 50,
                    alignSelf: 'center',
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                    paddingBottom: 50,
                    marginBottom: 100
                }}>
                    <View style={{
                        width: 50,
                        height: 50,
                        backgroundColor: 'white',
                        borderRadius: 100,
                        padding: 2,
                        top: -25,
                        marginHorizontal: -10,
                        alignSelf: 'flex-end',
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5
                    }}><Text style={{
                        color: 'black',
                        fontSize: 33,
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }} onPress={() => setModalVisible(false)} >X</Text>
                    </View>

                    <TriangleColorPicker
                        oldColor='purple'
                        onColorSelected={color => setcolorcode(color)}
                        style={{ flex: 2, marginHorizontal: 20 }}
                    />
                </View>
            </Modal>

            <Modal animationType="slide" transparent={true} visible={modalVisible1} onRequestClose={() => { setModalVisible1(!modalVisible1) }}>
                <View style={{
                    flex: 1,
                    width: Dimensions.get('window').width - 20,
                    backgroundColor: 'white',
                    borderRadius: 20,
                    marginTop: 50,
                    alignSelf: 'center',
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 2
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                    paddingBottom: 50,
                    marginBottom: 100
                }}>
                    <View style={{
                        width: 50,
                        height: 50,
                        backgroundColor: 'white',
                        borderRadius: 100,
                        padding: 2,
                        top: -25,
                        marginHorizontal: -10,
                        alignSelf: 'flex-end',
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2
                        },
                        shadowOpacity: 0.25,
                        shadowRadius: 4,
                        elevation: 5
                    }}><Text style={{
                        color: 'black',
                        fontSize: 33,
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }} onPress={() => setModalVisible1(false)} >X</Text>
                    </View>

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
                </View>
            </Modal>
            <View style={{ flex: 1, width: Dimensions.get('window').width }}>
                <Text style={{ fontSize: 30, color: 'black', marginTop: 50, marginLeft: 10 }}> Create Group .....</Text>
                <TextInput placeholder="Group Name " style={{ marginTop: 30, marginLeft: 20, borderBottomWidth: 2, width: '90%', height: 50, fontSize: 20 }} />

                <View style={{ width: '90%', height: 80, backgroundColor: 'white', marginTop: 20, alignSelf: 'center', borderRadius: 20, flexDirection: 'row' }}>
                    <View style={{ flex: 1.5, height: 50, backgroundColor: colorcode, borderRadius: 20, marginTop: 15, marginLeft: 15 }}>

                    </View>
                    <View style={{ flex: 6, height: 50, borderRadius: 20, marginTop: 20 }}>
                        <Text style={{ fontSize: 30, color: 'black', marginLeft: 30 }}>Select Color</Text>
                    </View>
                    <View style={{ flex: 1.2, height: 50, borderRadius: 20, marginTop: 20, marginRight: 10 }}>
                        <TouchableOpacity onPress={() => setModalVisible(true)}>
                            <Icon name="rightcircle" size={35} color="blue" />
                        </TouchableOpacity>
                    </View>
                </View>
                
                <View style={{ width: '90%', height: 80, backgroundColor: 'white', marginTop: 20, alignSelf: 'center', borderRadius: 20, flexDirection: 'row' }}>
                    <View style={{ flex: 1.5, height: 50, backgroundColor: 'gray', borderRadius: 20, marginTop: 15, marginLeft: 15 }}>
                    <Image style={{flex: 1.5, height: 50,justifyContent:'center',borderRadius:20}} source={{uri:data.imagepath}} />
                    </View>
                    <View style={{ flex: 6, height: 50, borderRadius: 20, marginTop: 20 }}>
                        <Text style={{ fontSize: 30, color: 'black', marginLeft: 30 }}>Select Image</Text>
                    </View>
                    <View style={{ flex: 1.2, height: 50, borderRadius: 20, marginTop: 20, marginRight: 10 }}>
                        <TouchableOpacity onPress={() => setModalVisible1(true)}>
                            <Icon name="rightcircle" size={35} color="blue" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}
export default AddGroup;