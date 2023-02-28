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

export default Plan;
