import React from 'react';
import {
  Text,
  View,
	Button,
	TouchableOpacity,
	Image,
	ScrollView,
	ActivityIndicator,
	RefreshControl,
	FlatList
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
import min from 'date-fns/min'
import max from 'date-fns/max'
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
		app.store.newEntryScreenValues.defaultEntryDate = date;
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
			days: []
		}
	}
	
	async componentDidMount() {
		this.loadData();
	}
	
	groupPostsIntoDays(posts) {
		const timeStamps = posts.map(p => parseDate(p.entryTime).getTime());
		const postsByDay = _.groupBy(posts, p => formatDate(parseDate(p.entryTime)))
		const days = eachDay(parseDate(_.min(timeStamps)), parseDate(new Date()))
			.reverse()
			.map(d => {
				return {
					label: formatDate(d),
					date: d,
					entries: postsByDay[formatDate(d)]
				}
		})
		return days;
	}
	
	async loadMorePosts(url) {
		// let result = await this.props.app.fb.loadPosts();
		// const allPosts = this.state.posts.concat(result.posts)
		// this.setState({
		// 	posts: allPosts,
		// 	days: this.groupPostsIntoDays(allPosts),
		// 	nextUrl: result.nextPageUrl
		// });
	}
	
	async loadData() {
		this.setState({loading:true});
		
		let result = await this.props.app.fb.loadPosts();
		
		this.setState({
			loading: false,
			posts: result.posts,
			days: this.groupPostsIntoDays(result.posts),
			nextUrl: result.nextPageUrl
		});
	}
	
	render() {
		return (
			<FlatList 
				cls='bg-white pa2'
				keyExtractor={(item, index) => index}
				data={this.state.days} 
				renderItem={({item}) => <Day key={item.label} date={item.date} navigation={this.props.navigation} entries={item.entries}/>} 
				refreshing={this.state.loading}
				onRefresh={this.loadData.bind(this)}
				onEndReached={() => this.loadMorePosts(this.state.nextUrl)}
			/>
		)
	}
}))