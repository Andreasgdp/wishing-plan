import { type NextPage } from 'next';

import { HomeScreen } from '@components/screens/Home/HomeScreen';
import Head from 'next/head';

const Product: NextPage = () => {
	return (
		<>
			<Head>
				<title>Wishing Plan - Product</title>
				<meta name="description" content="landing page for wishing plan" />
			</Head>

			<HomeScreen />
		</>
	);
};

export default Product;
