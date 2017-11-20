import React from 'react'

import {
  TabNavigator,
	StackNavigator
} from 'react-navigation';
import StackNavigator1 from './StackNavigator1';
const TabNav = TabNavigator({
	  ProfileScreen: {screen: StackNavigator1({initialRouteName: 'ProfileScreen'})},
	  New: {screen: StackNavigator1({initialRouteName: 'NewEntryScreen'})},
		ProfileScreen: {screen: StackNavigator1({initialRouteName: 'ProfileScreen'})},
	})

class Meow extends React.Component {
	render() {
		return <TabNav/>
	}
}
// 
Meow.router = TabNav.router;
export default Meow;
