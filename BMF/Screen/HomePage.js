import React, { useEffect } from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput, FlatList, StatusBar} from 'react-native'
import Icons from 'react-native-vector-icons/Ionicons'
import Icon from 'react-native-vector-icons/Feather'
import LottieView from 'lottie-react-native';
import bmf from '../api/bmf';

function HomePage({ navigation }) {
    
    const [BDetails, SetBDetails] = React.useState({
        Searchname: ''
    })
    const SearchStudent = (val) => {
        
        SetBDetails({
            ...BDetails,
            Searchname: val
        })

    }

    const [result, setresult] = React.useState([]);
    const [searchresult, setsearchresult] = React.useState([]);
    const [isloading, setloading] = React.useState(true);
    const [searchloading, setsearchloading] = React.useState(false);
    useEffect(async () => {
        fetchallrecord();
    }, [])
    const [searchvalue,setsearchvalue] = React.useState(false)
    const [datanot,setdatanot] = React.useState(false)
    const fetchallrecord =  async () => {
        const response = await bmf.post('/getallrecord');
        if (response.data.success == "true") {
            setresult(response.data.data)

            setloading(false)
        } else {
            console.log("Not Data Found ..")
        }
    }
    const fetchSearch = async () => {
        setsearchloading(true)
       
        const data = {
            registration_no: BDetails.Searchname,
        }
        const response = await bmf.post('/searchrecord', data);
        setresult(response.data)
        
        if (response.data.success == "true") {
            setsearchresult(response.data.data)
            setsearchloading(false)
            setsearchvalue(true);
        } else {
            console.log("Not Data Found ..")
            
        }
        
        
    }
     (searchvalue != '') ? null : fetchallrecord;
    const Data = (searchvalue) ? searchresult : result;

     
     

    const renderdata = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate("BDetails", { id: item.DId })}>
                <View style={{ height: 70, width: '95%', borderRadius: 10, marginLeft: 10, marginBottom: 10, marginRight: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                    
                    <View style={{ flex: 2, margin: 2 }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>{item.CustomerName}</Text>
                    </View>
                    <View style={{ flex: 2, margin: 2 }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>{item.RegistrationNo}</Text>
                    </View>

                </View>
            </TouchableOpacity>
        );
    }
    if (isloading) {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, justifyContent: 'center' }}>
                <StatusBar hidden />
                <LottieView source={require('../assets/Json/loading.json')} autoPlay loop />
            </View>
        );
    }
    return (
       
         
        <View style={{ flex: 1, backgroundColor: '#F1F1F3' }}>
       
            <StatusBar backgroundColor="#8A2CE2" />
            <View style={{ flex: 1 }}>

                <View style={{ height: 50, justifyContent: 'center', backgroundColor: '#8A2CE2', borderRadius: 0 }}>
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', letterSpacing: 2, fontSize: 25, color: 'white' }}>BMF</Text>
                </View>

            </View >

            <View style={{
                width: '100%', flex: 15, backgroundColor: '',
                borderTopLeftRadius: 0, borderTopRightRadius: 0, marginTop: 10
            }}>
                <View style={{ height: 50, width: '95%', borderRadius: 30, margin: 10, flexDirection: 'row', backgroundColor: 'white', flexDirection: 'row' }}>
                    <View style={{ flex: 5, margin: 2 }}>
                        <TextInput
                            style={{
                                marginLeft: 20,
                                marginRight: 10,
                                borderColor: "#F1F1F3",
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
                    <TouchableOpacity onPress={() => fetchSearch()}>
                        <View style={{ flex: 1, margin: 2, marginLeft: 30, marginTop: 10 }}>
                            <Icon name="search" color="black" size={30} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 50, width: '95%', borderRadius: 10, marginLeft: 10, marginBottom: 10, marginTop: 10, marginRight: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                    
                    <View style={{ flex: 2, margin: 2 }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>CustomerName</Text>
                    </View>
                    <View style={{ flex: 2, margin: 2 }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>RegistrationNo</Text>
                    </View>

                </View> 
                <View style={{ flex: 1, justifyContent: 'center' }}>
                { (searchloading)? <LottieView source={require('../assets/Json/loading1.json')} autoPlay loop /> : 
                 <FlatList data={Data} renderItem={renderdata} style={{ marginTop: 10 }} keyExtractor={item => item.DId} />}
                  { (Data.length == 0 )? <LottieView source={require('../assets/Json/dataNotfound.json')} autoPlay loop /> : null}
                </View>
               
            </View>
        </View>
        
    );
}
export default HomePage;

















