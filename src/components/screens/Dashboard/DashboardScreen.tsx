import { Center, Container, FormErrorMessage, Tag } from '@chakra-ui/react';
import { EmptyStateWrapper } from '@components/EmptyStateWrapper';
import { Content } from '@components/layouts/Content';
import { trpc } from '@utils/trpc';
import { WishListModal } from './WishListModal';
import { WishListsList } from './WishListsList';

export type WishListForm = {
	name: string;
	description: string;
};

export const DashboardScreen = () => {
	const {
		data: wishLists,
		isLoading,
		refetch: refetchWishLists,
	} = trpc.wishList.getAll.useQuery();

	const createWishList = trpc.wishList.create.useMutation();

	const onSubmit = async (name: string, description: string) => {
		await createWishList.mutateAsync({
			name: name,
			description: description,
		});
		await refetchWishLists();
	};

	return (
		<>
			<Content>
				<Container maxW="container.xl">
					<Center h="100px">
						<WishListModal
							buttonProps={{
								variant: 'solid',
								colorScheme: 'green',
							}}
							buttonName="Create a new WishList"
							onSubmit={onSubmit}
						/>
					</Center>
					{/* TODO: replace with skeleton setup in future */}
					<EmptyStateWrapper
						isLoading={isLoading}
						data={wishLists}
						EmptyComponent={
							<Center>
								<Tag size={'lg'} variant="solid" colorScheme="teal">
									No WishLists
								</Tag>
							</Center>
						}
						NonEmptyComponent={
							<WishListsList
								refreshListFunc={refetchWishLists}
								wishLists={wishLists ?? []}
							/>
						}
					/>
					<FormErrorMessage>Description is required.</FormErrorMessage>
				</Container>
			</Content>
		</>
	);
};
