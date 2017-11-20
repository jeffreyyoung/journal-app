import { StackNavigator } from 'react-navigation';
import { primaryColor } from './../constants/Colors';

import LoginScreen from './../screens/LoginScreen';
import ProfileScreen from './../screens/ProfileScreen';
import NewEntryScreen from './../screens/NewEntryScreen';
import EntriesScreen from './../screens/EntriesScreen';
import PhotoSelectorScreen from './../screens/PhotoSelectorScreen';

import TabNav from './TabNavigator';

function Rawr(options) {
	return StackNavigator({
		LoginScreen: {
			screen: LoginScreen,
			navigationOptions: {
				gesturesEnabled: false,
			}
		},
		EntriesScreen: {
			screen: EntriesScreen,
			navigationOptions: {
				gesturesEnabled: false,
				title: 'Entries',
				headerTintColor: primaryColor
			}
		},
		NewEntryScreen: {
			screen: NewEntryScreen,
			navigationOptions: {
				title: 'New Entry',
				headerTintColor: primaryColor
			}
		},
		PhotoSelectorScreen: {
			screen: PhotoSelectorScreen,
			navigationOptions: {
				title: 'Select Photos',
				headerTintColor: primaryColor
			}
		},
	}, {
		initialRouteName: 'LoginScreen',
		navigationOptions: {
			headerTintColor: primaryColor
		},
		...options
	});
}

export default Rawr

