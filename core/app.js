import fb from './fb';
import { AsyncStorage } from 'react-native';

const APP_USER_STORAGE_KEY = 'app-user';
let app = {
	user: {
		token: null,
		tokenExpiresIn: null,
	},
	junk: {
		
	}
}
app.fb = new fb(app);
app.setUser = async (user) => {
	app.user = user;
	await AsyncStorage.setItem(APP_USER_STORAGE_KEY, JSON.stringify(user))
}

app.load = async () => {
	const nextUser = JSON.parse(await AsyncStorage.getItem(APP_USER_STORAGE_KEY))
	if (nextUser) {
		app.user = nextUser;
	}
	
}
export default app;