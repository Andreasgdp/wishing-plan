import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Heading,
	Icon,
	Input,
	Link,
	Stack,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { getAuthSession } from '@utils/getServerSession';
import type { GetServerSidePropsContext } from 'next';
import type { ClientSafeProvider } from 'next-auth/react';
import { getProviders, signIn } from 'next-auth/react';
import NextLink from 'next/link';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import type { IconType } from 'react-icons';
import { FaDiscord, FaGoogle } from 'react-icons/fa';

import { Content } from '../../components/layouts/Content';

type formButtonProps = {
	// return type of getProviders()
	provider: ClientSafeProvider;
};

const FormButton = (props: formButtonProps) => {
	const { provider } = props;

	if (provider.name === 'Email') {
		return null;
	}

	let icon: IconType;
	let color: string;

	switch (provider.name.toString().toLowerCase()) {
		case 'google':
			icon = FaGoogle;
			color = 'red.500';
			break;
		case 'discord':
			icon = FaDiscord;
			color = '#7a83f8';
			break;
		default:
			icon = FaGoogle;
			color = 'red.500';
			break;
	}

	const text = `Sign in with ${provider.name}`;

	return (
		<Button
			height={[`${text.length > 18 ? '60px' : '40px'}`, '40px']}
			style={{
				whiteSpace: 'normal',
				wordWrap: 'break-word',
			}}
			bg={color}
			leftIcon={<Icon as={icon} />}
			onClick={() => {
				signIn(provider.id, {
					callbackUrl: '/',
				});
			}}
		>
			{text}
		</Button>
	);
};

export default function SimpleCard({
	providers,
}: {
	providers: ClientSafeProvider[];
}) {
	const [email, setEmail] = useState('');
	const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
		event.preventDefault();

		signIn('email', {
			email,
		});
	};

	return (
		<Content>
			<Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
				<Stack align={'center'}>
					<Heading fontSize={'4xl'}>Sign in to your account</Heading>
					<Text fontSize={'lg'} color={'gray.600'}>
						to enjoy all of our cool{' '}
						<Link as={NextLink} color={'blue.400'} href={'/features'}>
							features
						</Link>{' '}
						✌️
					</Text>
				</Stack>
				<Box
					rounded={'lg'}
					bg={useColorModeValue('white', 'gray.700')}
					boxShadow={'lg'}
					p={8}
				>
					<form onSubmit={handleSubmit}>
						<Stack spacing={4}>
							<FormControl id="email" isRequired>
								<FormLabel>Email address</FormLabel>

								<Input
									type="email"
									placeholder="Email (Not Setup - Please Use Google/Discord)"
									onChange={(event) => setEmail(event.currentTarget.value)}
								/>
							</FormControl>

							<Stack spacing={10}>
								<Button
									bg={'blue.400'}
									color={'white'}
									_hover={{
										bg: 'blue.500',
									}}
									type="submit"
								>
									Sign in
								</Button>
							</Stack>

							<Text align={'center'}>OR</Text>

							<Stack spacing={5}>
								{providers &&
									Object.values(providers).map(
										(provider: ClientSafeProvider) => (
											<FormButton key={provider.name} provider={provider} />
										),
									)}
							</Stack>
						</Stack>
					</form>
				</Box>
			</Stack>
		</Content>
	);
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
	ctx.res.setHeader(
		'Cache-Control',
		'public, s-maxage=1000, stale-while-revalidate=604800',
	);

	const session = await getAuthSession(ctx);

	if (session) {
		return {
			redirect: {
				destination: '/',
				permanent: false,
			},
		};
	}

	const providers = await getProviders();
	return {
		props: {
			providers,
		},
	};
}
