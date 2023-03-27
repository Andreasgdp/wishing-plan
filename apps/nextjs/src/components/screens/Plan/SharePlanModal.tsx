import { AddIcon, AtSignIcon } from '@chakra-ui/icons';
import type { ButtonProps } from '@chakra-ui/react';
import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputLeftElement,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Tag,
	TagCloseButton,
	TagLabel,
	useDisclosure,
} from '@chakra-ui/react';
import { User } from "@clerk/nextjs/dist/api";
import { isNull } from 'lodash';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export type SharedPlanForm = {
	email: string;
};

type SharePlanModalProps = {
	sharedWith: User[];
	buttonName: string;
	buttonProps: ButtonProps;
	onSubmit: (emails: string[]) => void;
};

export const SharePlanModal = (props: SharePlanModalProps) => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const { register, handleSubmit, reset } = useForm<SharedPlanForm>();

	const [sharedWithEmails, setSharedWithEmails] = useState<string[]>([]);

	useEffect(() => {
		const emails = props.sharedWith
			.map((user) => user.primaryEmailAddressId)
			.filter((email) => !isNull(email)) as string[];

		setSharedWithEmails(emails);
	}, [props.sharedWith]);

	const addEmail = handleSubmit(async (data) => {
		if (!sharedWithEmails.includes(data.email)) {
			setSharedWithEmails([...sharedWithEmails, data.email]);
		}

		reset();
	});

	function onSubmit() {
		props.onSubmit(sharedWithEmails);
		onClose();
	}

	const openModal = () => {
		onOpen();
	};
	function removeEmail(email: string) {
		setSharedWithEmails(sharedWithEmails.filter((e) => e !== email));
	}

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
						<form id="new-note" onSubmit={addEmail}>
							{sharedWithEmails.map((email) => (
								<UserTag key={email} email={email} removeEmail={removeEmail} />
							))}
							<FormControl isRequired>
								<FormLabel>Share with</FormLabel>
								<Flex>
									<InputGroup>
										<InputLeftElement pointerEvents="none">
											<AtSignIcon color="gray.300" />
										</InputLeftElement>
										<Input
											id="email"
											type="email"
											placeholder="Name of WishList"
											{...register('email', {
												required: true,
											})}
										/>
									</InputGroup>
									<Button
										ml={2}
										type="submit"
										form="new-note"
										rightIcon={<AddIcon />}
										colorScheme="green"
									>
										Add
									</Button>
								</Flex>
							</FormControl>
						</form>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="blue" onClick={onSubmit}>
							Done
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

const UserTag = (props: {
	email: string;
	removeEmail: (email: string) => void;
}) => {
	function onRemove() {
		props.removeEmail(props.email);
	}

	return (
		<Tag size="lg" colorScheme="red" borderRadius="full">
			<TagLabel>{props.email}</TagLabel>
			<TagCloseButton onClick={onRemove} />
		</Tag>
	);
};
