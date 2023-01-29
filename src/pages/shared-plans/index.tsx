import { requireAuthentication } from '@utils/requireAuthentication';
import type { GetServerSideProps } from 'next';
import Head from 'next/head';

import { SharedPlansScreen } from '@components/screens/Plan/SharedPlans/SharedPlansScreen';

const Plan = () => {
	return (
		<>
			<Head>
				<title>Shared Plans</title>
			</Head>

			<SharedPlansScreen />
		</>
	);
};

export const getServerSideProps: GetServerSideProps = requireAuthentication(
	async () => {
		return {
			props: {},
		};
	},
);

export default Plan;
