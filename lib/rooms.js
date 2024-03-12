import db from './mongodb';

var mongodb = require('mongodb');

export default async function getRoomResults(session, rid) {
	console.log('rid', rid);
	const room = await db.collection('rooms').findOne({ id: rid });

	console.log('room', room);

	if (!session) {
		return 401;
	}

	if (!room.share.includes(session.user.id)) {
		if (session == null || session.user.id != room.ownerId) {
			return 401;
		}
	}

	const results = await db.collection('results').find({ roomId: rid }).toArray();

	for (let i = 0; i < results.length; i++) {
		const result = results[i];
		const id = result.player;

		const playerInfo = await db.collection('users').findOne({ id: id });

		if (playerInfo) {
			result.player = {
				id: id,
				username: playerInfo.username,
				image: playerInfo.image,
				name: playerInfo.name,
			};
		}
	}

	const quizz = await db.collection('quizzs').findOne(
		{ _id: new mongodb.ObjectId(room.quizzId) },
		{
			projection: {
				quizzTitle: 1,
				quizzDescription: 1,
				quizzImg: 1,
				quizzInfo: 1,
				quizzSlug: 1,
			},
		}
	);

	quizz.results = results;

	quizz.roomId = rid;

	quizz._id = quizz._id.toString();

	quizz.link = room.link;

	return JSON.stringify(quizz);
}
