import type { GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';

import { PlanScreen } from '@components/screens/Plan/PlanScreen';
import { getAuthSession } from '@utils/getServerSession';

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

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const session = await getAuthSession(context);

	if (!session) {
		return {
			redirect: {
				destination: '/auth/signin',
				permanent: false,
			},
		};
	} else {
		return { props: {} };
	}
}

export default Plan;
