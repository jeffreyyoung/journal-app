import _ from 'lodash';
import appConstants from './../constants/App';

function parseMedia(media) {
	if (media.type === 'video_autoplay') {
		return {
			...media,
			jType:'video'
		}
	}
}

function parseAttachment(attachment, videos, photos) {
	const subattachments = _.get(attachment, 'subattachments.data', []);
	subattachments.map(sa => parseAttachment(sa, videos, photos));
	let imageMedia = _.get(attachment, 'media.image');
	if (imageMedia) {
		photos.push(imageMedia);
	}
}

function parsePost(post) {
	let videos = [];
	let photos = [];
	let message = _.get(post, 'message', '');
	let messageTime = '';
	if (message.indexOf(appConstants.MESSAGE_TIME_SPLIT) !== -1) {
		const splitMessage = message.split(appConstants.MESSAGE_TIME_SPLIT);
		messageTime = splitMessage[0]
		message = _.get(splitMessage, '[1]', message)
	}
	
	let facebookUrl = _.get(post, 'permalink_url');
	let entryTime = messageTime || _.get(post, 'backdated_time') || _.get(post, 'created_time');

	let id = _.get(post, 'id');
	_.get(post, 'attachments.data', []).map(attachment => parseAttachment(attachment, videos, photos))
	
	return {
		message,
		test:message,
		photos,
		videos,
		facebookUrl,
		entryTime,
		id
	}
}

function parseData(json) {
	const nextPage = json.posts.paging.next;
	
	const posts = json.posts.data.map(parsePost)
	return {
		posts,
		nextPage
	}
}

export default {
	parsePosts: parseData
}