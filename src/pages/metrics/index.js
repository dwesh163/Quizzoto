import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getUserNumber } from '../../../lib/metrics';

export default function Metrics({ data }) {
	return <pre>user_number {data.user_number}</pre>;
}

export async function getServerSideProps(context) {
	const data = { user_number: await getUserNumber() };
	return {
		props: {
			data,
		},
	};
}
