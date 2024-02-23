import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import fetchQuizzs from '../../../lib/fetchQuizzs';
import Box from '@mui/material/Box';
import { CircularProgress } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ListSubheader from '@mui/material/ListSubheader';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Avatar from 'boring-avatars';

import Header from '../../components/header/header';

export default function Quizz() {
	const [quizzs, setQuizzs] = useState();
	const [isLoading, setIsLoading] = useState(true);

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
		position: 'relative',
	};

	useEffect(() => {
		const getData = async () => {
			const jsonData = await fetchQuizzs();
			setQuizzs(jsonData);
			setIsLoading(false);
		};
		getData();
	}, []);

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
				<Header />

				<Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
					<Box gridColumn="span 2"></Box>
					<Box gridColumn="span 10" style={BoxStyle}>
						<h1>Discover the quizzes</h1>
						{!isLoading ? (
							<ImageList sx={{ width: '100%', height: 'calc(100vh - 450px)', overflow: 'scroll' }} cols={5} rowHeight={154}>
								{quizzs.map((quizz, index) => (
									<a key={index} href={`/quizz/${quizz.quizzSlug}`}>
										<ImageListItem style={{ cursor: 'pointer' }}>
											{quizz.quizzImg ? <img src={quizz.quizzImg} alt="Quizz background" style={{ width: '100%', height: '100%', borderRadius: '15px', objectFit: 'cover' }} /> : <Avatar size={50} name={quizz.quizzTitle} square="true" variant="marble" colors={['#FF9B8F', '#EF7689', '#9E6A90', '#766788', '#71556B']} />}
											<ImageListItemBar style={{ backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '0px 0px 15px 15px' }} title={<h3 style={{ margin: '0px', marginBottom: '5px' }}>{quizz.quizzTitle}</h3>} subtitle={quizz.quizzDescription} />
										</ImageListItem>
									</a>
								))}
							</ImageList>
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
