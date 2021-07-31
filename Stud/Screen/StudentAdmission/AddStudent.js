import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput } from 'react-native'
import * as Animatable from 'react-native-animatable'
import Icons from 'react-native-vector-icons/Ionicons'
import { Picker } from '@react-native-picker/picker'
import Student from '../../Components/Student'

function AddStudent({ route, navigation }) {
    const { id, type } = route.params;
    console.log(type)
    console.log(id)
    const catename = Student.filter(item => { return (item.id == id) })
   
    const [data, setdata] = React.useState({
        cselectpicker: (type == 'add') ? '1' : catename[0].Stream,
        sselectpicker: (type == 'add') ? '1' : catename[0].SubCategory,
        divpicker: (type == 'add') ? null : catename[0].Div,
        fullname: (type == 'add') ? null : catename[0].name,
        id: (type == 'add') ? null : catename[0].id,
        index: (type == 'add') ? null :Student.findIndex(item=>(item.id==catename[0].id)),
        Username: '',
        RollNo:(type == 'add') ? null : catename[0].RollNo,
        

    })
    const changefullname = (val) => {
        setdata({
            ...data,
            fullname: val,
            id: Student.length + 1,
            Username: String(val).substring(0, 4) + "001",
            
        })
    }
    const changename=(val)=>{
        setdata({
            ...data,
            fullname: val,

        })
    }
 const changerollno=(val)=>{
    setdata({
        ...data,
        RollNo:val,
        index:Student.findIndex(item=>(item.id==catename[0].id)),
    })
 }
    const AddStudent = (id, unm, cate, subcat,fulnm,div) => {
        if (Student.push({ id: id, Username: unm, name: fulnm, Password: unm, Stream: cate, SubCategory: subcat, Div: div})) {
            alert('Add inserted a Reacord')
            navigation.goBack();
        } else {
            alert('Not Add inserted a Reacord')
        }
    }
    const UpdateStudent = (index,id, cate, subcat, fulnm,div,rollno) => {
       if(Student[index].id=id,
        Student[index].name=fulnm,
        Student[index].RollNo=rollno,
        Student[index].Stream=cate,
        Student[index].SubCategory=subcat,
        Student[index].Div=div){
        alert('Update a Reacord')
        navigation.goBack();
       }else{
        alert(' Not Update a Reacord')
                  }
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <Animatable.View style={{ flexDirection: 'row', flex: 1 }}>
                <TouchableOpacity style={{ margin: 10, width: 50, height: 50, borderRadius: 25, backgroundColor: '#D3EACF', alignItems: 'center', justifyContent: 'center' }} onPress={() => navigation.openDrawer()}>
                    <Icons name="menu" color="white" size={30} />
                </TouchableOpacity>
                <View style={{ marginTop: 10, height: 50, width: 220, justifyContent: 'center', backgroundColor: 'gray', borderRadius: 20 }}>
                   { (type == 'add') ?
                    <Text style={{ textAlign: 'center', fontWeight: 'bold', letterSpacing: 2, fontSize: 25 }}>Add Student</Text>
                    :   <Text style={{ textAlign: 'center', fontWeight: 'bold', letterSpacing: 2, fontSize: 25 }}>Update Student</Text> }
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("AdminProfile")}>
                    <View style={{ margin: 10 }}>
                        <Image style={{ height: 50, width: 50, borderRadius: 25 }} source={{ uri: "https://devtalk.blender.org/uploads/default/original/2X/c/cbd0b1a6345a44b58dda0f6a355eb39ce4e8a56a.png" }} />
                    </View>
                </TouchableOpacity>
            </Animatable.View >

            <Animatable.View animation="bounceIn" duration={1000} style={{
                width: '100%', flex: 5, backgroundColor: '#D3EACF',
                borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: 50
            }}>
                <View style={{ backgroundColor: '#D3EACF', marginLeft: 20, marginTop: 15 }}>
              {   (type =='add')?
                    <Text style={{ fontSize: 30, letterSpacing: 2, fontWeight: 'bold' }}> Add Student </Text>
                    :
                    <Text style={{ fontSize: 30, letterSpacing: 2, fontWeight: 'bold' }}> Update Student </Text> }
                    <View
                        style={{
                            margin: 20,

                        }}>
                       {  (type =='add')?
                       ( <Picker style={{
                            marginLeft: 10,
                            marginRight: 10,
                            fontSize: 20,
                            padding: 5,
                            color: 'black'
                        }}
                            selectedValue={data.cselectpicker}
                            onValueChange={(itemvalue, itemindex) => setdata({ ...data, cselectpicker: itemvalue })}
                        >
                            <Picker.Item label="Select Stream & Category .... " value="1" />
                            {
                                Category.map((item, index) => (
                                    <Picker.Item label={item.category} key={index} value={item.category} />
                                ))
                            }

                        </Picker> )
                        :
                      (  <Picker style={{
                            marginLeft: 10,
                            marginRight: 10,
                            fontSize: 20,
                            padding: 5,
                            color: 'black'
                        }}
                            selectedValue={data.cselectpicker}
                            onValueChange={(itemvalue, itemindex) => setdata({ ...data, cselectpicker: itemvalue })}
                        >
                            <Picker.Item label="Select Stream & Category .... " value="1" />
                            {
                                Category.map((item, index) => (
                                    <Picker.Item label={item.category} key={index} value={item.category} />
                                ))
                            }

                        </Picker> ) }
                    </View>
                   
                    <View
                        style={{
                            marginLeft: 20,
                            marginRight: 20,
                            marginBottom: 20

                        }}>

                       { (type =='add')?
                        <Picker style={{
                            marginLeft: 10,
                            marginRight: 10,
                            fontSize: 20,
                            padding: 5,
                            color: 'black'
                        }}
                            selectedValue={data.sselectpicker}
                            onValueChange={(itemvalue, itemindex) => setdata({ ...data, sselectpicker: itemvalue })}
                        >
                            <Picker.Item label="Select   SubCategory .... " value="1" />
                            {
                                SubCategory.map((item, index) => (

                                    (item.category == data.cselectpicker) ?

                                        <Picker.Item label={item.sub_category} key={index} value={item.sub_category} /> : null

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
                            selectedValue={data.sselectpicker}
                            onValueChange={(itemvalue, itemindex) => setdata({ ...data, sselectpicker: itemvalue })}
                        >
                            <Picker.Item label="Select   SubCategory .... " value="1" />
                            {
                                SubCategory.map((item, index) => (

                                    (item.category == data.cselectpicker) ?

                                        <Picker.Item label={item.sub_category} key={index} value={item.sub_category} /> : null

                                ))
                            }

                        </Picker> }
                    </View>
                    <View
                        style={{
                            marginLeft: 20,
                            marginRight: 20,
                            marginBottom: 20
                        }}>
                       {  (type =='add')?
                       ( <Picker style={{
                            marginLeft: 10,
                            marginRight: 10,
                            fontSize: 20,
                            padding: 5,
                            color: 'black'
                        }}
                            selectedValue={data.divpicker}
                            onValueChange={(itemvalue, itemindex) => setdata({ ...data, divpicker: itemvalue })}
                        >
                            <Picker.Item label="Select Div .... " value="1" />
                           
                                    <Picker.Item label="A" value="A" />
                                    <Picker.Item label="B" value="B" />
                                    <Picker.Item label="C" value="C" />
                                    <Picker.Item label="D" value="D" />
                               
                        </Picker> )
                        :
                      (  <Picker style={{
                            marginLeft: 10,
                            marginRight: 10,
                            fontSize: 20,
                            padding: 5,
                            color: 'black'
                        }}
                            selectedValue={data.divpicker}
                            onValueChange={(itemvalue, itemindex) => setdata({ ...data, divpicker: itemvalue })}
                        >
                             <Picker.Item label="Select Div .... " value="1" />
                           
                           <Picker.Item label="A" value="A" />
                           <Picker.Item label="B" value="B" />
                           <Picker.Item label="C" value="C" />
                           <Picker.Item label="D" value="D" />

                        </Picker> ) }
                    </View>
                    <View
                        style={{
                            marginLeft: 20,
                            marginRight: 20,
                            marginTop: 20
                        }}>
                       {  (type =='add')?
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
                            placeholder="Full Name  "
                            onChangeText={(val) => changefullname(val)}
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
                            placeholder={catename[0].name}
                            onChangeText={(val) => changename(val)}
                        /> }
                    </View>
                    {  (type =='add')?
                    null :   
                    <View
                    style={{
                        marginLeft: 20,
                        marginRight: 20,
                        marginTop: 20
                    }}>
                   
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
                        placeholder={String(catename[0].RollNo)}
                        onChangeText={(val) => changerollno(val)}
                    /> 
                    
                    </View> 
                    }
                    {  (type =='add')?
                    <TouchableOpacity onPress={() => AddStudent(data.id, data.Username, data.cselectpicker, data.sselectpicker, data.fullname,data.divpicker)}>
                        <View style={{ backgroundColor: 'green', width: 180, height: 50, margin: 20, borderRadius: 25, alignSelf: 'flex-end', justifyContent: 'center' }} >
                            <Text style={{ textAlign: 'center', padding: 2, fontSize: 20, fontWeight: 'bold', color: 'white' }}>Add Student
                            </Text></View>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => UpdateStudent(data.index,data.id, data.cselectpicker, data.sselectpicker, data.fullname,data.divpicker,data.RollNo)}>
                        <View style={{ backgroundColor: 'green', width: 180, height: 50, margin: 20, borderRadius: 25, alignSelf: 'flex-end', justifyContent: 'center' }} >
                            <Text style={{ textAlign: 'center', padding: 2, fontSize: 20, fontWeight: 'bold', color: 'white' }}>Update Student
                            </Text></View>
                    </TouchableOpacity> }
                </View>
            </Animatable.View>
        </View>
    );
}
export default AddStudent;



