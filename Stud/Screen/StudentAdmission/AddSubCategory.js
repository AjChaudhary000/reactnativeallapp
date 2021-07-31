import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput } from 'react-native'
import * as Animatable from 'react-native-animatable'
import Icons from 'react-native-vector-icons/Ionicons'
import { Picker } from '@react-native-picker/picker'
import SubCategory from '../../Components/SubCategory'
function AddSubCategory({route, navigation }) {
    const { id, type } = route.params;
    console.log(type)
    console.log(id)
   
    const catename = SubCategory.filter(item => {return (item.id == id)})
    const [data,setdata] = React.useState({
        selectpicker :  (type=='add') ? '1' : catename[0].category ,
        subcategory:'',
        index:null,
        id:''
    })
    const changeSubcategory=(val)=>{
        setdata({
            ...data,
            subcategory:val,
            id:SubCategory.length + 1,
        })
    }
    const updtechangeSubcategory=(val)=>{
        setdata({
            ...data,
            subcategory:val,
            index:SubCategory.findIndex(item=>(item.id==id)),
            id:catename[0].id
        })
    }
    const AddSubCate=(id,selpicker,subcate)=>{
        if(SubCategory.push({id:id,category:selpicker,sub_category:subcate})){
            alert('Add inserted a Reacord')
            navigation.goBack();
        }else{
            alert('Not Add inserted a Reacord')
        }
    }
    const updateSubCate=(id,index,selpicker,subcate)=>{
        if(SubCategory[index].id=id,SubCategory[index].category=selpicker,SubCategory[index].sub_category=subcate){
            alert('update a Reacord')
            navigation.goBack();
        }else{
            alert('Not update a Reacord')
        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Animatable.View style={{ flexDirection: 'row', flex: 2 }}>
                <TouchableOpacity style={{ margin: 10, width: 50, height: 50, borderRadius: 25, backgroundColor: '#D3EACF', alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.openDrawer()}>
                    <Icons name="menu" color="white" size={30} />
                </TouchableOpacity>
                <View style={{ marginTop: 10, height: 50, width: 220, justifyContent: 'center', backgroundColor: 'gray', borderRadius: 20 }}>
                    {(type=='add') ?
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', letterSpacing: 2, fontSize: 25 }}>Add Sub-Category</Text>
                    :  <Text style={{ textAlign: 'center', fontWeight: 'bold', letterSpacing: 2, fontSize: 20 }}>Update Sub-Category</Text>
                    }
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("AdminProfile")}>
                    <View style={{ margin: 10 }}>
                        <Image style={{ height: 50, width: 50, borderRadius: 25 }} source={{ uri: "https://devtalk.blender.org/uploads/default/original/2X/c/cbd0b1a6345a44b58dda0f6a355eb39ce4e8a56a.png" }} />
                    </View>
                </TouchableOpacity>
            </Animatable.View >

            <Animatable.View animation="bounceIn" duration={1000} style={{
                width: '100%', flex: 2, backgroundColor: '#D3EACF',
                borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: 50
            }}>
                <View style={{ backgroundColor: '#D3EACF', marginLeft: 20, marginTop: 15 }}>
                {(type=='add') ?
                    <Text style={{ fontSize: 30, letterSpacing: 2, fontWeight: 'bold' }}> Add Sub-Category </Text>
                    :  <Text style={{ fontSize: 30, letterSpacing: 2, fontWeight: 'bold' }}> Update Sub-Category </Text>
                    }
                    <View
                        style={{
                            margin: 20,

                        }}>
                         {(type=='add') ?
                        <Picker style={{
                            marginLeft: 10,
                            marginRight: 10,
                            fontSize: 20,
                            padding: 5,
                            color: 'black'
                        }}
                        selectedValue={data.selectpicker}
                        onValueChange={(itemvalue,itemindex)=>setdata({...data,selectpicker:itemvalue})}
                        >
                             <Picker.Item label="Select Stream & Category .... " value="1"/>
                            {
                                Category.map((item,index)=>(
                                    <Picker.Item label={item.category} key={index} value={item.category}/>
                                ))
                            }

                        </Picker>
                        :
                        <Picker style={{
                            marginLeft: 10,
                            marginRight: 10,
                            fontSize: 20,
                            padding: 5,
                            color: 'black'
                        }}
                        selectedValue={data.selectpicker}
                        onValueChange={(itemvalue,itemindex)=>setdata({...data,selectpicker:itemvalue})}
                        >
                            
                            {
                                Category.map((item,index)=>(
                                    <Picker.Item label={item.category} key={index} value={item.category}/>
                                ))
                            }

                        </Picker>
                        }
                    </View>
                    <View
                        style={{
                            marginLeft: 20,
                            marginRight: 20,
                            marginTop: 20
                        }}>
                     {(type=='add') ?
                        <TextInput
                            style={{
                                marginLeft: 10,
                                marginRight: 10,
                                borderColor: "green",
                                borderBottomWidth: 2,
                                width: "95%",
                                fontSize: 20,
                                padding: 5
                                , color: 'black'
                            }}
                            placeholder="Sub-Category "
                            onChangeText={(val) => changeSubcategory(val)}
                        />
                        :
                        <TextInput
                            style={{
                                marginLeft: 10,
                                marginRight: 10,
                                borderColor: "green",
                                borderBottomWidth: 2,
                                width: "95%",
                                fontSize: 20,
                                padding: 5
                                , color: 'black'
                            }}
                            placeholder={catename[0].sub_category}
                            onChangeText={(val) => updtechangeSubcategory(val)}
                        />  
                        
                        }
                    </View>
                    {(type=='add') ?
                    <TouchableOpacity onPress={()=>AddSubCate(data.id,data.selectpicker,data.subcategory)}>
                    <View style={{ backgroundColor: 'green', width: 180, height: 50, margin: 20, borderRadius: 25, alignSelf: 'flex-end', justifyContent: 'center' }} >
                        <Text style={{ textAlign: 'center', padding: 2, fontSize: 20, fontWeight: 'bold', color: 'white' }}>Add Sub-Category
                        </Text></View>
                        </TouchableOpacity>
                            :
                        <TouchableOpacity onPress={()=>updateSubCate(data.id,data.index,data.selectpicker,data.subcategory)}>
                    <View style={{ backgroundColor: 'green', width: 180, height: 50, margin: 20, borderRadius: 25, alignSelf: 'flex-end', justifyContent: 'center' }} >
                        <Text style={{ textAlign: 'center', padding: 2, fontSize: 20, fontWeight: 'bold', color: 'white' }}>Update Sub-Category
                        </Text></View>
                        </TouchableOpacity>
                    }
                </View>

            </Animatable.View>
        </View>
    );
}
export default AddSubCategory;


















