import db from './mongodb';

var mongodb = require('mongodb');

export async function getQuizzInfo(link) {
	const linkInfo = await db.collection('links').findOne({ linkShort: '/link/' + link });

	const room = await db.collection('rooms').findOne({ id: linkInfo.roomId });

	const quizz = await db.collection('quizzs').findOne(
		{ _id: new mongodb.ObjectId(room.quizzId) },
		{
			projection: {
				quizzTitle: 1,
				quizzDescription: 1,
				quizzImg: 1,
				quizzInfo: 1,
			},
		}
	);

	delete quizz._id;

	quizz.link = linkInfo.linkShort;

	return quizz;
}
