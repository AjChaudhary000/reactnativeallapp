import React,{useRef,useEffect} from 'react'
import {View,Text,TouchableOpacity,Animated} from 'react-native'
import Svg,{G,Circle} from 'react-native-svg'
import Icons from 'react-native-vector-icons/AntDesign'
function NextButton({percentage,scrollTo}){
const size = 128;
const strokewidth = 2;
const center = size / 2;
const radius = size / 2 - strokewidth / 2 ;
const circumference = 2 * Math.PI * radius;
const progressAnimation = useRef(new Animated.Value(0)).current;
const progresRef = useRef(null);

    return(
        <View style={{flex:1,justifyContent:'center',alignItems:'center',marginBottom:40}}>
           <Svg width={size} height={size} >
               <G rotation="-90" origin={center}>
            <Circle stroke="#E6E7E8" cx={center} cy={center} r={radius} strokeWidth={strokewidth}/>
            <Circle stroke="green" 
            cx={center} 
            cy={center} 
            r={radius} 
            ref={progresRef}
            strokeWidth={strokewidth}
            strokeDasharray={circumference}
            strokeDashoffset = {circumference - (circumference * percentage ) / 100}
            />
           
           </G>
           </Svg>
           <TouchableOpacity onPress={scrollTo} style={{width:size - 20, height:size - 20 , 
                backgroundColor:'green',borderRadius:((size - 20) / 2),
                justifyContent:'center',alignItems:'center',position:'absolute'}}>
                <Icons name="arrowright" size={32} color="white"/>
           </TouchableOpacity>
        </View>
    );
}
export default NextButton;  