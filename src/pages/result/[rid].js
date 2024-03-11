import { FormControl, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import fetchResult from '../../../lib/fetchResult';
import Result from '@/components/result';
import QuizzTimeline from '@/components/quizzTimeline';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { PieChart } from '@mui/x-charts/PieChart';
import { getSession, useSession } from 'next-auth/react';

import Header from '../../components/header/header';
import getResults from '../../../lib/results';

const BoxStyle = {
	borderRadius: '30px',
	fontWeight: '400',
	fontSize: '1.2rem',
	boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
	padding: '2rem',
	height: '75vh',
	width: '94%',
	color: '#696f79',
	paddingTop: '0px',
	paddingLeft: '2.5rem',
};

function countAnswers(data) {
	let trueCount = 0;
	let falseCount = 0;
	let nullCount = 0;

	data.forEach((item) => {
		if (item.answeredCorrectly === true) {
			trueCount++;
		} else if (item.answeredCorrectly === false) {
			falseCount++;
		} else if (item.answeredCorrectly === null) {
			nullCount++;
		}
	});

	return { trueCount, falseCount, nullCount };
}

export default function Quizz({ userSession, userResult }) {
	const [result, setResult] = useState();

	const [chartResult, setChartResult] = useState([]);

	const windowSize = useWindowSize();
	const router = useRouter();

	useEffect(() => {
		if (!userResult) {
			return;
		}

		setResult(userResult);
	}, [result]);

	useEffect(() => {
		if (!result || result == 401) {
			return;
		}
		const { trueCount, falseCount, nullCount } = countAnswers(result.results);
		let total = trueCount + falseCount + nullCount;

		setChartResult([
			{ id: 0, value: trueCount, label: 'True' },
			{ id: 1, value: falseCount, label: 'False' },
			{ id: 2, value: nullCount, label: 'Null' },
		]);
	}, [result]);

	function useWindowSize() {
		const [windowSize, setWindowSize] = useState({
			width: undefined,
			height: undefined,
		});
		useEffect(() => {
			function handleResize() {
				setWindowSize({
					width: window.innerWidth,
					height: window.innerHeight,
				});
			}
			window.addEventListener('resize', handleResize);
			handleResize();
			return () => window.removeEventListener('resize', handleResize);
		}, []);

		return windowSize;
	}

	return (
		<>
			<Head>
				<title>Quizzoto - Quizz</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
				<link href="https://fonts.googleapis.com/css2?family=Anta&family=Bebas+Neue&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet" />
				<link rel="stylesheet" href="/result.css" />
			</Head>
			<main>
				<Header windowWidth={windowSize.width} />
				<Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
					<Box gridColumn="span 2"></Box>
					<Box gridColumn="span 10" style={BoxStyle}>
						{result?.statusCode || userResult == 401 ? (
							<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', verticalAlign: 'center', height: '100%' }}>
								<p>Merci de fournir un id de résultat correct dans l'URL.</p>
							</Box>
						) : result && chartResult ? (
							<Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
								<Box gridColumn="span 12" display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
									<Box gridColumn="span 10">
										<h1>{result.quizz.title}</h1>
									</Box>
									<Box gridColumn="span 2">{/* <h2>Score total : {result.score}</h2> */}</Box>
									<PieChart
										series={[
											{
												data: chartResult,
												innerRadius: 30,
												outerRadius: 100,
												cornerRadius: 5,
												highlightScope: { faded: 'global', highlighted: 'item' },
												faded: { innerRadius: 30, additionalRadius: -10, color: 'gray' },
											},
										]}
										width={400}
										height={200}
									/>
								</Box>

								<Box gridColumn="span 12" style={{ overflow: 'scroll', height: '45vh' }}>
									<TableContainer component={Paper}>
										<Table sx={{ minWidth: 650 }} aria-label="simple table">
											<TableHead>
												<TableRow>
													<TableCell>Question</TableCell>
													<TableCell align="right">Correct</TableCell>
													<TableCell align="right">Points</TableCell>
													<TableCell align="right">Votre réponse</TableCell>
													<TableCell align="right">Réponse correcte</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{result.results.map((e, index) => (
													<TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
														<TableCell component="th" scope="row">
															{e.questionTitle}
														</TableCell>
														<TableCell align="right">{e.answeredCorrectly ? '✅' : '❌'}</TableCell>
														<TableCell align="right">{e.points}</TableCell>
														<Result result={e} />
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
								</Box>
								{/* <Box gridColumn="span 4">
									<QuizzTimeline quizzId={router.query.id} result={result} />
								</Box> */}
							</Box>
						) : (
							<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', verticalAlign: 'center', height: '100%' }}>
								<CircularProgress />
							</Box>
						)}
					</Box>
				</Box>
			</main>
		</>
	);
}

export async function getServerSideProps(context) {
	const session = await getSession(context);
	const { rid } = context.params;

	let userResult = await getResults(session, rid);

	return {
		props: {
			userSession: session ?? null,
			userResult,
		},
	};
}