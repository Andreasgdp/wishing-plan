import { DeleteIcon, EditIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  Divider,
  Heading,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { EmptyStateWrapper } from "@components/EmptyStateWrapper";
import { DeleteAlert } from "@components/common/Alert/DeleteAlert";
import type { Wish } from "@prisma/client";
import { trpc } from "@utils/trpc";
import { motion } from "framer-motion";
import { WishModal } from "./WishModal";

const variants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  enter: { opacity: 1, x: 0, y: 0 },
};

export const WishCard = ({
  wish: wish,
  refreshListFunc,
  index: index,
}: {
  wish: Wish;
  refreshListFunc?: () => void;
  index: number;
}) => {
  const { data: settings, isLoading } = trpc.settings.get.useQuery();

  const deleteWish = trpc.wish.delete.useMutation();

  const onDelete = async () => {
    await deleteWish.mutateAsync({ id: wish.id });
    if (refreshListFunc) refreshListFunc();
  };

  const formatPriceForDisplay = (price: number) => {
    return price.toLocaleString("local", {
      style: "currency",
      currency: settings?.currency,
    });
  };

  const updateWish = trpc.wish.update.useMutation();

  const onSubmit = async (
    title: string,
    description: string,
    url: string,
    imageUrl: string,
    price: number,
  ) => {
    await updateWish.mutateAsync({
      id: wish.id,
      url: url,
      imageUrl: imageUrl,
      title: title,
      description: description,
      price: price,
      wishListId: wish.wishListId,
    });
    if (refreshListFunc) refreshListFunc();
  };

  return (
    <motion.article
      initial="hidden"
      animate="enter"
      variants={variants}
      transition={{
        duration: 0.05,
        delay: 0.05 * index,
        type: "easeInOut",
      }}
      style={{ position: "relative" }}
    >
      <Center>
        <EmptyStateWrapper
          isLoading={isLoading}
          data={settings}
          EmptyComponent={
            <Center>
              <Tag size={"lg"} variant="solid" colorScheme="teal">
                No Settings
              </Tag>
            </Center>
          }
          NonEmptyComponent={
            <Card
              maxW={"30rem"}
              background={useColorModeValue("gray.100", "gray.700")}
            >
              <CardBody>
                <Center>
                  <Image
                    src={wish.imageUrl ?? "/images/placeholderWish.png"}
                    alt={wish.title}
                    borderRadius="lg"
                  />
                </Center>
                <Stack mt="6" spacing="3">
                  <Heading size="md">{wish.title}</Heading>
                  <Text color="blue.600" fontSize="2xl">
                    {formatPriceForDisplay(wish.price)}
                  </Text>
                </Stack>
              </CardBody>
              <Divider />
              <CardFooter
                justify="space-between"
                flexWrap="wrap"
                sx={{
                  "& > button": {
                    minW: "2rem",
                  },
                }}
              >
                {wish.url && (
                  <Button
                    mr={4}
                    mb={4}
                    colorScheme="purple"
                    variant="solid"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(wish.url, "_blank");
                    }}
                  >
                    Open link
                  </Button>
                )}
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Options"
                    icon={<HamburgerIcon />}
                    variant="outline"
                    colorScheme="blue"
                    w={10}
                  />
                  <MenuList>
                    <WishModal
                      buttonName="Edit"
                      onSubmit={onSubmit}
                      existingWish={wish}
                      menuConfig={{
                        icon: <EditIcon />,
                        command: "⌘E",
                      }}
                    />
                    <DeleteAlert
                      typeToDelete="Wish"
                      entityName={wish.title}
                      onDelete={onDelete}
                      menuConfig={{
                        icon: <DeleteIcon />,
                        command: "⌘D",
                      }}
                    />
                  </MenuList>
                </Menu>
              </CardFooter>
            </Card>
          }
        />
      </Center>
    </motion.article>
  );
};
