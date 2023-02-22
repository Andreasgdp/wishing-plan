import {
	Box,
	Center,
	chakra,
	Container,
	Divider,
	Flex,
	Link,
	Stack,
	Text,
	useColorModeValue,
	VisuallyHidden,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import type { ReactNode } from 'react';
import { FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';
import { IoLogoGithub } from 'react-icons/io5';
import Logo from '../Header/Logo';

const SocialButton = ({
	children,
	label,
	href,
}: {
	children: ReactNode;
	label: string;
	href: string;
}) => {
	return (
		<chakra.button
			bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
			rounded={'full'}
			w={8}
			h={8}
			cursor={'pointer'}
			as={'a'}
			href={href}
			display={'inline-flex'}
			alignItems={'center'}
			justifyContent={'center'}
			transition={'background 0.3s ease'}
			_hover={{
				bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
			}}
		>
			<VisuallyHidden>{label}</VisuallyHidden>
			{children}
		</chakra.button>
	);
};

export default function SmallCentered() {
	return (
		<Box
			bg={useColorModeValue('gray.50', 'gray.800')}
			color={useColorModeValue('gray.700', 'gray.200')}
		>
			<Container
				as={Stack}
				maxW={'md'}
				mt={8}
				spacing={4}
				justify={'center'}
				align={'center'}
			>
				<Divider />
			</Container>
			<Container
				as={Stack}
				maxW={'6xl'}
				py={4}
				spacing={4}
				justify={'center'}
				align={'center'}
			>
				<Logo showVersion />
				<Stack direction={['column', 'row']} spacing={6}>
					<Link as={NextLink} href="/product">
						<Center>Product</Center>
					</Link>
					<Link as={NextLink} href={'/about'}>
						<Center>About</Center>
					</Link>
					<Link as={NextLink} href={'features'}>
						<Center>Features</Center>
					</Link>
					<Link as={NextLink} href={'contact'}>
						<Center>Contact</Center>
					</Link>
					<Link
						as={NextLink}
						target="_blank"
						href="https://github.com/Andreasgdp/Wishing-Plan"
						display="inline-flex"
						alignItems="center"
						style={{ gap: 4 }}
					>
						<IoLogoGithub color={useColorModeValue('black', 'white')} />
						<Center>Source</Center>
					</Link>
				</Stack>
			</Container>

			<Box
				borderTopWidth={1}
				borderStyle={'solid'}
				borderColor={useColorModeValue('gray.200', 'gray.700')}
			>
				<Container
					as={Stack}
					maxW={'6xl'}
					py={4}
					direction={{ base: 'column', md: 'row' }}
					spacing={4}
					justify={{ base: 'center', md: 'space-between' }}
					align={{ base: 'center', md: 'center' }}
				>
					<Flex gap={4}>
						<SocialButton label={'Twitter'} href={'#'}>
							<FaTwitter />
						</SocialButton>
						<SocialButton label={'YouTube'} href={'#'}>
							<FaYoutube />
						</SocialButton>
						<SocialButton label={'Instagram'} href={'#'}>
							<FaInstagram />
						</SocialButton>
					</Flex>

					<Text justifyContent={'center'}>
						© 2022 Wishing Plan. All rights reserved
					</Text>
				</Container>
			</Box>
		</Box>
	);
}
