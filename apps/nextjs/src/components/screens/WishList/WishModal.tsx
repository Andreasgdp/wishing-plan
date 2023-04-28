import { InfoOutlineIcon, LinkIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonProps,
  Center,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  MenuItem,
  MenuItemProps,
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
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import type { Wish } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { useState } from "react";
import { useForm } from "react-hook-form";

export type WishForm = {
  title: string;
  description?: string;
  price: string;
  url: string;
  imageUrl: string;
};

type WishModalProps = {
  buttonName: string;
  buttonProps?: ButtonProps;
  onSubmit: (
    title: string,
    description: string,
    url: string,
    imageUrl: string,
    price: number,
  ) => void;
  existingWish?: Wish;
  menuConfig?: MenuItemProps;
};

export const WishModal = (props: WishModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { register, handleSubmit, reset, getValues, setValue } =
    useForm<WishForm>();

  const [priceValue, setPriceValue] = useState("0");
  const [descriptionValue, setDescriptionValue] = useState("");

  const scrapeProduct = trpc.scraping.get.useMutation();

  const onGetProductData = async () => {
    const values = getValues();
    const url = values.url;

    if (!url) return;

    const scrapingData = await scrapeProduct.mutateAsync({
      url: url,
    });
    if (!scrapingData) return;

    setValue("title", scrapingData.title);
    setPriceValue(scrapingData.price.toString());
    setValue("imageUrl", scrapingData.imageUrl ?? "");
  };

  const onSubmit = handleSubmit(async (data) => {
    props.onSubmit(
      data.title,
      descriptionValue,
      data.url,
      data.imageUrl,
      Number(priceValue),
    );
    reset();
    setDescriptionValue("");
    setPriceValue("0");
    onClose();
  });

  const openModal = () => {
    if (props.existingWish) {
      setValue("title", props.existingWish.title);
      setDescriptionValue(props.existingWish.description ?? "");
      setValue("url", props.existingWish.url);
      setValue("imageUrl", props.existingWish.imageUrl ?? "");
      setPriceValue(props.existingWish.price.toString());
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
      {props.menuConfig ? (
        <MenuItem {...props.menuConfig} onClick={openModal}>
          {props.buttonName}
        </MenuItem>
      ) : (
        <Button {...props.buttonProps} onClick={openModal}>
          {props.buttonName}
        </Button>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size={{ base: "xs", md: "xl" }}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>
            <ModalCloseButton />
          </ModalHeader>

          <ModalBody>
            <form id="new-note" onSubmit={onSubmit}>
              <FormControl>
                <FormLabel>URL for Wish</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <LinkIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://www.amazon.com/..."
                    {...register("url")}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <Center mt={6} mb={2}>
                  <Button onClick={onGetProductData}>Get Data From URL</Button>
                </Center>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Name of Wish</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <InfoOutlineIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Name of Wish"
                    {...register("title")}
                  />
                </InputGroup>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Price of your Wish</FormLabel>

                <NumberInput
                  id="price"
                  {...register("price")}
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
                <FormLabel>URL for Image</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <LinkIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    id="imageUrl"
                    type="url"
                    placeholder="https://website.com/image.jpg"
                    {...register("imageUrl")}
                  />
                </InputGroup>
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
    </>
  );
};
