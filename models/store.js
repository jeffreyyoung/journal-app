import {observable, extendObservable, autorun} from "mobx";

let store = extendObservable({}, {
		user: {
			token: '',
			tokenExpiresIn: '',
		},
		newEntryScreenValues: {
			selectedPhotos: []
		}
})

export default store;