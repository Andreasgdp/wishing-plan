import React, { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import {
	Button,
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
import type { Plan } from '@prisma/client';

type PlanSidebarProps = {
	plan?: Plan;
	currency?: string;
	onPlanSettingsChange: (
		amountToSave: number,
		currentAmountSaved: number,
		firstSaving: Date,
		frequency: string
	) => void;
};

export const PlanSidebar = (props: PlanSidebarProps) => {
	const categoryColor = useColorModeValue('gray.800', 'gray.200');

	const [savedAmount, setSavedAmount] = useState(0);
	const handleSavedAmountChange = (value: string) =>
		setSavedAmount(Number(value));

	const [amountToSave, setAmountToSave] = useState(0);
	const handleAmountToSaveChange = (value: string) =>
		setAmountToSave(Number(value));

	const [firstSaving, setFirstSaving] = useState(new Date());
	const handleFirstSavingChange = (event: ChangeEvent<HTMLInputElement>) =>
		setFirstSaving(new Date(event.target.value));

	const [frequency, setFrequency] = useState('som');
	const handleFrequencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
		setFrequency(event.target.value);
	};

	useEffect(() => {
		setSavedAmount(props.plan?.currentAmountSaved ?? 0);
	}, [props.plan?.currentAmountSaved]);

	useEffect(() => {
		setAmountToSave(props.plan?.amountToSave ?? 0);
	}, [props.plan?.amountToSave]);

	useEffect(() => {
		setFirstSaving(props.plan?.firstSaving ?? new Date());
	}, [props.plan?.firstSaving]);

	useEffect(() => {
		setFrequency(props.plan?.frequency ?? 'som');
	}, [props.plan?.frequency]);

	const submitPlanSettingsChange = (e: React.SyntheticEvent) => {
		e.preventDefault();
		console.log('submitPlanSettingsChange');
		if (
			amountToSave !== props.plan?.amountToSave ||
			savedAmount !== props.plan?.currentAmountSaved ||
			firstSaving !== props.plan?.firstSaving ||
			frequency !== props.plan?.frequency
		) {
			props.onPlanSettingsChange(
				amountToSave,
				savedAmount,
				firstSaving,
				frequency
			);
		}
	};

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
					<Tooltip
						hasArrow
						label="Amount saved in total"
						placement="auto"
					>
						<InputGroup>
							<NumberInput
								allowMouseWheel
								defaultValue={props.plan?.currentAmountSaved}
								value={savedAmount}
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
						<Select
							value={frequency}
							onChange={handleFrequencyChange}
						>
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
							<Tooltip
								hasArrow
								label="Date of first saving"
								placement="auto"
							>
								<Input
									size="md"
									type="date"
									value={
										firstSaving.toISOString().split('T')[0]
									}
									onChange={handleFirstSavingChange}
								/>
							</Tooltip>
						</>
					)}
				</Stack>
			</form>
		</Stack>
	);
};
