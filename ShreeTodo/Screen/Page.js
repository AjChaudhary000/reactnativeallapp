import React from 'react'
import {View,Text,Animated,Dimensions} from 'react-native'
function Page({data,scrollX}){
    const { width, height } = Dimensions.get('screen');
    return(
        <View style={{height:64,flexDirection:'row',alignSelf:'center'}}>
            {
                data.map((_,i)=>{
                     const inputRange =[(i-1) * width, i* width, (i+1)* width];
                    const dotinput = scrollX.interpolate({
                      inputRange,
                      outputRange:[10,20,10],
                      extrapolate:'clamp',
                    })
                    const opacity = scrollX.interpolate({
                      inputRange,
                      outputRange:[0.3,0.8,0.3],
                      extrapolate:'clamp',
                    })
                    return <Animated.View style={{height:10,margin:2,borderRadius:5,backgroundColor:'#493d8a',width:dotinput,opacity}} key={i.toString()}/> 
                })
            }
        </View>
    );
}
export default Page;