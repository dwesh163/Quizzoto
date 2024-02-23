import { FormControl, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import Head from 'next/head';
import { set, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import fetchQuizz from '../../../lib/fetchQuizz';
import setQuizzResult from '../../../lib/setQuizzResult';
import Question from '@/components/question';
import QuizzTimeline from '@/components/quizzTimeline';
import Box from '@mui/material/Box';
import Welcome from '@/components/quizz/welcome';

import Header from '../../components/header/header';

export default function Quizz() {
	const [quizz, setQuizz] = useState();
	const [UserAnswer, setUserAnswer] = useState({});
	const [quizzId, setQuizzId] = useState('');

	const [questionId, setQuestionId] = useState(0);
	const [quizzTitle, setQuizzTitle] = useState('');

	const router = useRouter();

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

	const BtnStyle = {
		appearance: 'button',
		backfaceVisibility: 'hidden',
		backgroundColor: '#405cf5',
		borderRadius: '30px',
		borderWidth: '0',
		boxShadow: 'rgba(50, 50, 93, .1) 0 0 0 1px inset,rgba(50, 50, 93, .1) 0 2px 5px 0,rgba(0, 0, 0, .07) 0 1px 1px 0',
		boxSizing: 'border-box',
		color: '#fff',
		cursor: 'pointer',
		fontSize: '1rem',
		height: '65px',
		lineHeight: '1',
		margin: '110px 0 0',
		outline: 'none',
		overflow: 'hidden',
		position: 'relative',
		right: '0',
		textAlign: 'center',
		textTransform: 'none',
		transform: 'translateZ(0)',
		transition: 'all .2s,box-shadow .08s ease-in',
		userSelect: 'none',
		width: '20%',
	};

	useEffect(() => {
		if (!quizz) {
			return;
		}
		setQuizzTitle(quizz.quizzTitle);
	}, [quizz]);

	useEffect(() => {
		if (!router.query.id && quizzId == '') {
			return;
		}

		let id = router.query.id;

		if (router.query.id == undefined) {
			id = quizzId;
		}

		const getData = async () => {
			const jsonData = await fetchQuizz(id, questionId);
			setQuizz(jsonData);
		};
		getData();
	}, [questionId, router.query.id, quizzId]);

	useEffect(() => {
		if (router.query.q == undefined) {
			return;
		} else {
			setQuestionId(parseInt(router.query.q));
		}
	}, [router.query.q]);

	// useEffect(() => {
	// 	const url = new URL(window.location.href);
	// 	setQuizzId(url.pathname.split('/')[2]);
	// 	const SearchParams = new URLSearchParams(url.search);
	// }, []);

	const { register, handleSubmit } = useForm();

	async function getResult(UserAnswer) {
		const result = await setQuizzResult(router.query.id, UserAnswer);
		await router.push({
			pathname: `/result/${result._id}`,
		});
	}
	const onSubmit = (data) => {
		setUserAnswer(data);

		if (questionId === quizz['questionsNumber']) {
			console.log(UserAnswer);
			getResult(data);
		} else {
			const nextQuestionId = questionId + 1;
			setQuestionId(nextQuestionId);
			router.push({ pathname: `/quizz/${router.query.id}`, query: { q: nextQuestionId } }, undefined, { shallow: true });
		}
	};

	console.log(questionId);
	return (
		<>
			<Head>
				<title>Quizzoto - Quizz</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
				<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
				<link rel="stylesheet" href="/quizz.css" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
				<link href="https://fonts.googleapis.com/css2?family=Anta&family=Bebas+Neue&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet" />
			</Head>
			<main>
				<Header quizzTitle={quizzTitle} />
				{quizz?.statusCode ? (
					<p>Merci de fournir un id de quizz correct dans l'URL.</p>
				) : questionId == 0 ? (
					<Welcome quizz={quizz} />
				) : (
					<Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
						<Box gridColumn="span 2"></Box>
						<Box gridColumn="span 10" style={BoxStyle}>
							<Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2} style={{ height: '100%' }}>
								<Box gridColumn="span 12" style={{ height: '100px' }}>
									<h1>{quizz.quizzTitle}</h1>
								</Box>
								<Box gridColumn="span 8">
									<form onSubmit={handleSubmit(onSubmit)}>
										<div>
											<h3>{quizz.questions.questionTitle}</h3>
											<Question question={quizz.questions} register={register} questionId={questionId} />
										</div>
										<Button type="submit" variant="contained" style={BtnStyle}>
											Question suivante
										</Button>
									</form>
								</Box>
								<Box gridColumn="span 4" style={{ height: '50%', overflow: 'scroll' }}>
									<QuizzTimeline quizzId={router.query.id} questionId={questionId} userAnswer={UserAnswer} />
								</Box>
							</Box>
						</Box>
					</Box>
				)}
			</main>
		</>
	);
}
