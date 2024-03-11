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
