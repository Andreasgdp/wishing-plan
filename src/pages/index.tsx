import type { GetServerSideProps } from 'next';
import { type NextPage } from 'next';

import { DashboardScreen } from '@components/screens/Dashboard/DashboardScreen';
import { useSession } from 'next-auth/react';
import router from 'next/router';
import { requireAuthentication } from '@utils/requireAuthentication';

const Home: NextPage = () => {
	const { data: sessionData } = useSession();

	if (!sessionData) {
		router.push('/product');
		return null;
	}

	return (
		<>
			<DashboardScreen />
		</>
	);
};

export default Home;

export const getServerSideProps: GetServerSideProps = requireAuthentication(
	async () => {
		return {
			props: {},
		};
	},
);
