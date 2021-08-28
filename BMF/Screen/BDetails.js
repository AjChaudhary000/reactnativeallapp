import React,{useEffect} from 'react'
import { View, StatusBar, Text, ScrollView } from 'react-native'
import LottieView from 'lottie-react-native';
import bmf from '../api/bmf';
function BDetails({ route, navigation }) {
    const { id } = route.params;
    const [result, setresult] = React.useState([]);
    const [isloading,setloading] = React.useState(true);
    useEffect(async()=>{
        const data = {
            record_id: id,  
          }
          const response = await bmf.post('/getrecordbyid', data);
          setresult(response.data)
        if (response.data.success == "true") {
            setresult(response.data.data)
            setloading(false)
        }else{
            console.log("Not Data Found ..")
        }
       
    },[])
    if (isloading){
        return(
          <View style={{backgroundColor:'white',flex:1 , justifyContent:'center'}}>
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

                <ScrollView >
                    <View style={{ height: 50, width: '95%',  marginTop: 10, borderRadius: 10, marginLeft: 10, marginBottom: 10, marginRight: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>Customer Name</Text>
                        </View>
                        <View style={{ flex: 2, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>{result[0].CustomerName}</Text>
                        </View>
                    </View>
                    <View style={{ height: 50, width: '95%',  borderRadius: 10, marginLeft: 10, marginBottom: 10, marginRight: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>Father Name</Text>
                        </View>
                        <View style={{ flex: 2, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>{result[0].FatherName}</Text>
                        </View>
                    </View>
                    <View style={{ height: 50, width: '95%',  borderRadius: 10, marginLeft: 10, marginBottom: 10, marginRight: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>Contact No</Text>
                        </View>
                        <View style={{ flex: 2, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>{result[0].ContactNo}</Text>
                        </View>
                    </View>
                    <View style={{ height: 100, width: '95%',   borderRadius: 10, marginLeft: 10, marginBottom: 10, marginRight: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>Current Address</Text>
                        </View>
                        <View style={{ flex: 2, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>{result[0].CurrentAddress}</Text>
                        </View>
                    </View>
                    <View style={{ height: 50, width: '95%',  borderRadius: 10, marginLeft: 10, marginBottom: 10, marginRight: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>Assets</Text>
                        </View>
                        <View style={{ flex: 2, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>{result[0].Assets}</Text>
                        </View>
                    </View>
                    <View style={{ height: 50, width: '95%',  borderRadius: 10, marginLeft: 10, marginBottom: 10, marginRight: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>Registration No</Text>
                        </View>
                        <View style={{ flex: 2, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>{result[0].RegistrationNo}</Text>
                        </View>
                    </View>
                    <View style={{ height: 50, width: '95%',  borderRadius: 10, marginLeft: 10, marginBottom: 10, marginRight: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>Chassis No</Text>
                        </View>
                        <View style={{ flex: 2, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>{result[0].ChassisNo}</Text>
                        </View>
                    </View>
                    <View style={{ height: 50, width: '95%',  borderRadius: 10, marginLeft: 10, marginBottom: 10, marginRight: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>Engine No</Text>
                        </View>
                        <View style={{ flex: 2, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>{result[0].EngineNo}</Text>
                        </View>
                    </View>
                    <View style={{ height: 50, width: '95%',  borderRadius: 10, marginLeft: 10, marginBottom: 10, marginRight: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>Installment Start Date</Text>
                        </View>
                        <View style={{ flex: 2, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>{result[0].InstallmentStartdate}</Text>
                        </View>
                    </View>
                    <View style={{ height: 50, width: '95%',  borderRadius: 10, marginLeft: 10, marginBottom: 10, marginRight: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>Maturity Date</Text>
                        </View>
                        <View style={{ flex: 2, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>{result[0].Maturitydate}</Text>
                        </View>
                    </View>
                    <View style={{ height: 50, width: '95%',  borderRadius: 10, marginLeft: 10, marginBottom: 10, marginRight: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>BKT</Text>
                        </View>
                        <View style={{ flex: 2, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>{result[0].BKT}</Text>
                        </View>
                    </View>
                    <View style={{ height: 50, width: '95%',  borderRadius: 10, marginLeft: 10, marginBottom: 10, marginRight: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>EMI</Text>
                        </View>
                        <View style={{ flex: 2, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>{result[0].EMI}</Text>
                        </View>
                    </View>
                    <View style={{ height: 50, width: '95%',  borderRadius: 10, marginLeft: 10, marginBottom: 10, marginRight: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>Total Collectable</Text>
                        </View>
                        <View style={{ flex: 2, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>{result[0].TotalCollectable}</Text>
                        </View>
                    </View>
                    <View style={{ height: 50, width: '95%',  borderRadius: 10, marginLeft: 10, marginBottom: 10, marginRight: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>POS</Text>
                        </View>
                        <View style={{ flex: 2, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>{result[0].POS}</Text>
                        </View>
                    </View>
                    <View style={{ height: 50, width: '95%',  borderRadius: 10, marginLeft: 10, marginBottom: 10, marginRight: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>FOS</Text>
                        </View>
                        <View style={{ flex: 2, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>{result[0].FOS}</Text>
                        </View>
                    </View>
                    <View style={{ height: 50, width: '95%',  borderRadius: 10, marginLeft: 10, marginBottom: 10, marginRight: 10, backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>Finance</Text>
                        </View>
                        <View style={{ flex: 2, margin: 2 }}>
                            <Text style={{ fontSize: 15, fontWeight: 'bold', textAlign: 'center' }}>{result[0].Finance}</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>

        </View>
    );
}
export default BDetails;


















