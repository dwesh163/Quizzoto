export default async function fetchRoom(roomId) {
	try {
		const response = await fetch(`/api/room/${roomId}`);
		const jsonData = await response.json();
		return jsonData;
	} catch (error) {
		console.error('Erreur lors de la récupération des données:', error);
	}
}
