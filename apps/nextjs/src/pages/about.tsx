import { Box, Text } from '@chakra-ui/react';
import { Content } from '@components/layouts/Content';
import Head from 'next/head';

// Create about page component
const About = () => {
	return (
		<Content>
			<Box
				display="flex"
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				height="100vh"
			>
				<Head>
					<title>About</title>
				</Head>
				<Text fontSize="2xl" fontWeight="bold">
					This is the about page for Wishing Plan.
				</Text>
				<Text fontSize="xl" fontWeight="medium">
					...
				</Text>
			</Box>
		</Content>
	);
};

export default About;
