import { WishListScreen } from '@components/screens/WishList/WishListScreen';
import { getAuthSession } from '@utils/getServerSession';
import type { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

const WishListPage: NextPage = () => {
	const router = useRouter();
	const wishListId = router.query.wishlistid as string;

	return (
		<>
			<Head>
				<title>Wishes</title>
				<meta
					name="description"
					content="all of the classrooms you've created as a teacher"
				/>
			</Head>

			{wishListId && <WishListScreen wishListId={wishListId} />}
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

export default WishListPage;
