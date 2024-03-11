import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getRedirectUrl } from '../../../lib/links';

import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';

export default function Link({ url }) {
	const router = useRouter();

	useEffect(() => {
		if (url) {
			router.push(url);
		} else {
			console.error("L'URL de redirection n'a pas été trouvée.");
		}
	}, [url, router]);

	return (
		<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', verticalAlign: 'center', height: '100vh' }}>
			<CircularProgress />
		</Box>
	);
}

export async function getServerSideProps(context) {
	const { link } = context.params;

	try {
		const url = await getRedirectUrl(link);

		return {
			props: {
				url,
			},
		};
	} catch (error) {
		console.error("Une erreur s'est produite lors de la récupération de l'URL de redirection :", error);
		return {
			props: {
				url: null,
			},
		};
	}
}
