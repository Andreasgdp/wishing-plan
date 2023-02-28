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

export default Plan;
