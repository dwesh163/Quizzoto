import UserList from '@/components/userList';
import Header from '../../components/header/header';
import { getSession, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import { CircularProgress } from '@mui/material';

export default function Page() {
	const { data: session, status } = useSession();

	if (status === 'loading') {
		return <p>Loading...</p>;
	}

	const [users, setUsers] = useState();
	const [search, setSearch] = useState();
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getData = async () => {
			const response = await fetch(`/api/user/all`);
			const jsonData = await response.json();
			setUsers(jsonData);
			setIsLoading(false);
		};
		getData();
	}, []);

	useEffect(() => {
		if (!search || !users) {
			setFilteredUsers(users);
		} else {
			const filtered = users.filter((user) => user.username.toLowerCase().includes(search.toLowerCase()));
			setFilteredUsers(filtered);
		}
	}, [search, users]);

	const windowSize = useWindowSize();

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
				<Header setSearch={setSearch} />

				{windowSize.width < 1200 ? (
					<Box className="box">
						<h1>User List</h1>
						{!isLoading ? (
							<UserList users={filteredUsers} />
						) : (
							<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', verticalAlign: 'center', height: '100%' }}>
								<CircularProgress />
							</Box>
						)}
					</Box>
				) : (
					<Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
						<Box gridColumn="span 2"></Box>
						<Box gridColumn="span 10" className="box">
							<h1>User List</h1>

							{!isLoading ? (
								<UserList users={filteredUsers} />
							) : (
								<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', verticalAlign: 'center', height: '100%' }}>
									<CircularProgress />
								</Box>
							)}
						</Box>
					</Box>
				)}
			</main>
		</>
	);
}

export async function getServerSideProps(context) {
	const session = await getSession(context);

	return {
		props: {
			session: session ?? null,
		},
	};
}
