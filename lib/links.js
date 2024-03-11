import db from './mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function getRedirectUrl(link) {
	const linkInfo = await db.collection('links').findOne({ linkShort: '/link/' + link });

	console.log('linkInfo.used', linkInfo.used);

	await db.collection('links').updateOne({ linkShort: '/link/' + link }, { $set: { used: linkInfo.used + 1 } });

	return linkInfo.url;
}

export async function createShortedLink(url, ownerId) {
	const linkShort = generateShortLink();

	await db.collection('links').insertOne({
		linkShort,
		url,
		ownerId,
		used: 0,
	});

	console.log('linkShort', linkShort);
	return linkShort;
}

function generateShortLink() {
	return '/link/' + uuidv4().replaceAll('-', '').substring(0, 16);
}
