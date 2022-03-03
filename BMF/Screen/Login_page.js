import React, { useEffect } from 'react'
import { View, StyleSheet, Text, Alert, TouchableOpacity, TextInput, Image } from 'react-native'
import Icons from 'react-native-vector-icons/Entypo'
import AsyncStorage from '@react-native-async-storage/async-storage'
import bmf from '../api/bmf';

function Login_Page({ navigation }) {
  const [result, setresult] = React.useState({});
  const [log, setlog] = React.useState(false);
  const [Bname, Bsetname] = React.useState('');
  const [data, setdata] = React.useState({
    mobileno: '',
    mpin: '',
  })
  useEffect(() => {
    checklog();
  }, [])


  const checklog = async () => {
    try {
      const logdata = await AsyncStorage.getItem("@LoginData")
      var bname = await AsyncStorage.getItem("@Name")
      var mobile = await AsyncStorage.getItem("@mobileno")
      if (logdata != null) {
        setlog(true)
        Bsetname(bname)
        setdata({
          ...data,
          mobileno: mobile
        })
      }

    } catch (e) {
      console.log(e)
    }
  }


  const changeMobileno = (val) => {

    setdata({
      ...data,
      mobileno: val
    })
  }
  const chnageMPin = (val) => {
    setdata({
      ...data,
      mpin: val
    })
  }
  const logincheck = async (mobileno, mpin) => {

    const data = {
      mobile_number: mobileno,
      m_pin: mpin
    }
    const response = await bmf.post('/getuser', data);
    setresult(response.data)


    if (response.data.success == "true") {
      if (response.data.data[0].UBlock == "0") {
        try {
          await AsyncStorage.setItem("@LoginData", 'true')
          await AsyncStorage.setItem("@mobileno", response.data.data[0].UMobileNo)
          await AsyncStorage.setItem("@Name", response.data.data[0].UName)
          navigation.replace("HomePage")
        } catch (e) {
          console.log(e)
        }
      } else {
        Alert.alert('Invalid User!', 'User Are Block.', [
          { text: 'Okay' }
        ]);
      }

    } else {
      Alert.alert('Invalid User!', 'Username or password is incorrect.', [
        { text: 'Okay' }
      ]);
    }



  }

  const pintolog = async (mobileno, mpin) => {
    const data = {
      mobile_number: mobileno,
      m_pin: mpin
    }
     const response = await bmf.post('/getuser', data);
    
    setresult(response.data)


    if (response.data.success == "true") {
      if (response.data.data[0].UBlock == "0") {
        try {
          await AsyncStorage.setItem("@LoginData", 'true')
          await AsyncStorage.setItem("@mobileno", response.data.data[0].UMobileNo)
          await AsyncStorage.setItem("@Name", response.data.data[0].UName)
          navigation.replace("HomePage")
        } catch (e) {
          console.log(e)
         
         
        }
      } else {
        Alert.alert('Invalid User!', 'User Are Block.', [
          { text: 'Okay' }
        ]);
      }

    } else {
      Alert.alert('Invalid User!', 'Username or password is incorrect.', [
        { text: 'Okay' }
      ]);
    }

  }
  return (
    <View style={styles.con}>

      <View style={{ flex: (log) ? 2 : 1, justifyContent: log ? 'center' : null }} >
        {(log) ?
          <Image style={{ width: 200, height: 200, alignSelf: 'center' }} source={require('../assets/bmf3.png')} />
          :
          <Text style={{ color: 'white', margin: 20, marginTop: 50, fontSize: 40 }}>WelCome</Text>
        }
      </View>
      <View style={{
        flex: 2,
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
      }} >

        <View
          style={{
            margin: 20,
            flexDirection: "row"
          }}>
          {log ?
            <Text style={{ color: 'red', marginLeft: 20, marginTop: 10, fontSize: 20 }}>WelCome </Text>
            : <Icons name="phone"
              color="#8A2CE2"
              size={30} />
          }
          {log ?
         
            <Text style={{ color: 'black', marginLeft: 20, marginTop: 10, fontSize: 30, marginRight:30,height:60 }}>{Bname}</Text>
            :
            <TextInput
              style={{
                marginLeft: 20,
                borderColor: "#8A2CE2",
                borderBottomWidth: 2,
                width: "80%",
                fontSize: 18,
                padding: 10
                , color: 'black'
              }}
              placeholder="Mobile No "
              onChangeText={(val) => changeMobileno(val)}
              keyboardType={'numeric'}
              maxLength={10}
            />
          }
        </View>

        <View style={{ margin: 20, flexDirection: "row" }}>
          <Icons name="lock" color="#8A2CE2" size={30} />
          <TextInput style={{
            marginLeft: 20,
            borderColor: "#8A2CE2",
            borderBottomWidth: 2,
            width: "80%",
            fontSize: 20,
            padding: 10, color: 'black'
          }}
            placeholder="MPin "
            onChangeText={(val) => chnageMPin(val)}
            keyboardType={'numeric'}
            maxLength={4}
          />
        </View>
        <View style={{ margin: 20 }}>
          <TouchableOpacity onPress={() => log ? pintolog(data.mobileno, data.mpin) : logincheck(data.mobileno, data.mpin)}>
            <View style={{
              backgroundColor: '#8A2CE2',
              width: '100%',
              height: 50,
              borderRadius: 20,
              justifyContent: 'center'
            }}
            >
              <Text style={{ color: 'white', textAlign: 'center', fontSize: 25 }}>Login </Text>
            </View>
          </TouchableOpacity>

        </View>
      </View>

    </View>
  );
}
export default Login_Page;
const styles = StyleSheet.create({
  con: {
    flex: 1,
    backgroundColor: '#8A2CE2'
  }
})