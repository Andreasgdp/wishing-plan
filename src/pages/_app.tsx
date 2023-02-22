import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';

import { trpc } from '../utils/trpc';

import { ChakraProvider } from '@chakra-ui/react';
import { Analytics } from '@vercel/analytics/react';
import { AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import NextProgress from 'nextjs-progressbar';
import Fonts from '../components/common/Theme/Fonts';
import Layout from '../components/layouts/Layout';
import theme from '../libs/theme';
import '../styles/globals.css';

const prefersDarkMode = () => {
	return globalThis?.window?.matchMedia('(prefers-color-scheme: dark)').matches;
};

const MyApp: AppType<{ session: Session | null }> = ({
	Component,
	pageProps: { session, ...pageProps },
	router,
}) => {
	return (
		<>
		<SessionProvider session={session}>
			{/* <Head>
				{!prefersDarkMode() && (
					<>
						<link rel="shortcut icon" href="/favicon/light/favicon.ico" />

						<link
							rel="apple-touch-icon"
							sizes="180x180"
							href="/favicon/light/apple-touch-icon.png"
						/>
						<link
							rel="icon"
							type="image/png"
							sizes="32x32"
							href="/favicon/light/favicon-32x32.png"
						/>
						<link
							rel="icon"
							type="image/png"
							sizes="16x16"
							href="/favicon/light/favicon-16x16.png"
						/>
					</>
				)}
				{prefersDarkMode() && (
					<>
						<link rel="shortcut icon" href="/favicon/dark/favicon.ico" />
						<link
							rel="apple-touch-icon"
							sizes="180x180"
							href="/favicon/dark/apple-touch-icon.png"
						/>
						<link
							rel="icon"
							type="image/png"
							sizes="32x32"
							href="/favicon/dark/favicon-32x32.png"
						/>
						<link
							rel="icon"
							type="image/png"
							sizes="16x16"
							href="/favicon/dark/favicon-16x16.png"
						/>
					</>
				)}
			</Head>
			<ChakraProvider theme={theme}>
				<Fonts />
				<Layout>
					<AnimatePresence
						mode="wait"
						initial={true}
						onExitComplete={() => {
							if (typeof window !== 'undefined') {
								window.scrollTo({ top: 0 });
							}
						}}
						>
						<NextProgress color={'grey'} options={{ showSpinner: false }} />
						<Component {...pageProps} key={router.route} />
						<Analytics />
					</AnimatePresence>
				</Layout>
			</ChakraProvider> */}
		</SessionProvider>
						</>
	);
};

export default trpc.withTRPC(MyApp);
