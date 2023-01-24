import { requireAuthentication } from '@utils/requireAuthentication';
import type { GetServerSideProps } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';

import { PlanScreen } from '@components/screens/Plan/PlanScreen';

const Plan = () => {
	const { data: sessionData } = useSession();

	return (
		<>
			<Head>
				<title>Plan - {sessionData?.user?.name}</title>
			</Head>

			<PlanScreen />
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
