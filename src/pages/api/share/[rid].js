import db from '../../../../lib/mongodb';

var mongodb = require('mongodb');

export default async function Share(req, res) {
	try {
		const userId = req.body.user._id.toString();

		const room = await db.collection('rooms').findOne({ id: req.query.rid });
		const user = await db.collection('users').findOne({ _id: new mongodb.ObjectId(userId) });

		if (!room.share.includes(user.id)) {
			room.share.push(user.id);
		} else {
			room.share.splice(room.share.indexOf(user.id), 1);
		}

		await db.collection('rooms').updateOne({ id: req.query.rid }, { $set: { share: room.share } });

		res.status(200).json({ success: true });
	} catch (error) {
		console.error('Error sharing quizz:', error);
		res.status(500).json({ success: false, error: 'Internal server error' });
	}
}
