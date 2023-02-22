import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

import { SharedPlansScreen } from '@components/screens/Plan/SharedPlans/SharedPlansScreen';
import { getAuthSession } from '@utils/getServerSession';

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

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const session = getAuthSession(context);

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
