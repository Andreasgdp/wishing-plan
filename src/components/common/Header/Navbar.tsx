import type { ReactNode } from 'react';

import { HamburgerIcon } from '@chakra-ui/icons';
import {
	Box,
	Container,
	Flex,
	Heading,
	IconButton,
	Link,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Spacer,
	Stack,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { signOut, useSession } from 'next-auth/react';
import NextLink from 'next/link';
import { IoLogoGithub } from 'react-icons/io5';
import ThemeToggleButton from '../Theme/ThemeToggleButton';
import Logo from './Logo';

type LinkItemProps = {
	href: string;
	path: string;
	children: ReactNode;
};

const LinkItem = ({ href, path, children }: LinkItemProps) => {
	const active = path === href;
	const inacitiveColor = useColorModeValue('gray200', 'white.900');
	const activeColor = useColorModeValue(
		'navBarPrimaryLight',
		'navBarPrimaryDark'
	);
	return (
		<Link
			as={NextLink}
			p={2}
			bg={active ? activeColor : undefined}
			color={active ? '#202023' : inacitiveColor}
			borderRadius={4}
			href={href}
			style={{ marginTop: '-2px' }}
		>
			{children}
		</Link>
	);
};

type NavbarProps = {
	path: string;
};

const Navbar = (props: NavbarProps) => {
	const { path } = props;

	return (
		<Box
			position="fixed"
			as="nav"
			w="100%"
			bg={useColorModeValue('#dfe7f099', '#2d374899')}
			style={{ backdropFilter: 'blur(10px)' }}
			zIndex={1}
			{...props}
		>
			<Container display="flex" p={2} maxW="container.xxl">
				<Box mr={5} mt={1}>
					<Heading as="h1" size="lg" letterSpacing={'tighter'}>
						<Logo />
					</Heading>
				</Box>
				<FullMenu path={path} />

				<CollapsedMenu />
			</Container>
		</Box>
	);
};

export default Navbar;
function FullMenu({ path }: { path: string }) {
	const { data: sessionData } = useSession();
	return (
		<Stack
			direction={{ base: 'column', md: 'row' }}
			display={{ base: 'none', md: 'flex' }}
			width={{ base: 'full', md: 'auto' }}
			spacing="12px"
		>
			<LinkItem href="/about" path={path}>
				About
			</LinkItem>
			<LinkItem href="/features" path={path}>
				Features
			</LinkItem>
			<Link
				target="_blank"
				href="https://github.com/Andreasgdp/Wishing-Plan"
				color={useColorModeValue('gray200', 'white.900')}
				display="inline-flex"
				alignItems="center"
				style={{ gap: 4, marginTop: '-2px' }}
				pl={2}
			>
				<IoLogoGithub />
				<Text style={{ marginTop: '-2px' }}>Source</Text>
			</Link>
			{sessionData && (
				<button
					style={{ marginTop: '-3px', marginLeft: '1.5rem' }}
					onClick={() => signOut()}
				>
					Sign Out
				</button>
			)}
		</Stack>
	);
}

function CollapsedMenu() {
	const { data: sessionData } = useSession();

	return (
		<Flex flex={1}>
			<Spacer />
			<ThemeToggleButton />
			<Box ml={2} display={{ base: 'inline-block', md: 'none' }}>
				<Menu>
					<MenuButton
						as={IconButton}
						icon={<HamburgerIcon />}
						variant="outline"
						aria-label="Options"
					/>
					<MenuList>
						<MenuItem as={NextLink} href="/about">
							About
						</MenuItem>
						<MenuItem as={NextLink} href="/features">
							Features
						</MenuItem>
						{sessionData && (
							<MenuItem>
								<button onClick={() => signOut()}>
									Sign Out
								</button>
							</MenuItem>
						)}
						<MenuItem
							as={Link}
							href="https://github.com/Andreasgdp/Portfolio"
						>
							View Source
						</MenuItem>
					</MenuList>
				</Menu>
			</Box>
		</Flex>
	);
}
