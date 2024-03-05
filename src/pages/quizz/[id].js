import { FormControl, RadioGroup, FormControlLabel, Radio, Button } from '@mui/material';
import Head from 'next/head';
import { set, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import fetchQuizz from '../../../lib/fetchQuizz';
import setQuizzResult from '../../../lib/setQuizzResult';
import Question from '@/components/question';
import QuizzTimeline from '@/components/quizzTimeline';
import Box from '@mui/material/Box';
import Welcome from '@/components/quizz/welcome';
import Header from '../../components/header/header';

const BoxStyle = {
	borderRadius: '30px',
	fontWeight: '400',
	fontSize: '1.2rem',
	boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
	padding: '2rem',
	height: 'calc(100vh - 250px)',
	color: '#696f79',
	paddingTop: '0',
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
	bottom: '0',
	marginTop: 'calc(100vh - 650px)',
	outline: 'none',
	overflow: 'hidden',
	position: 'relative',
	right: '0',
	textAlign: 'center',
	textTransform: 'none',
	transform: 'translateZ(0)',
	transition: 'all .2s,box-shadow .08s ease-in',
	userSelect: 'none',
	width: '12rem',
};

export default function Quizz() {
	const { data: session } = useSession();

	const [quizz, setQuizz] = useState();
	const [UserAnswer, setUserAnswer] = useState({});
	const [quizzId, setQuizzId] = useState('');

	const [questionId, setQuestionId] = useState(0);
	const [quizzTitle, setQuizzTitle] = useState('');

	const { register, handleSubmit } = useForm();
	const windowSize = useWindowSize();

	const router = useRouter();

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

	function getResult(UserAnswer) {
		setQuizzResult(router.query.id, UserAnswer, router.query.s, session)
			.then((result) => {
				if (!localStorage.getItem('id')) {
					localStorage.setItem('id', result.player);
				}
				return router.push({
					pathname: `/result/${result._id}`,
				});
			})
			.catch((error) => {
				console.error("Une erreur s'est produite :", error);
			});
	}

	const onSubmit = (data) => {
		setUserAnswer(data);

		if (questionId === quizz['questionsNumber']) {
			getResult(data);
		} else {
			const nextQuestionId = questionId + 1;
			setQuestionId(nextQuestionId);
			router.push({ pathname: `/quizz/${router.query.id}`, query: { q: nextQuestionId, s: router.query.s } }, undefined, { shallow: true });
		}
	};

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
				<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
				<link rel="stylesheet" href="/quizz.css" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
				<link href="https://fonts.googleapis.com/css2?family=Anta&family=Bebas+Neue&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet" />
			</Head>
			<main>
				<Header quizzTitle={quizzTitle} windowWidth={windowSize.width} />
				{quizz?.statusCode != 200 ? (
					<p>Merci de fournir un id de quizz correct dans l'URL.</p>
				) : questionId == 0 ? (
					<Welcome quizz={quizz} windowWidth={windowSize.width} />
				) : windowSize.width < 1200 ? (
					<Box className="box">
						<Box style={{ display: 'flex', alignItems: 'center', textAlign: 'center', justifyContent: 'space-between' }}>
							<h1>{quizz.quizzTitle}</h1>
							<h4>
								{questionId}/{quizz['questionsNumber']}
							</h4>
						</Box>
						<Box>
							<form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 'calc(100vh - 260px)' }}>
								<div>
									<h3>{quizz.questions.questionTitle}</h3>
									<Question question={quizz.questions} register={register} questionId={questionId} />
								</div>
								<Button type="submit" variant="contained" className="btn">
									{questionId === quizz['questionsNumber'] ? 'Résultat' : 'Question suivante'}
								</Button>
							</form>
						</Box>
					</Box>
				) : (
					<Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
						<Box gridColumn="span 2"></Box>
						<Box gridColumn="span 10" className="box">
							<Box style={{ display: 'flex', alignItems: 'center', textAlign: 'center', justifyContent: 'space-between' }}>
								<h1>{quizz.quizzTitle}</h1>
								<h4>
									{questionId}/{quizz['questionsNumber']}
								</h4>
							</Box>
							<Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2} style={{ height: '100%' }}>
								<Box gridColumn="span 8">
									<form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 'calc(100vh - 330px)' }}>
										<div>
											<h3>{quizz.questions.questionTitle}</h3>
											<Question question={quizz.questions} register={register} questionId={questionId} />
										</div>
										<Button type="submit" variant="contained" className="btn">
											{questionId === quizz['questionsNumber'] ? 'Résultat' : 'Question suivante'}
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
