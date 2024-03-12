import db from './mongodb';

export async function getUserNumber() {
	try {
		const users = await db
			.collection('users')
			.find({}, { projection: { _id: 1 } })
			.toArray();

		return users.length;
	} catch (error) {
		console.error('Error fetching user number:', error);
		throw error;
	}
}
