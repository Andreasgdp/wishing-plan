import {
	DeleteIcon,
	DragHandleIcon,
	EditIcon,
	ExternalLinkIcon,
	HamburgerIcon,
} from '@chakra-ui/icons';
import {
	Box,
	Button,
	Card,
	CardBody,
	Center,
	Flex,
	FormControl,
	FormLabel,
	Grid,
	Heading,
	IconButton,
	Image,
	Input,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Progress,
	Tag,
	Text,
	Textarea,
	useColorModeValue,
	useDisclosure,
} from '@chakra-ui/react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { PlanWishType } from '@server/trpc/router/Plan/plan';
import { trpc } from '@utils/trpc';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export interface SortablePlanWishType extends PlanWishType {
	timeLeft: {
		text: string;
		isPurchaseable: boolean;
	};
	percentage: number;
}

type SortableItemProps = {
	wish: SortablePlanWishType;
	currency: string;
	onPlacementChange: (
		wishId: string,
		oldIndex: number,
		newIndex: number,
	) => void;
	onDelete: (id: string, index: number) => void;
	onEdit: (
		wishId: string,
		title: string,
		description: string,
		url: string,
		imageUrl: string,
		price: number,
		placement: number,
	) => void;
};

export type WishPlanForm = {
	title: string;
	description?: string;
	price: string;
	url: string;
	imageUrl: string;
};

const variants = {
	hidden: { opacity: 0, x: 0, y: 20 },
	enter: { opacity: 1, x: 0, y: 0 },
	exit: { opacity: 0, x: 0, y: 20 },
};

export function PlanWishComponent(props: SortableItemProps) {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const { register, handleSubmit, reset, getValues, setValue } =
		useForm<WishPlanForm>();

	const [priceValue, setPriceValue] = useState('0');
	const [descriptionValue, setDescriptionValue] = useState('');

	const scrapeProduct = trpc.scraping.get.useMutation();

	const onGetProductData = async () => {
		const values = getValues();
		const url = values.url;

		if (!url) return;

		const scrapingData = await scrapeProduct.mutateAsync({
			url: url,
		});
		if (!scrapingData) return;

		setValue('title', scrapingData.title);
		setPriceValue(scrapingData.price.toString());
		setValue('imageUrl', scrapingData.imageUrl ?? '');
	};

	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: props.wish.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const [placement, setPlacement] = useState(1);
	const handlePlacementChange = (value: string) => {
		setPlacement(Number(value));
	};

	useEffect(() => {
		setPlacement(props.wish.placement);
	}, [props.wish.placement]);

	const tagColorScheme = props.wish.timeLeft.isPurchaseable
		? 'green'
		: 'purple';

	const submitPlacementChange = () => {
		if (placement === props.wish.placement) {
			return;
		}

		if (placement < 1) {
			return;
		}

		// if placement not a number
		if (isNaN(placement)) {
			return;
		}
		props.onPlacementChange(props.wish.id, props.wish.placement, placement);
	};

	const onSubmit = handleSubmit(async (data) => {
		props.onEdit(
			props.wish.id,
			data.title,
			descriptionValue,
			data.url,
			data.imageUrl,
			Number(priceValue),
			props.wish.placement,
		);
		reset();
		setDescriptionValue('');
		setPriceValue('0');
		onClose();
	});

	const openModal = () => {
		setValue('title', props.wish.title);
		setDescriptionValue(props.wish.description ?? '');
		setValue('url', props.wish.url);
		setValue('imageUrl', props.wish.imageUrl ?? '');
		setPriceValue(props.wish.price.toString());
		onOpen();
	};

	const handleDescriptionChange = (
		e: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		setDescriptionValue(e.target.value);
	};

	return (
		<motion.article
			initial="hidden"
			animate="enter"
			variants={variants}
			transition={{
				duration: 0.1 * props.wish.placement,
				type: 'easeInOut',
			}}
			style={{ position: 'relative' }}
		>
			<div style={style}>
				<Card
					direction={'row'}
					background={useColorModeValue('gray.100', 'gray.700')}
				>
					<Center ml={2}>
						<NumberInput
							defaultValue={props.wish.placement}
							value={placement}
							onChange={handlePlacementChange}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									submitPlacementChange();
								}
							}}
							onBlur={submitPlacementChange}
							onFocus={(e) => e.target.select()}
							w={{ base: '65px', sm: '85px' }}
							p={0}
							m={0}
							min={1}
						>
							<NumberInputField />
							<NumberInputStepper>
								<NumberDecrementStepper transform={'scaleY(-1)'} />
								<NumberIncrementStepper transform={'scaleY(-1)'} />
							</NumberInputStepper>
						</NumberInput>
					</Center>

					<CardBody
						pr={2}
						p={{ base: '0.5rem', sm: '0.5rem' }}
						maxW={{
							base: 'calc(100% - 8.2rem)',
							sm: 'calc(100% - 9.5rem)',
						}}
						marginTop={{ base: 'auto', sm: '0' }}
						marginBottom={{ base: 'auto', sm: '0' }}
						alignItems="center"
					>
						<Flex>
							<Image
								boxSize={{ base: '2.5rem', md: '100px' }}
								borderRadius={'lg'}
								objectFit="cover"
								src={props.wish.imageUrl ?? '/images/placeholderWish.png'}
								alt="Wish image"
								mr={2}
								mt={-0.1}
								display={{
									base: 'none',
									md: 'block',
								}}
							/>
							<Box
								flex="1"
								gap="2"
								alignItems="center"
								w={'70%'}
								margin={{ base: 'auto', sm: '0' }}
							>
								<Tag
									colorScheme={tagColorScheme}
									size={'lg'}
									textAlign="center"
									fontSize={{ base: 'xs', sm: 'sm' }}
								>
									{props.wish.timeLeft.text}
								</Tag>
								<Heading
									fontSize={{
										base: 'sm',
										sm: 'lg',
										md: 'xl',
									}}
									overflowX={'hidden'}
									textOverflow={'ellipsis'}
									whiteSpace={'nowrap'}
									maxW={'80%'}
								>
									{props.wish.title}{' '}
								</Heading>
								<Text
									align={'left'}
									color={useColorModeValue('gray.800', 'gray.200')}
									fontWeight={500}
									fontSize={'lg'}
									letterSpacing={1}
									maxW={'65%'}
									overflowX={'hidden'}
									textOverflow={'ellipsis'}
									whiteSpace={'nowrap'}
									mb={-7}
									display={{ base: 'none', sm: 'block' }}
								>
									{props.wish.description !== ''
										? props.wish.description
										: 'Empty Description'}
								</Text>
								<Text
									align={'right'}
									textTransform={'uppercase'}
									color={useColorModeValue('gray.800', 'gray.200')}
									fontWeight={700}
									fontSize={'lg'}
									letterSpacing={1}
									display={{ base: 'none', sm: 'block' }}
								>
									{props.wish.price} {props.currency}
								</Text>
							</Box>
						</Flex>
						<Progress
							sx={{
								'& > div:first-child': {
									transitionProperty: 'width',
								},
							}}
							mt={2}
							colorScheme={'purple'}
							value={props.wish.percentage}
							display={{ base: 'none', sm: 'block' }}
						/>
					</CardBody>

					<Grid m={2} alignContent="center">
						<Menu>
							<MenuButton
								as={IconButton}
								aria-label="Options"
								icon={<HamburgerIcon />}
								variant="outline"
								colorScheme="blue"
								mb={{ base: '2', sm: '6', md: '2' }}
							/>
							<MenuList>
								<MenuItem icon={<EditIcon />} command="⌘E" onClick={openModal}>
									Edit
								</MenuItem>
								<MenuItem
									icon={<DeleteIcon />}
									command="⌘D"
									onClick={() =>
										props.onDelete(props.wish.id, props.wish.placement)
									}
								>
									Delete
								</MenuItem>
							</MenuList>
						</Menu>
						<IconButton
							ref={setNodeRef}
							{...listeners}
							{...attributes}
							aria-label="Drag to reorder"
							display={{ base: 'none', md: 'inline-flex' }}
							icon={<DragHandleIcon />}
							mb={{ md: '2' }}
						/>
						<IconButton
							onClick={(e) => {
								e.preventDefault();
								window.open(props.wish.url, '_blank');
							}}
							aria-label="Drag to reorder"
							icon={<ExternalLinkIcon />}
							colorScheme="purple"
							disabled={props.wish.url === ''}
						/>
					</Grid>
				</Card>
				<Modal
					isOpen={isOpen}
					onClose={onClose}
					size={{ base: 'xs', md: 'xl' }}
				>
					<ModalOverlay />

					<ModalContent>
						<ModalHeader>
							<ModalCloseButton />
						</ModalHeader>

						<ModalBody>
							<form id="new-note" onSubmit={onSubmit}>
								<FormControl>
									<FormLabel>URL for Wish</FormLabel>
									<Input id="url" type="url" {...register('url')} />
								</FormControl>
								<FormControl>
									<Center mt={6} mb={2}>
										<Button onClick={onGetProductData}>
											Get Data From URL
										</Button>
									</Center>
								</FormControl>
								<FormControl>
									<FormLabel>URL for Image</FormLabel>
									<Input id="imageUrl" type="url" {...register('imageUrl')} />
								</FormControl>
								<FormControl isRequired>
									<FormLabel>Name of Wish</FormLabel>
									<Input id="title" type="text" {...register('title')} />
								</FormControl>
								<FormControl isRequired>
									<FormLabel>Price of your Wish</FormLabel>

									<NumberInput
										id="price"
										{...register('price')}
										onChange={(valueString) => setPriceValue(valueString)}
										value={priceValue}
										max={100000000}
										min={0}
									>
										<NumberInputField />
										<NumberInputStepper>
											<NumberIncrementStepper />
											<NumberDecrementStepper />
										</NumberInputStepper>
									</NumberInput>
								</FormControl>
								<FormControl>
									<FormLabel>Describe your Wish</FormLabel>
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
			</div>
		</motion.article>
	);
}
