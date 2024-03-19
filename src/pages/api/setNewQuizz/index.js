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

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ statusCode: 405, message: `This request method is not valid on this route.` });
	}

	req.body = JSON.parse(req.body);

	db.collection('quizzs').insertOne(req.body);

	return res.status(200).json({ code: 200 });
}
