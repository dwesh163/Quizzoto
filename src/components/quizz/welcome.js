import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Rank from './rank';
import { useSession } from 'next-auth/react';
import User from '../header/user';

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

const ImgStyle = {
	borderRadius: '30px',
	width: 'auto',
	height: '300px',
	boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
};

const TextStyle = {
	fontSize: '1.2rem',
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
	fontSize: '105%',
	height: '65px',
	lineHeight: '1.15',
	margin: '110px 0 0',
	outline: 'none',
	overflow: 'hidden',
	padding: '20px 65px',
	position: 'relative',
	textAlign: 'center',
	textTransform: 'none',
	transform: 'translateZ(0)',
	transition: 'all .2s,box-shadow .08s ease-in',
	userSelect: 'none',
	width: '100%',
};

const BtnStyleSecondary = {
	appearance: 'button',
	backfaceVisibility: 'hidden',
	backgroundColor: 'rgb(95, 95, 95)',
	borderRadius: '30px',
	borderWidth: '0',
	boxShadow: 'rgba(50, 50, 93, .1) 0 0 0 1px inset,rgba(50, 50, 93, .1) 0 2px 5px 0,rgba(0, 0, 0, .07) 0 1px 1px 0',
	boxSizing: 'border-box',
	color: '#fff',
	cursor: 'pointer',
	fontSize: '105%',
	height: '65px',
	lineHeight: '1.15',
	margin: '110px 0 0',
	outline: 'none',
	overflow: 'hidden',
	padding: '20px 65px',
	position: 'relative',
	textAlign: 'center',
	textTransform: 'none',
	transform: 'translateZ(0)',
	transition: 'all .2s,box-shadow .08s ease-in',
	userSelect: 'none',
	width: '100%',
	maxWidth: '30%',
	alignSelf: 'flex-end',
};

const QuizzInfo = ({ quizzInfo, user }) => {
	return (
		<table>
			<tbody>
				{Object.keys(quizzInfo).map((key, index) => (
					<tr key={index}>
						<td style={{ fontWeight: '600', padding: '10px 0px', fontSize: '1.5rem' }}>{key}:</td>
						<td style={{ paddingLeft: '40px' }}>
							{quizzInfo[key]} {key == 'Points' ? 'Points' : ''}
						</td>
					</tr>
				))}
				<tr>
					<td style={{ fontWeight: '600', padding: '10px 0px', fontSize: '1.5rem' }}>Creator</td>

					<td style={{ paddingLeft: '30px' }}>
						<User user={user} scale={'90%'} style={{ height: 'auto' }} />
					</td>
				</tr>
			</tbody>
		</table>
	);
};

export default function Welcome({ quizz }) {
	const { data: session } = useSession();

	const router = useRouter();

	const handleClick = () => {
		const query = { ...router.query };

		query.q = '1';

		router.push({
			pathname: router.pathname,
			query: query,
		});
	};
	const handleClickRoom = () => {
		const quizzId = router.query.id;
		const requestData = {
			ownerId: session.user.id,
		};

		const requestOptions = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestData),
		};

		fetch(`/api/rooms?s=${quizzId}`, requestOptions)
			.then((response) => {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error('Failed to start room');
				}
			})
			.then((data) => {
				const query = { ...router.query };
				query.s = data.id;
				query.q = '1';
				router.push({
					pathname: `/room/${data.id}`,
				});
			})
			.catch((error) => {
				console.error('Error starting room:', error);
			});
	};

	return (
		<Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
			<Box gridColumn="span 2"></Box>
			<Box gridColumn="span 10" style={BoxStyle}>
				{quizz ? (
					<>
						<h1 style={{ marginBottom: '0px' }}>{quizz.quizzTitle}</h1>
						<span style={TextStyle}>Read the following instructions</span>
						<Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
							<Box gridColumn="span 8">
								<Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2} style={{ marginTop: '15px' }}>
									<Box gridColumn="span 6">
										<div style={{ position: 'relative', width: '100%', height: '300px', borderRadius: '30px', overflow: 'hidden' }}>
											<img src={quizz.quizzImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
										</div>
									</Box>

									<Box gridColumn="span 6" style={{ marginLeft: '25px' }}>
										<QuizzInfo quizzInfo={quizz.quizzInfo} user={quizz.creator} />
									</Box>
								</Box>
								<h3> Instructions</h3>
								<p>{quizz.quizzDescription}</p>
								<Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '40%', gap: '10px' }}>
									<Link href={{ pathname: router.pathname, query: { ...router.query, q: '1' } }} passHref style={{ maxWidth: '50%', alignSelf: 'flex-end' }}>
										<Button type="button" onClick={handleClick} variant="contained" style={BtnStyle}>
											Start
										</Button>
									</Link>
									{session != null ? (
										<Button type="button" onClick={handleClickRoom} variant="contained" style={BtnStyleSecondary}>
											Start a Room
										</Button>
									) : (
										<></>
									)}
								</Box>
							</Box>
							<Box gridColumn="span 4">
								<Rank quizzId={''} />
							</Box>
						</Box>
					</>
				) : (
					<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', verticalAlign: 'center', height: '100%' }}>
						<CircularProgress />
					</Box>
				)}
			</Box>
		</Box>
	);
}
