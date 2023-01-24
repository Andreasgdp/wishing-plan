import type { ReactNode } from 'react';

import { Box, Center } from '@chakra-ui/react';
import Head from 'next/head';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Triangle } from 'react-loader-spinner';
import Footer from '../common/Footer/Footer';
import Navbar from '../common/Header/Navbar';

type LayoutProps = {
	children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
	const status = useSession().status;
	const router = useRouter();

	if (status === 'loading') {
		return (
			<Center height="100vh" width="100vw">
				<Triangle
					height="50vh"
					width="50vw"
					color="#ba3f86"
					ariaLabel="triangle-loading"
					wrapperStyle={{}}
					visible={true}
				/>
			</Center>
		);
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
