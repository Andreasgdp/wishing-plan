import type { GetServerSidePropsContext } from 'next';
import { type NextPage } from 'next';

import { DashboardScreen } from '@components/screens/Dashboard/DashboardScreen';
import { getAuthSession } from '@utils/getServerSession';

const Home: NextPage = () => {
	return (
		<>
			<DashboardScreen />
		</>
	);
};

export default Home;

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const session = await getAuthSession(context);

	if (!session) {
		return {
			redirect: {
				destination: '/product',
				permanent: false,
			},
		};
	} else {
		return { props: {} };
	}
}
