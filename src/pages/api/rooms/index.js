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

export default async function Room(req, res) {
	const quizzId = await getQuizzIdFromSlug(req.query.s);

	const id = uuidv4();

	let newRoom = {
		id: id,
		quizzId: quizzId,
		ownerId: req.body.ownerId,
		time: Date.now(),
		share: [],
		link: await createShortedLink(`/quizz/${req.query.s}?r=${id}&q=1`, req.body.ownerId, id),
	};

	db.collection('rooms').insertOne(newRoom);

	return res.status(200).send(newRoom);
}
