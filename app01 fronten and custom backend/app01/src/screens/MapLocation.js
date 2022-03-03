import React from 'react';
import {
	ImageBackground,
	Image,
	CheckBox,
	View,
	StyleSheet,
	Text,
	ScrollView,
	TouchableOpacity,
	Platform,
	PermissionsAndroid,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
var latitude = 0.0;
var longitude = 0.0;
import design from './StyleFile';

export default class MapLocation extends React.Component {
	constructor(props) {
		super(props);
	}

	_goback = () => {
		this.props.navigation.goBack();
	};

	render() {
		const { navigation } = this.props;
		latitude = navigation.getParam('latitude', 'null');
		longitude = navigation.getParam('longitude', 'null');

		return (
			<View style={styles.container}>
				<View style={{ backgroundColor: '#fff', flexDirection: 'row',paddingTop:20 }}>
					<TouchableOpacity onPress={this._goback}>
						<View style={{ width: '10%' }}>
							<Image
								style={{
									width: 30,
									height: 30,
									resizeMode: 'contain',
									alignItems: 'center',
									marginLeft: 10,
									tintColor: design.theme_color_parent,
									marginTop: Platform.OS === 'ios' ? 45 : 30,
								}}
								source={require('./images/back.png')}
							/>
						</View>
					</TouchableOpacity>
					<View style={{ width: '75%' }}>
						<Image
							style={{
								width: 100,
								height: 80,
								resizeMode: 'contain',
								marginLeft: 15,
								alignSelf: 'center',
								marginTop: Platform.OS === 'ios' ? 15 : 0,
							}}
							source={require('./images/app1.png')}
						/>
					</View>
				</View>

				<MapView
					style={styles.map}
					initialRegion={{
						latitude: latitude,
						longitude: longitude,
						latitudeDelta: 0.01,
						longitudeDelta: 0.01,
					}}
					loadingEnabled={true}
				>
					<Marker
						draggable
						coordinate={{
							latitude: latitude,
							longitude: longitude,
						}}
						// onDragEnd={e => alert(JSON.stringify(e.nativeEvent.coordinate))}
						// onPress={() => this.markerClick()}
					/>
					<Marker
						draggable
						coordinate={{
							latitude: latitude,
							longitude: longitude,
						}}
						title={''}
						description={'Your Location'}
					/>
				</MapView>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	starStyle: {
		width: 120,
		height: 25,
		marginBottom: 20,
	},
	map: {
		// position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		height: '100%',
	},
});
