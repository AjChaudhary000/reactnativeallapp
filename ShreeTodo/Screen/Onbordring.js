import React,{useState,useRef} from 'react'
import {View, StyleSheet,FlatList,Text,useWindowDimensions,Dimensions,Animated,StatusBar} from 'react-native'
import Slider from './components/Slider'
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Page from './Page';
import NextButton from './nextbutton';
function Onboardring({navigation}){
    const  [currentIndex,setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);
    const viewableItemChanged = useRef(({viewableItems})=>{
        setCurrentIndex(viewableItems[0].index);
    }).current;
    const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50 }).current;
    const scrollTo = async()=>{
        if (currentIndex < Slider.length - 1){
            slidesRef.current.scrollToIndex({index:currentIndex + 1});
        }
        else{
            try {
                await AsyncStorage.setItem("@Onbordring",'true')
                navigation.replace("HomeScreen")
            } catch (e) {
                console.log(e)
            }
        }
    }
    const data = Slider.map(item=>{return item})
const reanderitem=({item})=>{
    
return(
    <View style={{flex:1 }}>
         <StatusBar hidden />
        <View style={{backgroundColor:'',flex:1,width:Dimensions.get('window').width}}>
                <LottieView source={item.image} autoPlay loop />
         </View>
         <View style={{backgroundColor:'white',flex:0.3}}>
        <Text style={{textAlign:'center',fontSize:25,fontWeight:'bold'}}>{item.title}</Text>
        <Text style={{textAlign:'center',fontSize:15,width:Dimensions.get('window').width - 40, marginLeft:20}}>{item.Description}</Text>
        </View>
    </View>
);
}

    return(
       <View style={{flex:1,backgroundColor:'white',alignSelf:'center'}}>
           <View style={{flex:6}}>
           <FlatList data={data}
            renderItem={reanderitem} 
             horizontal
             showsHorizontalScrollIndicator={false}
             pagingEnabled
             bounces={false} 
             keyExtractor={(item)=>item.id}
             onScroll={Animated.event([{ nativeEvent :{ contentOffset:{x:scrollX}}}], {
                 useNativeDriver:false
             })}
             scrollEventThrottle={32}
             onViewableItemsChanged={viewableItemChanged}
             viewabilityConfig={viewConfig}
             ref={slidesRef}
             />
             </View>
             <Page data={data} scrollX={scrollX} />
             <NextButton scrollTo={scrollTo} percentage ={(currentIndex + 1)* (100 / data.length)} />
       </View>
    );
}
export default Onboardring;