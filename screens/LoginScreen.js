import React from 'react';
import {
  Text,
  View,
	Button,
	TouchableOpacity,
	ScrollView
} from 'react-native';
import gql from 'graphql-tag';
import withApp from './../hocs/withApp'
import NativeTachyons from 'react-native-style-tachyons';
import Constants from './../constants/App';
import { DangerZone, AuthSession } from 'expo';
const { Lottie } = DangerZone;
import { NavigationActions } from 'react-navigation'

const resetAction = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'EntriesScreen'})
  ]
})

const FB_APP_ID = '358734654571116';

export default withApp(NativeTachyons.wrap(class HomeScreen extends React.Component {
	static navigationOptions = {
		title: 'Meow'
	};
	
	async componentWillMount() {
		await this.props.app.load();
		if (this.props.app.user.token) {
			this.props.navigation.dispatch(resetAction);
		}
	}
	
	render() {
		return (
				<View cls='bg-white aic jcsb flx-i pa3'>
					<Text cls='b f-headline primaryColor mt4'>Journal</Text>
					<Text> </Text>
					<View>
						<TouchableOpacity onPress={this._handlePressAsync}>
							<View cls='bg-primaryColor ph3 pv2 br3'><Text cls='f4 b tc thirdColor'>Login With Facebook</Text></View>
						</TouchableOpacity>
						<Text cls='b pt2 f6 primaryColor mb3 tc'>Why Facebook?</Text>
					</View>
					
				</View>
			)
		}
		
		_handlePressAsync = async () => {
			//temp bypass
			
			//return this.props.navigation.dispatch(resetAction);
			
			let redirectUrl = AuthSession.getRedirectUrl();
			let result = await AuthSession.startAsync({
				authUrl:
				`https://www.facebook.com/v2.8/dialog/oauth?response_type=token` +
				`&client_id=${FB_APP_ID}` +
				`&redirect_uri=${encodeURIComponent(redirectUrl)}` +
					`&scope=${['public_profile', 'publish_actions', 'user_videos', 'user_posts', 'user_photos'].join(',')}`
				});
			
			if (result.params.access_token) {
				const token = result.params.access_token;
				const expiresIn = result.params.expires_in;
				this.props.app.setUser({
					token,
					expiresIn
				});
				this.props.navigation.dispatch(resetAction);
			}
			//this.setState({ result: result.type + ' ' + result.params.access_token + ' ' + result.params.expires_in });
		};
}))