import db from './mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function getRedirectUrl(link) {
	const linkInfo = await db.collection('links').findOne({ linkShort: '/link/' + link });

	await db.collection('links').updateOne({ linkShort: '/link/' + link }, { $set: { used: linkInfo.used + 1 } });

	console.log(`[${new Date().toISOString()}] - ${linkInfo.roomId} - ${linkInfo.used}`);

	return linkInfo.url;
}

export async function createShortedLink(url, ownerId, roomId) {
	const linkShort = generateShortLink();

	await db.collection('links').insertOne({
		linkShort,
		url,
		ownerId,
		used: 0,
		roomId,
	});

	return linkShort;
}

function generateShortLink() {
	return '/link/' + uuidv4().replaceAll('-', '').substring(0, 32);
}

export async function getLinkInfo(session, rid) {
	if (session == null) {
		return 401;
	}
	const linkInfo = await db.collection('links').findOne({ roomId: rid });
	const room = await db.collection('rooms').findOne({ id: rid });

	if (!room || !linkInfo) {
		return 401;
	}

	if (linkInfo.ownerId == session.user.id || room.share.includes(session.user.id)) {
		delete linkInfo._id;
		return linkInfo;
	} else {
		return 401;
	}
}
