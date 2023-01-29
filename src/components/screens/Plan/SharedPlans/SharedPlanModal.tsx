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
import type { Plan } from '@prisma/client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export type SharedPlanForm = {
	name: string;
	description: string;
};

type SharedPlanModalProps = {
	buttonName: string;
	buttonProps: ButtonProps;
	onSubmit: (name: string, description: string) => void;
};

export const SharedPlanModal = (props: SharedPlanModalProps) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const { register, handleSubmit, reset, setValue } = useForm<SharedPlanForm>();

	const [descriptionValue, setDescriptionValue] = useState('');

	const onSubmit = handleSubmit(async (data) => {
		props.onSubmit(data.name, descriptionValue);
		reset();
		setDescriptionValue('');
		onClose();
	});

	const openModal = () => {
		
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
								<FormLabel>Name of WishList</FormLabel>
								<Input
									id="name"
									type="text"
									placeholder="Name of WishList"
									{...register('name', {
										required: true,
									})}
								/>
							</FormControl>
							<FormControl>
								<FormLabel>Describe your WishList</FormLabel>
								<Textarea
									value={descriptionValue}
									onChange={handleDescriptionChange}
									placeholder="Here is a sample placeholder"
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
