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

export default function Quizz() {
	const [quizz, setQuizz] = useState();
	const [UserAnswer, setUserAnswer] = useState({});

	const [questionId, setQuestionId] = useState(1);

	const router = useRouter();

  useEffect(() => {
		if (!router.query.id || !router.query.q || router.query.q > questionId) {
      return;
    }

    const getData = async () => {
			const jsonData = await fetchQuizz(router.query.id, questionId);
			setQuizz(jsonData);
		};
		getData();
	}, [questionId, router.query.id]);

	useEffect(() => {
		if (router.query.q == undefined) {
			setQuestionId(parseInt(1));
		} else {
		setQuestionId(parseInt(router.query.q));
		}
	}, [router.query.q]);

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

  return (
    <>
			<Head>
				<title>Quizzoto - Quizz</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
				<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
				<link rel="stylesheet" href="/quizz.css" />
			</Head>
			<main>
				{quizz?.statusCode ? (
					<p>Merci de fournir un id de quizz correct dans l'URL.</p>
				) : quizz ? (
					<Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
						<Box gridColumn="span 12">
							<h1>{quizz.quizzTitle}</h1>
							<h2>{quizz.quizzDescription}</h2>
						</Box>
						<Box gridColumn="span 8">
							<form onSubmit={handleSubmit(onSubmit)}>
								<div>
									<h3>{quizz.questions.questionTitle}</h3>
									<Question question={quizz.questions} register={register} questionId={questionId} />
								</div>
								<Button type="submit" variant="contained">
									Question suivante
								</Button>
							</form>
						</Box>
						<Box gridColumn="span 4">
							<QuizzTimeline quizzId={router.query.id} questionId={questionId} userAnswer={UserAnswer} />
						</Box>
					</Box>
				) : (
					<h2>Chargement...</h2>
				)}
			</main>
		</>
	);
}
