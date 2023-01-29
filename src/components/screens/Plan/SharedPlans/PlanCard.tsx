import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Center,
	Heading,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import { DeleteAlert } from '@components/common/Alert/DeleteAlert';
import type { Plan } from '@prisma/client';
import { trpc } from '@utils/trpc';
import router from 'next/router';
import { SharedPlanModal } from './SharedPlanModal';

export const PlanCard = ({
	plan,
	refreshListFunc,
}: {
	plan: Plan;
	refreshListFunc?: () => void;
}) => {
	const deleteWishList = trpc.plan.delete.useMutation();

	const onDelete = async () => {
		await deleteWishList.mutateAsync({ planId: plan.id });
		if (refreshListFunc) refreshListFunc();
	};

	const editWishList = trpc.plan.edit.useMutation();

	const onSubmit = async (name: string, description: string) => {
		await editWishList.mutateAsync({
			planId: plan.id,
			name: name,
			description: description,
		});
		if (refreshListFunc) await refreshListFunc();
	};

	return (
		<Center>
			<Card
				maxW={'30rem'}
				background={useColorModeValue('gray.100', 'gray.700')}
			>
				<CardHeader>
					<Heading size="md"> {plan?.name}</Heading>
				</CardHeader>
				<CardBody>
					<Text>{plan?.description}</Text>
				</CardBody>
				<CardFooter
					justify="start"
					flexWrap="wrap"
					sx={{
						'& > button': {
							minW: '2rem',
						},
					}}
				>
					<Button
						mr={4}
						mb={4}
						colorScheme="purple"
						variant="solid"
						onClick={() => {
							router.push(`/shared-plans/${plan.id}`);
						}}
					>
						View here
					</Button>

					<SharedPlanModal
						buttonProps={{
							mr: 2,
							mb: 2,
							variant: 'ghost',
							colorScheme: 'purple',
						}}
						buttonName="Edit"
						onSubmit={onSubmit}
					/>

					<DeleteAlert
						typeToDelete="WishList"
						entityName={plan?.name ?? 'WishList'}
						onDelete={onDelete}
					/>
				</CardFooter>
			</Card>
		</Center>
	);
};
