import type { ButtonProps } from '@chakra-ui/react';
import {
	Button,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Textarea,
	useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export type SharedPlanForm = {
	name: string;
	description: string;
};

type SharedPlanModalProps = {
	buttonName: string;
	buttonProps: ButtonProps;
	labels?: {
		name?: string;
		description?: string;
	};
	placeholders?: {
		name?: string;
		description?: string;
	};
	onSubmit: (name: string, description: string) => void;
	existingSharedItem?: {
		name: string;
		description: string;
	};
};

export const GenericListModal = (props: SharedPlanModalProps) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const { register, handleSubmit, reset, setValue } = useForm<SharedPlanForm>();

	const [descriptionValue, setDescriptionValue] = useState('');

	const labels = {
		name: 'Name of Item',
		description: 'Describe your Item',
		...props.labels,
	};

	const placeholders = {
		name: 'Name of Item',
		description: 'Describe your Item',
		...props.placeholders,
	};

	const onSubmit = handleSubmit(async (data) => {
		props.onSubmit(data.name, descriptionValue);
		reset();
		setDescriptionValue('');
		onClose();
	});

	const openModal = () => {
		if (props.existingSharedItem) {
			setValue('name', props.existingSharedItem.name ?? '');
			setDescriptionValue(props.existingSharedItem.description ?? '');
		}
		onOpen();
	};

	const handleDescriptionChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		setDescriptionValue(e.target.value);
	};

	return (
		<>
			<Button {...props.buttonProps} onClick={openModal}>
				{props.buttonName}
			</Button>
			<Modal isOpen={isOpen} onClose={onClose} size={{ base: 'xs', md: 'xl' }}>
				<ModalOverlay />

				<ModalContent>
					<ModalHeader>
						<ModalCloseButton />
					</ModalHeader>

					<ModalBody>
						<form id="new-note" onSubmit={onSubmit}>
							<FormControl isRequired>
								<FormLabel>{labels.name}</FormLabel>
								<Input
									id="name"
									type="text"
									placeholder={placeholders.name}
									{...register('name', {
										required: true,
									})}
								/>
							</FormControl>
							<FormControl>
								<FormLabel>{labels.description}</FormLabel>
								<Textarea
									value={descriptionValue}
									onChange={handleDescriptionChange}
									placeholder={placeholders.description}
									size="sm"
								/>
							</FormControl>
						</form>
					</ModalBody>

					<ModalFooter>
						<Button type="submit" form="new-note">
							Submit
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
