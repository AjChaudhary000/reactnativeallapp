import React from 'react'
import { View, Dimensions } from 'react-native'
import Header from './components/Header';
import LottieView from 'lottie-react-native';
function GroupTodoScreen() {
    return (
        <View style={{ flex: 1, backgroundColor: '#E6DDDA' }}>
            <Header />
            <View style={{ flex: 4, width: Dimensions.get('window').width }}>
                <LottieView source={require('../assets/Json/DataNotFound.json')} autoPlay loop />
            </View>
        </View>
    );
}
export default GroupTodoScreen;