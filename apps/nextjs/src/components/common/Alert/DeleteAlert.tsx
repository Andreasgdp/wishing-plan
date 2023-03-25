import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogOverlay,
	Button,
	useDisclosure,
} from '@chakra-ui/react';
import { useRef } from 'react';

type DeleteAlertProps = {
	typeToDelete: string;
	entityName: string;
	onDelete: () => void;
};

export const DeleteAlert = (props: DeleteAlertProps) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef<HTMLButtonElement>(null);

	// onDeletePressed
	const onDeletePressed = () => {
		props.onDelete();
		onClose();
	};

	return (
		<>
			<Button variant={'ghost'} colorScheme="red" onClick={onOpen}>
				Delete {props.typeToDelete}
			</Button>

			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={onClose}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							Delete {props.entityName}
						</AlertDialogHeader>

						<AlertDialogBody>
							Are you sure you want to delete {props.typeToDelete} &quot;
							{props.entityName}&quot;?
						</AlertDialogBody>

						<AlertDialogFooter>
							<Button ref={cancelRef} onClick={onClose}>
								Cancel
							</Button>
							<Button colorScheme="red" onClick={onDeletePressed} ml={3}>
								Delete
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};
