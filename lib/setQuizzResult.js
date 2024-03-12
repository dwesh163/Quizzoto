export default async function setQuizzResult(quizzId, userAnswers, roomId, session) {
	console.log('roomId - setQuizzResult', roomId);
	try {
		const response = await fetch(`/api/setQuizzResult/${quizzId}?roomId=${roomId}`, { method: 'POST', body: JSON.stringify({ answers: userAnswers, info: session }) });
		const jsonData = await response.json();
		return jsonData;
	} catch (error) {
		console.error('Erreur lors de la récupération des données:', error);
	}
}
