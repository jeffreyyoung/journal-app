import React from 'react';
import classnames from 'classnames'
import {inject, Observer, observer} from "mobx-react";
import {
  Text,
  View,
	Button,
	TouchableOpacity,
	Image,
	ScrollView,
	StyleSheet,
	CameraRoll,
	FlatList
} from 'react-native';
import startOfMonth from 'date-fns/start_of_month'
import { Ionicons } from '@expo/vector-icons';
import withApp from './../hocs/withApp'
import NativeTachyons from 'react-native-style-tachyons';
import Colors from './../constants/Colors';
import _ from 'lodash'
import format from 'date-fns/format'
import { sizes } from "react-native-style-tachyons"
import formatDate from './../util/formatDate';
//https://stackoverflow.com/questions/24170933/convert-unix-timestamp-to-date-time-javascript
export default inject('store')(withApp(observer(NativeTachyons.wrap(class PhotoSelectorScreen extends React.Component {
	state = {
		photos:[],
		photoGroups:[]
	}
	
	async componentDidMount() {
		this.selectedPhotos = new Set();
		const res = await CameraRoll.getPhotos({
			first: 500
		});
		const photos = res.edges.map(e => e.node);
		this.setState({
			photoGroups:this.groupPhotosByDay(photos),
			photos
		});
	}
	
	groupPhotosByDay(photos) {
		const photosGroupedByDay = _.groupBy(photos, (p) => formatDate(p.timestamp * 1000));
		
		const orderedDaysWithPhotos = _.chain(photos)
			.map(p => p.timestamp * 1000) //get all timeStamps
			.sort()
			.reverse() //sort them
			.map(ts => formatDate(new Date(ts)))
			.uniq()
			.map(label => ({
				label,
				selectedPhotos:{},
				photos: photosGroupedByDay[label]
			}))
			.value();
		return orderedDaysWithPhotos;
	}
	
	isSelected(uri) {
		return this.props.store.newEntryScreenValues.selectedPhotos.indexOf(uri) !== -1;
	}
	//TODO fix sucky code
	toggleSelectedPhoto(uri, groupIndex) {
		let selectedPhotos = this.props.store.newEntryScreenValues.selectedPhotos;
		if (this.isSelected(uri)) {
			selectedPhotos.replace(
				selectedPhotos.filter(p => p !== uri)
			);
		} else {
			selectedPhotos.push(uri);
		}
		this.setState({
			selectedPhotos: [...selectedPhotos]
		})
	}
	
	render() {
		return (
				<FlatList cls='bg-white pa2 pb5'
					data={this.state.photoGroups}
					keyExtractor={(item, index) => item.label}
					renderItem={({item, index}) => <PhotoGroup 
						key={item.label} 
						index={index}
						isSelected={this.isSelected.bind(this)} 
						toggleSelectedPhoto={this.toggleSelectedPhoto.bind(this)} 
						group={item} />} 
					extraData={this.state}
				/>
			)
		}
}))))

const PhotoGroup = NativeTachyons.wrap(({group, toggleSelectedPhoto, isSelected}) => (
	<View key={group.label}>
		<Text>{group.label}</Text>
		<View cls='flx-i flx-row flx-wrap'>
			{group.photos.map(e => (
					<TouchableOpacity key={e.image.uri} onPress={() => toggleSelectedPhoto(e.image.uri)}>
							{isSelected(e.image.uri) && <Text>SELECTED</Text>}
							<Image cls={classnames('h3 w3 mr1 mv1', {
								//' h4 w5 pa5': group.selectedPhotos[e.image.uri]
							})} source={{uri: e.image.uri}}/>
					</TouchableOpacity>
			))}
		</View>
	</View>
))