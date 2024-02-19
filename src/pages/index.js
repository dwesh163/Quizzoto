import { Typography, Button } from '@mui/material';
import Head from 'next/head';

import Header from '../components/header/header';

export default function Home() {
	return (
		<>
			<Head>
				<title>Quizzoto - Accueil</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
				<link rel="stylesheet" href="/index.css" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
				<link href="https://fonts.googleapis.com/css2?family=Anta&family=Bebas+Neue&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet" />
			</Head>
			<main>
				<Header />
				<h1 style={{ fontFamily: 'Roboto' }}>Quizzoto - Quizz super basique</h1>
				<Button href="/quizz" variant="contained" style={{ backgroundColor: 'purple' }}>
					Quizz
				</Button>
			</main>
		</>
	);
}
