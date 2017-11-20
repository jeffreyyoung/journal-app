import React from 'react';
import {
  Text,
  View,
	Button,
	TouchableOpacity,
	Image,
	ScrollView,
	ActivityIndicator,
	RefreshControl
} from 'react-native';
import formatDate from './../util/formatDate';
import withApp from './../hocs/withApp'
import NativeTachyons from 'react-native-style-tachyons';
import Constants from './../constants/App';
import _ from 'lodash'
import eachDay from 'date-fns/each_day'
import addDays from 'date-fns/add_days'
import endOfToday from 'date-fns/end_of_today'
import parseDate from 'date-fns/parse'
import { withNavigation } from 'react-navigation';

let EntrySetPreview = NativeTachyons.wrap(({entries}) => {
	const photosAndVideos = _.chain(entries)
		.map(e => [e.photos, e.videos])
		.flatten()
		.flatten()
		.take(5)
		.value();

	const firstTextEntry = _.chain(entries)
		.map(e => e.message)
		.filter(e => e)
		.last()
		.value()
	return (
		<View cls='flx-i flx-wrap flx-row'>
			{firstTextEntry && <Text numberOfLines={3}>{firstTextEntry}</Text>}
			{photosAndVideos.map((media, i) => <Image key={i} cls='w3 h3 ml1 mt1 br2' source={{uri: media.src}}/>)}
		</View>
	)
})
let Day = withApp(NativeTachyons.wrap(({app, date, entries, navigation}) => {
	
	let onPress = () => {
		app.junk.defaultEntryDate = date;
		navigation.navigate('NewEntryScreen');
	}
	
	return(
		<View cls='mb3'>
			<TouchableOpacity onPress={onPress}>
				<Text cls='b f4 primaryColor'>{formatDate(date)}</Text>
				{!entries && <Text cls='gray'>You don't have an entry for this day. Press to add one</Text>}
				{entries && <EntrySetPreview entries={entries}/>}
			</TouchableOpacity>
		</View>
	)
}))

//https://stackoverflow.com/questions/24170933/convert-unix-timestamp-to-date-time-javascript
export default withApp(NativeTachyons.wrap(class HomeScreen extends React.Component {
	static navigationOptions = {
		title: 'Meow',
		header: navigation => ({
			tintColor: '#fefefe',
			titleStyle: {
				color: '#fefefe'
			}
		})
	};
	
	constructor(...args) {
		super(...args);
		this.state = {
			loading: false,
			posts: [],
			days: {}
		}
	}
	
	async componentDidMount() {
		this.loadData();
	}
	
	async loadData() {
		this.setState({loading:true});
		let j = await this.props.app.fb.loadPosts();
		this.setState({
			loading: false,
			posts: j.posts,
			days: _.groupBy(j.posts, p => formatDate(parseDate(p.entryTime))),
			nextPage: j.nextPage
		});
	}
	
	render() {
		const days = eachDay(addDays(endOfToday(), -100), endOfToday()).reverse();
		
		return (
				<ScrollView cls='bg-white pa2 pb5'
					refreshControl={
						<RefreshControl refreshing={this.state.loading}
							onRefresh={this.loadData.bind(this)}
						/>
					}
				>
					{!this.state.loading && days.map((d, i) => <Day key={d} date={d} navigation={this.props.navigation} entries={this.state.days[formatDate(d)]}/>)}
				</ScrollView>
			)
		}
}))