import { type NextPage } from 'next';

import Head from 'next/head';

const Product: NextPage = () => {
	return (
		<>
			<Head>
				<title>Wishing Plan - Product</title>
				<meta name="description" content="landing page for wishing plan" />
			</Head>

			<div className="flex flex-col items-center justify-center min-h-screen py-2">
				<main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
					<h1 className="text-6xl font-bold">
						Welcome to <a href="https://nextjs.org">Next.js!</a>
					</h1>
				</main>
			</div>
		</>
	);
};

export default Product;
