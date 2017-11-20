import { StackNavigator } from 'react-navigation';
import LoginScreen from './../screens/LoginScreen';
import ProfileScreen from './../screens/ProfileScreen';
import NewEntryScreen from './../screens/NewEntryScreen';

function Rawr(options) {
	return StackNavigator({
		LoginScreen: {
			screen: LoginScreen,
		},
		NewEntryScreen: {
			screen: NewEntryScreen,
		},
		ProfileScreen: {
			screen: ProfileScreen
		}
	}, {
		initialRouteName: 'LoginScreen',
		...options
	});
}

export default Rawr

