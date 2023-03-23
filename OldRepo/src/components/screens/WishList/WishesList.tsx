import { Container, SimpleGrid } from '@chakra-ui/react';
import type { Wish } from '@prisma/client';
import { WishCard } from './WishCard';

export const WishesList = ({
	wishes,
	refreshListFunc,
}: {
	wishes: Wish[];
	refreshListFunc?: () => void;
}) => {
	return (
		<Container maxW="container.xxl">
			<SimpleGrid minChildWidth="11rem" spacing="40px">
				{wishes.map((wish, index) => (
					<WishCard
						refreshListFunc={refreshListFunc}
						key={wish.id}
						wish={wish}
						index={index}
					/>
				))}
			</SimpleGrid>
		</Container>
	);
};
