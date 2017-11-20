import React from 'react';
import {
  Text,
  View,
	Button,
	TouchableOpacity,
	Image,
	ScrollView,
	StyleSheet
} from 'react-native';
import startOfMonth from 'date-fns/start_of_month'
import { Ionicons } from '@expo/vector-icons';
import withApp from './../hocs/withApp'
import NativeTachyons from 'react-native-style-tachyons';
import Colors from './../constants/Colors';
import _ from 'lodash'
import format from 'date-fns/format'
import t from 'tcomb-form-native';
import getStyleSheet from './../constants/FormStyleSheet';
const Form = t.form.Form;
var Gender = t.enums({
  M: 'Male',
  F: 'Female'
});
import { sizes } from "react-native-style-tachyons"

// here we are: define your domain model
let Person = t.struct({
	text: t.maybe(t.String),
	entrydate: t.Date,
	//gender: t.maybe(Gender)
});

//https://stackoverflow.com/questions/24170933/convert-unix-timestamp-to-date-time-javascript
export default withApp(NativeTachyons.wrap(class HomeScreen extends React.Component {
	
	constructor(...args) {
		super(...args);
		
		const textboxstylesheet = _.cloneDeep(getStyleSheet());
		textboxstylesheet.textbox.error.height = 100;
		textboxstylesheet.textbox.normal.height = 100;
		
		this.defaultValue = {};
		if (this.props.app.junk.defaultEntryDate) {
			this.defaultValue.entrydate = this.props.app.junk.defaultEntryDate;
		}
		
		this.options = {
			stylesheet: getStyleSheet(),
			//auto: 'placeholders',
			fields: {
				entrydate: {
					label: 'Date of Entry',
					config: {
						format: a => format(new Date(a), 'MMMM Do YYYY h:mm A')
					}
				},
				
				text: {
					multiline: true,
					numberOfLines: 6,
					factory: t.form.Textbox,
					stylesheet: textboxstylesheet
				},
				
				gender: {
					nullOption: {value: '', text: 'Choose your gender'}
				}
			}
		};
	}
	
	async createPost() {
		//this.props.app.fb.postText('meeeeOOOW!');
		
		
		 //backdated time
		 
		let timeStamp = startOfMonth(new Date).getTime();
		let formValues = this.form.getValue();
		if (formValues) {
			const res = await this.props.app.fb.createEntry({
				message: formValues.text || '',
				entryTime: formValues.entrydate,
			});
			alert(JSON.stringify(res));
		} else {
			alert('Please fill in missing values');
		}

		
	}
	
	componentWillUnmount(){
		if (this.props.app.junk.defaultEntryDate) {
			delete this.props.app.junk.defaultEntryDate;
		}
	}
	
	render() {
		return (
				<ScrollView cls='bg-white pa2 pb5'>
						<Form
							ref={ref => this.form = ref}
							type={Person}
							options={this.options}
							value={this.defaultValue}
						/>
						<Text cls='primaryColor f5 mb1'>Photos / Videos</Text>
						<View cls='flx-i flx-row flx-wrap mb3'>
							<TouchableOpacity onPress={() => alert(this.form.getValue().entrydate)}>
								<View cls='bg-lightgray h3 w3 flx-i jcc aic'>
									<Ionicons name="ios-add-outline" size={sizes.f2} color="gray" />
								</View>
							</TouchableOpacity>
						</View>
						<TouchableOpacity onPress={this.createPost.bind(this)}>
							<View cls='bg-primaryColor ph3 pv2 br3'><Text cls='f4 b tc thirdColor'>Save</Text></View>
						</TouchableOpacity>
				</ScrollView>
			)
		}
}))