import { createShortedLink } from '../../../../lib/links';
import db from '../../../../lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

var mongodb = require('mongodb');

async function getQuizzIdFromSlug(quizzSlug) {
	let id = await db.collection('quizzs').findOne(
		{ quizzSlug: quizzSlug },
		{
			projection: {
				_id: 1,
			},
		}
	);
	return id._id.toString();
}

export default async function Session(req, res) {
	const quizzId = await getQuizzIdFromSlug(req.query.s);

	const id = uuidv4();

	let newSession = {
		id: id,
		quizzId: quizzId,
		ownerId: req.body.ownerId,
		time: Date.now(),
		share: [],
		link: await createShortedLink(`/quizz/${req.query.s}?s=${id}&q=1`, req.body.ownerId),
	};

	db.collection('session').insertOne(newSession);

	return res.status(200).send(newSession);
}
