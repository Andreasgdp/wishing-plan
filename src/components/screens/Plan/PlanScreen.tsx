import {
	Center,
	Container,
	Flex,
	Heading,
	Stack,
	Tag,
	useToast,
} from '@chakra-ui/react';
import { EmptyStateWrapper } from '@components/EmptyStateWrapper';
import { Content } from '@components/layouts/Content';
import { PlanSidebar } from '@components/screens/Plan/PlanSidebar';
import type { SortablePlanWishType } from '@components/screens/Plan/PlanWish';
import { PlanWishComponent } from '@components/screens/Plan/PlanWish';
import { WishModal } from '@components/screens/WishList/WishModal';
import type { DragEndEvent } from '@dnd-kit/core';
import { closestCenter, DndContext } from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Plan } from '@prisma/client';
import type { PlanWishType } from '@server/trpc/router/Plan/plan';
import { trpc } from '@utils/trpc';
import moment from 'moment';
import { useEffect, useState } from 'react';

type PlanScreenProps = {
	planId?: string;
};

export const PlanScreen = (props: PlanScreenProps) => {
	const toast = useToast();
	const planId = props.planId !== undefined ? props.planId : null;
	const isSharedPlan = planId !== null;
	const {
		data: plan,
		isLoading,
		refetch: refetchPlan,
	} = trpc.plan.get.useQuery({ planId });

	const {
		data: currency,
		isLoading: isLoadingCurrency,
		refetch: refetchCurrency,
	} = trpc.settings.getCurrency.useQuery();

	const [stateWishes, setWishes] = useState<PlanWishType[]>([]);

	const createAndAddWish = trpc.plan.createAndAddWish.useMutation();

	const editWish = trpc.plan.editWish.useMutation();

	const relocateWish = trpc.plan.relocateWish.useMutation();

	const updatePlanSettings = trpc.plan.updatePlan.useMutation();

	const deleteWish = trpc.plan.deleteWish.useMutation();

	const onPlanSettingsChange = async (
		amountToSave: number,
		currentAmountSaved: number,
		firstSaving: Date,
		frequency: string,
	) => {
		await updatePlanSettings
			.mutateAsync({
				planId,
				amountToSave,
				currentAmountSaved,
				firstSaving,
				frequency,
			})
			.then(async () => {
				await refetchPlan();
				await refetchCurrency();
				toast({
					title: 'Plan updated',
					description: `Your plan has been updated`,
					status: 'success',
					duration: 2000,
					isClosable: true,
					position: 'top',
				});
			})
			.catch((err) => {
				toast({
					title: 'Error',
					description: err.message,
					status: 'error',
					duration: 2000,
					isClosable: true,
					position: 'top',
				});
			});
	};

	useEffect(() => {
		setWishes(plan?.wishes ?? []);
	}, [plan?.wishes]);

	const onSubmit = async (
		title: string,
		description: string,
		url: string,
		imageUrl: string,
		price: number,
	) => {
		await createAndAddWish
			.mutateAsync({
				planId,
				wishTitle: title,
				wishDescription: description ?? '',
				wishPrice: price,
				wishUrl: url,
				wishImageUrl: imageUrl,
			})
			.then(async () => {
				await refetchPlan();
				await refetchCurrency();
				toast({
					title: 'Wish created',
					description: `${title} been added to your plan`,
					status: 'success',
					duration: 2000,
					isClosable: true,
					position: 'top',
				});
			})
			.catch((err) => {
				toast({
					title: 'Error',
					description: err.message,
					status: 'error',
					duration: 2000,
					isClosable: true,
					position: 'top',
				});
			});
	};

	const onEdit = async (
		wishId: string,
		title: string,
		description: string,
		url: string,
		imageUrl: string,
		price: number,
		placement: number,
	) => {
		await editWish
			.mutateAsync({
				planId,
				wishId,
				wishTitle: title,
				wishDescription: description ?? '',
				wishPrice: price,
				wishUrl: url,
				wishImageUrl: imageUrl,
				placement: placement,
			})
			.then(async () => {
				await refetchPlan();
				await refetchCurrency();
				toast({
					title: 'Wish updated',
					description: `${title} been updated`,
					status: 'success',
					duration: 2000,
					isClosable: true,
					position: 'top',
				});
			})
			.catch((err) => {
				toast({
					title: 'Error',
					description: err.message,
					status: 'error',
					duration: 2000,
					isClosable: true,
					position: 'top',
				});
			});
	};

	const onWishDelete = async (wishId: string) => {
		await deleteWish
			.mutateAsync({
				planId,
				wishId,
			})
			.then(async () => {
				await refetchPlan();
				await refetchCurrency();
				toast({
					title: 'Wish deleted',
					description: `Your wish has been deleted`,
					status: 'success',
					duration: 2000,
					isClosable: true,
					position: 'top',
				});
			})
			.catch((err) => {
				toast({
					title: 'Error',
					description: err.message,
					status: 'error',
					duration: 2000,
					isClosable: true,
					position: 'top',
				});
			});
	};

	const heading = isSharedPlan ? `Plan: ${plan?.plan.name}` : 'Main Plan';

	return (
		<Content>
			<Container maxW={'7xl'} flex={'1 0 auto'} py={8}>
				<Center mb={6}>
					<Heading size={'lg'}>{heading}</Heading>
				</Center>
				<Stack
					direction={{ base: 'column', lg: 'row' }}
					spacing={{ base: 0, lg: 8 }}
				>
					<EmptyStateWrapper
						isLoading={isLoading || isLoadingCurrency}
						data={plan}
						EmptyComponent={
							<Center>
								<Tag size={'lg'} variant="solid" colorScheme="teal">
									Sign out and sign in again to get plan back
								</Tag>
							</Center>
						}
						NonEmptyComponent={
							<PlanSidebar
								plan={plan?.plan ?? undefined}
								sharedWith={plan?.sharedWith ?? []}
								currency={currency ?? undefined}
								onPlanSettingsChange={onPlanSettingsChange}
							/>
						}
					/>

					<Flex
						direction={'column'}
						w={'full'}
						maxW={{ lg: 'calc(100% - 16rem)' }}
					>
						<EmptyStateWrapper
							isLoading={isLoading || isLoadingCurrency}
							data={plan}
							EmptyComponent={
								<Center>
									<Tag size={'lg'} variant="solid" colorScheme="teal">
										Sign out and sign in again to get plan back
									</Tag>
								</Center>
							}
							NonEmptyComponent={
								<>
									<Center>
										<WishModal
											buttonProps={{
												variant: 'solid',
												colorScheme: 'green',
											}}
											buttonName="Add a wish"
											onSubmit={onSubmit}
										/>
									</Center>
									<Flex justifyContent="right" mb={4}></Flex>

									<DndContext
										collisionDetection={closestCenter}
										onDragEnd={handleDragEnd}
									>
										<Stack spacing={4}>
											<SortableContext
												items={stateWishes}
												strategy={verticalListSortingStrategy}
											>
												<>
													{/* We need components that use the useSortable hook */}
													{stateWishes.map((wish) => {
														return (
															<PlanWishComponent
																key={wish.id}
																wish={addTimeLeftAndPercentage(
																	plan?.plan ?? undefined,
																	wish,
																)}
																currency={currency ?? ''}
																onPlacementChange={handlePlacementChange}
																onDelete={onWishDelete}
																onEdit={onEdit}
															/>
														);
													})}
												</>
											</SortableContext>
										</Stack>
									</DndContext>
								</>
							}
						/>
					</Flex>
				</Stack>
			</Container>
		</Content>
	);

	function handlePlacementChange(
		wishId: string,
		newIndex: number,
		oldIndex: number,
	) {
		relocateWish
			.mutateAsync({
				planId,
				wishId: wishId,
				oldIndex: newIndex,
				newIndex: oldIndex,
			})
			.then(async () => {
				await refetchPlan();
				await refetchCurrency();
				toast({
					title: 'Wish moved from ' + oldIndex + ' to ' + newIndex + '.',
					description: 'Your wish has been moved',
					status: 'success',
					duration: 2000,
					isClosable: true,
					position: 'top',
				});
			});
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		if (over === null) {
			return;
		}

		if (active.id !== over.id) {
			setWishes((items) => {
				if (items === undefined) {
					return [];
				}

				const oldWish = items.find((e) => e.id === over.id);
				const newWish = items.find((e) => e.id === active.id);

				relocateWish
					.mutateAsync({
						planId,
						wishId: active.id.toString(),
						oldIndex: newWish?.placement ?? 0,
						newIndex: oldWish?.placement ?? 0,
					})
					.then(async () => {
						await refetchPlan();
						await refetchCurrency();
					});

				const activeIndex = items
					.map((e) => e.id)
					.indexOf(active.id.toString());
				const overIndex = items.map((e) => e.id).indexOf(over.id.toString());
				return arrayMove(items, activeIndex, overIndex);
			});
		}
	}

	function addTimeLeftAndPercentage(
		plan: Plan | undefined,
		wish: PlanWishType,
	): SortablePlanWishType {
		if (plan === undefined) {
			return {
				...wish,
				timeLeft: {
					text: '',
					isPurchaseable: false,
				},
				percentage: 0,
			};
		}

		const percentage = calculatePercentage(plan, wish);
		const intervalsLeft = calculateIntervalsLeft(plan, wish);
		const timeLeftText = intervalsLeftText(plan, intervalsLeft);

		const timeLeft = {
			text: timeLeftText,
			isPurchaseable: wish.sumOfMoney - plan.currentAmountSaved <= 0,
		};

		return {
			...wish,
			timeLeft,
			percentage,
		};
	}

	function calculatePercentage(plan: Plan | undefined, wish: PlanWishType) {
		if (plan === undefined) {
			return 0;
		}

		const percentage = (plan.currentAmountSaved / wish.sumOfMoney) * 100;

		return percentage;
	}

	function calculateIntervalsLeft(plan: Plan | undefined, wish: PlanWishType) {
		if (plan === undefined) {
			return 0;
		}

		const remainingPrice = wish.sumOfMoney - plan.currentAmountSaved;

		const intervalsLeft = remainingPrice / plan.amountToSave;

		return Math.ceil(intervalsLeft);
	}

	function intervalsLeftText(plan: Plan, intervalsLeft: number) {
		if (intervalsLeft <= 0) {
			return 'You can buy this now!';
		}

		const frequency = plan.frequency.toLowerCase();
		const firstSavingDate = plan.firstSaving;

		// calculate next saving date based on the frequency
		const nextSavingDate = calculateNextSavingDate(
			intervalsLeft,
			frequency,
			firstSavingDate,
		);

		const today = new Date();
		const m1 = moment(today);
		const m2 = moment(nextSavingDate);
		const timeLeftText = moment.duration(m1.diff(m2)).humanize();

		return `${timeLeftText} left`;
	}

	function calculateNextSavingDate(
		intervalsLeft: number,
		frequency: string,
		firstSavingDate: Date,
	) {
		const today = new Date();
		const firstSaving = new Date(firstSavingDate);
		const daysSinceFirstSaving = Math.floor(
			(today.getTime() - firstSaving.getTime()) / (1000 * 60 * 60 * 24),
		);

		switch (frequency) {
			case 'som':
				return new Date(
					today.getFullYear(),
					today.getMonth() + 1 * intervalsLeft,
					1,
				);
			case 'eom':
				const correctMultiplyer = intervalsLeft === 1 ? 0 : 1;
				return new Date(
					today.getFullYear(),
					today.getMonth() + correctMultiplyer * intervalsLeft,
					0,
				);

			case 'ed':
				return new Date(
					today.getFullYear(),
					today.getMonth(),
					today.getDate() + 1 * intervalsLeft,
				);
			case 'ew':
				const daysSinceLastWeeklySaving = daysSinceFirstSaving % 7;
				const daysUntilNextWeeklySaving = 7 - daysSinceLastWeeklySaving;
				return new Date(
					today.getFullYear(),
					today.getMonth(),
					today.getDate() + daysUntilNextWeeklySaving * intervalsLeft,
				);
			case 'e14d':
				const daysSinceLast14DaySaving = daysSinceFirstSaving % 14;
				const daysUntilNext14DaySaving = 14 - daysSinceLast14DaySaving;
				return new Date(
					today.getFullYear(),
					today.getMonth(),
					today.getDate() + daysUntilNext14DaySaving * intervalsLeft,
				);
			default:
				return new Date(today.getFullYear(), today.getMonth(), today.getDate());
		}
	}
};
