import db from './mongodb';

var mongodb = require('mongodb');

export default async function getRoomResults(session, rid) {
	const room = await db.collection('rooms').findOne({ id: rid });

	console.log('room', room);

	if (!session) {
		return 401;
	}

	if (!room) {
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
				creator: 1,
				quizzTitle: 1,
				quizzDescription: 1,
				quizzImg: 1,
				quizzInfo: 1,
				quizzSlug: 1,
			},
		}
	);

	const user = await db.collection('users').findOne({ id: quizz.creator }, { projection: { username: 1, image: 1 } });

	delete quizz.creator;
	delete user._id;

	quizz.results = results;

	quizz.roomId = rid;

	quizz.user = user;

	quizz._id = quizz._id.toString();

	return JSON.stringify(quizz);
}

export async function getRoomInfo(session, roomId) {
	const room = await db.collection('rooms').findOne({ id: roomId });

	console.log('room', room);

	if (!session || !room) {
		return 401;
	}

	if (!room.share.includes(session.user.id)) {
		if (session == null || session.user.id != room.ownerId) {
			return 401;
		}
	}

	const user = await db.collection('users').findOne({ id: room.ownerId }, { projection: { username: 1, image: 1 } });

	delete room._id;
	delete user._id;

	room.user = user;

	return room;
}
