import db from './mongodb';

var mongodb = require('mongodb');

export default async function getResults(session, rid) {
	if (!mongodb.ObjectId.isValid(rid)) {
		return 401;
	}
	const result = await db.collection('results').findOne({ _id: new mongodb.ObjectId(rid) });

	if (result == null) {
		return 401;
	}

	result._id = result._id.toString();
	result.quizz.id = result.quizz.id.toString();

	if (result.roomId && session) {
		const room = await db.collection('rooms').findOne({ id: result.roomId });

		console.log('room', room);
		console.log('result.roomId', result.roomId);

		if (room.ownerId == session.user.id) {
			return result;
		}
		if (room.share.includes(session.user.id)) {
			return result;
		}
	}

	if (result.visibility == 'hidden') {
		return result;
	}

	if (session && session.user.id == result.player && result.visibility == 'private') {
		return result;
	} else {
		return 401;
	}
}
