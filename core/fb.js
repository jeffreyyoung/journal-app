import fbResultParser from './../util/fbResultParser';
import appConstants from './../constants/App';

const FB_API_DOMAIN = 'https://graph.facebook.com/v2.11'

class fb {
	constructor(app) {
		this.app = app;
	}
	
	async post(url, json) {
		url += `&access_token=${this.app.user.token}`;
		const result = await fetch(url,
			{
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				method: "POST",
				body: JSON.stringify(json)
			});
		return await result.json();
	}
	
	async get(url) {
		url += `&access_token=${this.app.user.token}`;
		const result = await fetch(url);
		const json = await result.json();
		return json;
	}
	
	async loadPosts(){
		let json = await this.get('https://graph.facebook.com/v2.11/me?fields=posts{status_type,message,attachments{media,type,subattachments},permalink_url,created_time,backdated_time}')
		return fbResultParser.parsePosts(json);
	}
	
	async createEntry(entry) {
		let result = await this.post(`${FB_API_DOMAIN}/me/feed?`, formatEntry(entry))
	}
	
	async postText(message) {
		let result = await this.post(`${FB_API_DOMAIN}/me/feed?`, addPrivacy({message}))
	}
}

function formatEntry(entry = {}) {
	if (entry.entryTime) {
		entry.message = entry.entryTime+appConstants.MESSAGE_TIME_SPLIT+entry.message;
	}
	delete entry.entryTime;
	
	const privacy = {
		value: 'SELF'
	}
	return {...entry, privacy};
}

export default fb;