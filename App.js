import React from 'react';
import Colors from './constants/Colors'
import StackNavigator from './navigators/StackNavigator';
import NativeTachyons from 'react-native-style-tachyons';
import {StyleSheet} from 'react-native'
import app from './core/app'
NativeTachyons.build({
    /* REM parameter is optional, default is 16 */
    // rem: screenWidth > 340 ? 18 : 16,
    colors: {
    	palette: Colors
    }
}, StyleSheet);

app.load();

export default StackNavigator()