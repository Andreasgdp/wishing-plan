import type { ReactNode } from 'react';

import { Box } from '@chakra-ui/react';
import Head from 'next/head';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Footer from '../common/Footer/Footer';
import Navbar from '../common/Header/Navbar';

type LayoutProps = {
	children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
	const status = useSession().status;
	const router = useRouter();

	if (status === 'loading') {
		return <></>;
	}
	return (
		<Box as="main">
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<title>Wishing Plan</title>
			</Head>

			<Navbar path={router.asPath} />

			<div style={{ paddingTop: '3.5rem', minHeight: '100vh' }}>{children}</div>

			<Footer />
		</Box>
	);
};

export default Layout;
