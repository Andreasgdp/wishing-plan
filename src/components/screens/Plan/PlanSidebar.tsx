import {
	Avatar,
	AvatarGroup,
	Button,
	Center,
	Input,
	InputGroup,
	InputRightAddon,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Select,
	Stack,
	Text,
	Tooltip,
	useColorModeValue,
} from '@chakra-ui/react';
import type { Plan, User } from '@prisma/client';
import { trpc } from '@utils/trpc';
import { useSession } from 'next-auth/react';
import type { ChangeEvent } from 'react';
import React, { useEffect, useState } from 'react';
import { SharePlanModal } from './SharePlanModal';

type PlanSidebarProps = {
	plan?: Plan;
	sharedWith: User[];
	owner?: User;
	currency?: string;
	onPlanSettingsChange: (
		amountToSave: number,
		currentAmountSaved: number,
		firstSaving: Date,
		frequency: string,
	) => void;
};

export const PlanSidebar = (props: PlanSidebarProps) => {
	const { data: sessionData } = useSession();

	const sharePlan = trpc.plan.sharePlan.useMutation();

	const categoryColor = useColorModeValue('gray.800', 'gray.200');

	const [savedAmount, setSavedAmount] = useState('0');
	const handleSavedAmountChange = (value: string) =>
		setSavedAmount(value.replace(/(?!^)-/, ''));

	const [amountToSave, setAmountToSave] = useState('0');
	const handleAmountToSaveChange = (value: string) =>
		setAmountToSave(value.replace('-', ''));

	const [firstSaving, setFirstSaving] = useState(new Date());
	const handleFirstSavingChange = (event: ChangeEvent<HTMLInputElement>) =>
		setFirstSaving(new Date(event.target.value));

	const [frequency, setFrequency] = useState('som');
	const handleFrequencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setFrequency(event.target.value);
	};

	useEffect(() => {
		setSavedAmount(props.plan?.currentAmountSaved.toString() ?? '0');
	}, [props.plan?.currentAmountSaved]);

	useEffect(() => {
		setAmountToSave(props.plan?.amountToSave.toString() ?? '0');
	}, [props.plan?.amountToSave]);

	useEffect(() => {
		setFirstSaving(props.plan?.firstSaving ?? new Date());
	}, [props.plan?.firstSaving]);

	useEffect(() => {
		setFrequency(props.plan?.frequency ?? 'som');
	}, [props.plan?.frequency]);

	const submitPlanSettingsChange = (e: React.SyntheticEvent) => {
		e.preventDefault();
		if (
			amountToSave !== props.plan?.amountToSave.toString() ||
			savedAmount !== props.plan?.currentAmountSaved.toString() ||
			firstSaving !== props.plan?.firstSaving ||
			frequency !== props.plan?.frequency
		) {
			props.onPlanSettingsChange(
				Number(amountToSave),
				Number(savedAmount),
				firstSaving,
				frequency,
			);
		}
	};

	function handleSharePlan(emails: string[]): void {
		sharePlan.mutateAsync({
			planId: props.plan?.id,
			emails: emails,
		});
	}

	return (
		<Stack
			as={'nav'}
			spacing={6}
			maxW={{ md: '3xs' }}
			w={'full'}
			flexShrink={0}
			display={{ base: 'none', lg: 'block' }}
		>
			<form onSubmit={submitPlanSettingsChange}>
				<Stack>
					<Button type="submit" colorScheme={'purple'}>
						Update
					</Button>
					<Text
						align={'center'}
						textTransform={'uppercase'}
						color={categoryColor}
						fontWeight={700}
						fontSize={'sm'}
						letterSpacing={1}
						pt={0.5}
					>
						Amount Saved
					</Text>
					<Tooltip hasArrow label="Amount saved in total" placement="auto">
						<InputGroup>
							<NumberInput
								allowMouseWheel
								defaultValue={props.plan?.currentAmountSaved}
								value={savedAmount.toString()}
								onChange={handleSavedAmountChange}
							>
								<NumberInputField />
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
							<InputRightAddon>{props.currency}</InputRightAddon>
						</InputGroup>
					</Tooltip>

					<Text
						align={'center'}
						textTransform={'uppercase'}
						color={categoryColor}
						fontWeight={700}
						fontSize={'sm'}
						letterSpacing={1}
					>
						Amount to Save
					</Text>

					<Tooltip
						hasArrow
						label="Amount add to current savings based on savings frequency"
						placement="auto"
					>
						<InputGroup>
							<NumberInput
								allowMouseWheel
								defaultValue={props.plan?.amountToSave}
								min={0}
								value={amountToSave}
								onChange={handleAmountToSaveChange}
							>
								<NumberInputField />
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
							<InputRightAddon>{props.currency}</InputRightAddon>
						</InputGroup>
					</Tooltip>
					<Text
						align={'center'}
						textTransform={'uppercase'}
						color={categoryColor}
						fontWeight={500}
						fontSize={'sm'}
						letterSpacing={1}
					>
						Savings Frequency
					</Text>
					<Tooltip
						hasArrow
						label="Frequency of current amount saved updated based on Savings Amount"
						placement="auto"
					>
						<Select value={frequency} onChange={handleFrequencyChange}>
							<option value="som">Start of month</option>
							<option value="eom">End of month</option>
							<option value="ed">Every day</option>
							<option value="ew">Every week</option>
							<option value="e14d">Every 14th day</option>
						</Select>
					</Tooltip>
					{frequency !== 'som' && frequency !== 'eom' && (
						<>
							<Text
								align={'center'}
								textTransform={'uppercase'}
								color={categoryColor}
								fontWeight={500}
								fontSize={'sm'}
								letterSpacing={1}
							>
								First Saving
							</Text>
							<Tooltip hasArrow label="Date of first saving" placement="auto">
								<Input
									size="md"
									type="date"
									value={firstSaving.toISOString().split('T')[0]}
									onChange={handleFirstSavingChange}
								/>
							</Tooltip>
						</>
					)}
					{props.sharedWith.length > 0 && (
						<Text
							align={'center'}
							textTransform={'uppercase'}
							color={categoryColor}
							fontWeight={700}
							fontSize={'sm'}
							letterSpacing={1}
							pt={0.5}
						>
							Shared with
						</Text>
					)}
					<Center>
						<AvatarGroup size="md" max={5}>
							{sessionData?.user?.id !== props.owner?.id && (
								<Avatar
									name={props.owner?.name ?? ''}
									src={props.owner?.image ?? ''}
								/>
							)}
							{props.sharedWith.map((user) => (
								<Avatar
									key={user.id}
									name={user.name ?? ''}
									src={user.image ?? ''}
								/>
							))}
						</AvatarGroup>
					</Center>
					{sessionData?.user?.id === props.owner?.id && (
						<SharePlanModal
							sharedWith={props.sharedWith}
							buttonName="Share Plan"
							buttonProps={{
								colorScheme: 'purple',
								variant: 'outline',
							}}
							onSubmit={handleSharePlan}
						></SharePlanModal>
					)}
				</Stack>
			</form>
		</Stack>
	);
};
