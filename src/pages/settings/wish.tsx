import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';

import {
	Center,
	Container,
	Flex,
	Heading,
	Select,
	Stack,
	Tag,
} from '@chakra-ui/react';
import { Navigation } from '@components/common/Navigation/Navigation';
import { EmptyStateWrapper } from '@components/EmptyStateWrapper';
import { Content } from '@components/layouts/Content';
import { settingsNavigationData } from '@lib/constants';
import { getAuthSession } from '@utils/getServerSession';
import { trpc } from '@utils/trpc';

// TODO: implement something like this to get rid of duplicate code when creating new pages in the settings section
// https://github.com/hauptrolle/chakra-templates/blob/main/src/pages/%5B...slug%5D.tsx

// Create about page component
const Wish = () => {
	const {
		data: settings,
		isLoading,
		refetch: refetchWishLists,
	} = trpc.settings.get.useQuery();

	const updateCurrency = trpc.settings.updateCurrency.useMutation();

	return (
		<>
			<Head>
				<title>Settings - Wish</title>
			</Head>
			<Container maxW={'7xl'} flex={'1 0 auto'} py={8}>
				<Stack
					direction={{ base: 'column', lg: 'row' }}
					spacing={{ base: 0, lg: 8 }}
				>
					<Navigation data={settingsNavigationData} baseURL="/settings" />
					<Flex
						direction={'column'}
						w={'full'}
						maxW={{ lg: 'calc(100% - 16rem)' }}
					>
						<Content>
							<Stack spacing={12}>
								<Heading>Choose currency</Heading>
								<EmptyStateWrapper
									isLoading={isLoading}
									data={settings}
									EmptyComponent={
										<Center>
											<Tag size={'lg'} variant="solid" colorScheme="teal">
												No Settings
											</Tag>
										</Center>
									}
									NonEmptyComponent={
										<Select
											placeholder={settings?.currency}
											onChange={(e) => {
												updateCurrency
													.mutateAsync({
														currency: e.target.value,
													})
													.then(() => {
														refetchWishLists();
													});
											}}
										>
											<option value="EUR">Euro</option>
											<option value="USD">US Dollar</option>
											<option value="JPY">Japanese Yen</option>
											<option value="BGN">Bulgarian Lev</option>
											<option value="CZK">Czech Republic Koruna</option>
											<option value="DKK">Danish Krone</option>
											<option value="GBP">British Pound Sterling</option>
											<option value="HUF">Hungarian Forint</option>
											<option value="PLN">Polish Zloty</option>
											<option value="RON">Romanian Leu</option>
											<option value="SEK">Swedish Krona</option>
											<option value="CHF">Swiss Franc</option>
											<option value="ISK">Icelandic Króna</option>
											<option value="NOK">Norwegian Krone</option>
											<option value="HRK">Croatian Kuna</option>
											<option value="RUB">Russian Ruble</option>
											<option value="TRY">Turkish Lira</option>
											<option value="AUD">Australian Dollar</option>
											<option value="BRL">Brazilian Real</option>
											<option value="CAD">Canadian Dollar</option>
											<option value="CNY">Chinese Yuan</option>
											<option value="HKD">Hong Kong Dollar</option>
											<option value="IDR">Indonesian Rupiah</option>
											<option value="ILS">Israeli New Sheqel</option>
											<option value="INR">Indian Rupee</option>
											<option value="KRW">South Korean Won</option>
											<option value="MXN">Mexican Peso</option>
											<option value="MYR">Malaysian Ringgit</option>
											<option value="NZD">New Zealand Dollar</option>
											<option value="PHP">Philippine Peso</option>
											<option value="SGD">Singapore Dollar</option>
											<option value="THB">Thai Baht</option>
											<option value="ZAR">South African Rand</option>
										</Select>
									}
								/>
							</Stack>
						</Content>
					</Flex>
				</Stack>
			</Container>
		</>
	);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	const session = await getAuthSession(context);

	if (!session) {
		return {
			redirect: {
				destination: '/auth/signin',
				permanent: false,
			},
		};
	} else {
		return { props: {} };
	}
}

export default Wish;
