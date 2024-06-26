import db from '../../../../lib/mongodb';

var mongodb = require('mongodb');

export default async function AllUser(req, res) {
	if (req.body == '') {
		const users = await db
			.collection('users')
			.find(
				{},
				{
					projection: {
						username: 1,
						image: 1,
						displayPoints: 1,
						points: { $cond: { if: { $eq: ['$displayPoints', true] }, then: '$points', else: null } },
					},
				}
			)
			.toArray();

		return res.status(200).send(users);
	}
	const roomId = JSON.parse(req.body).roomId;

	let newUsers = [];

	const room = await db.collection('rooms').findOne({ id: roomId });

	const users = await db
		.collection('users')
		.find(
			{},
			{
				projection: {
					username: 1,
					image: 1,
					displayPoints: 1,
					points: { $cond: { if: { $eq: ['$displayPoints', true] }, then: '$points', else: null } },
					id: 1,
				},
			}
		)
		.toArray();

	for (let user of users) {
		if (room.share.includes(user.id)) {
			user.isShared = true;
		} else {
			user.isShared = false;
		}
		newUsers.push(user);
	}
	return res.status(200).send(newUsers);
}
