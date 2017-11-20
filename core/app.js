import fb from './fb';
import { AsyncStorage } from 'react-native';
import {observable, extendObservable, autorun} from "mobx";
import store from './../models/store';
const APP_USER_STORAGE_KEY = 'app-user';
let app = {};
app.store = store;
app.fb = new fb(app);
app.setUser = async (user) => {
	app.store.user = user;
	await AsyncStorage.setItem(APP_USER_STORAGE_KEY, JSON.stringify(user))
}

app.load = async () => {
	const nextUser = JSON.parse(await AsyncStorage.getItem(APP_USER_STORAGE_KEY))
	if (nextUser) {
		app.store.user = nextUser;
	}
	
}
export default app;