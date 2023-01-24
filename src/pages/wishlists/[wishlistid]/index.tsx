import { WishListScreen } from '@components/screens/WishList/WishListScreen';
import { requireAuthentication } from '@utils/requireAuthentication';
import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

const ClassroomPage: NextPage = () => {
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

export const getServerSideProps: GetServerSideProps = requireAuthentication(
	async () => {
		return {
			props: {},
		};
	},
);

export default ClassroomPage;
