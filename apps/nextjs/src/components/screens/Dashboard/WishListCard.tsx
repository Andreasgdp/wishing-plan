import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Center,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteAlert } from "@components/common/Alert/DeleteAlert";
import type { WishList } from "@prisma/client";
import { trpc } from "@utils/trpc";
import router from "next/router";
import { GenericListModal } from "../../common/Modal/GenericListModal";

export const WishListCard = ({
  wishList,
  refreshListFunc,
}: {
  wishList: WishList;
  refreshListFunc?: () => void;
}) => {
  const deleteWishList = trpc.wishList.delete.useMutation();

  const onDelete = async () => {
    await deleteWishList.mutateAsync({ id: wishList.id });
    if (refreshListFunc) refreshListFunc();
  };

  const editWishList = trpc.wishList.update.useMutation();

  const onSubmit = async (name: string, description: string) => {
    await editWishList.mutateAsync({
      id: wishList.id,
      name: name,
      description: description,
    });
    if (refreshListFunc) refreshListFunc();
  };

  return (
    <Center>
      <Card
        maxW={"30rem"}
        background={useColorModeValue("gray.100", "gray.700")}
      >
        <CardHeader>
          <Heading size="md"> {wishList.name}</Heading>
        </CardHeader>
        <CardBody>
          <Text>{wishList.description}</Text>
        </CardBody>
        <CardFooter
          justify="start"
          flexWrap="wrap"
          sx={{
            "& > button": {
              minW: "2rem",
            },
          }}
        >
          <Button
            mr={4}
            mb={4}
            colorScheme="purple"
            variant="solid"
            onClick={() => {
              router.push(`/wishlists/${wishList.id}`);
            }}
          >
            View here
          </Button>
          <GenericListModal
            buttonProps={{
              mr: 2,
              mb: 2,
              variant: "ghost",
              colorScheme: "purple",
            }}
            buttonName="Edit"
            onSubmit={onSubmit}
            labels={{
              name: "Name",
              description: "Description",
            }}
            placeholders={{
              name: "Name of the Wish List",
              description: "Description of the Wish List",
            }}
            existingSharedItem={{
              name: wishList.name ?? "",
              description: wishList.description ?? "",
            }}
          />

          <DeleteAlert
            typeToDelete="WishList"
            entityName={wishList.name}
            onDelete={onDelete}
          />
        </CardFooter>
      </Card>
    </Center>
  );
};
