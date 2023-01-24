import { Container, SimpleGrid } from '@chakra-ui/react';
import type { WishList } from '@prisma/client';
import { WishListCard } from './WishListCard';

export const WishListsList = ({
	wishLists,
	refreshListFunc,
}: {
	wishLists: WishList[];
	refreshListFunc?: () => void;
}) => {
	return (
		<Container maxW="container.xl">
			<SimpleGrid minChildWidth="11rem" spacing="40px">
				{wishLists.map((wishList) => (
					<WishListCard
						refreshListFunc={refreshListFunc}
						key={wishList.id}
						wishList={wishList}
					/>
				))}
			</SimpleGrid>
		</Container>
	);
};
