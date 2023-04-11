import {
  Center,
  Container,
  Flex,
  FormErrorMessage,
  Heading,
  Tag,
} from "@chakra-ui/react";
import { EmptyStateWrapper } from "@components/EmptyStateWrapper";
import { Content } from "@components/layouts/Content";
import { trpc } from "@utils/trpc";
import { GenericListModal } from "../../common/Modal/GenericListModal";
import { WishListsList } from "./WishListsList";

export type WishListForm = {
  name: string;
  description: string;
};

export const DashboardScreen = () => {
  const {
    data: wishLists,
    isLoading,
    refetch: refetchWishLists,
  } = trpc.wishList.getAll.useQuery();

  const createWishList = trpc.wishList.create.useMutation();

  const onSubmit = async (name: string, description: string) => {
    await createWishList.mutateAsync({
      name: name,
      description: description,
    });
    await refetchWishLists();
  };

  return (
    <>
      <Content>
        <Container maxW="container.xl">
          <Center h="100px" mb={6} mt={4}>
            <Flex direction="column" gap={4}>
              <Heading>Wish Lists</Heading>
              <GenericListModal
                buttonProps={{
                  variant: "solid",
                  colorScheme: "green",
                }}
                buttonName="Create a new Wish List"
                labels={{
                  name: "Name",
                  description: "Description",
                }}
                placeholders={{
                  name: "Name of the Wish List",
                  description: "Description of the Wish List",
                }}
                onSubmit={onSubmit}
              />
            </Flex>
          </Center>
          {/* TODO: replace with skeleton setup in future */}
          <EmptyStateWrapper
            isLoading={isLoading}
            data={wishLists}
            EmptyComponent={
              <Center>
                <Tag size={"lg"} variant="solid" colorScheme="teal">
                  No Wish Lists
                </Tag>
              </Center>
            }
            NonEmptyComponent={
              <WishListsList
                refreshListFunc={refetchWishLists}
                wishLists={wishLists ?? []}
              />
            }
          />
          <FormErrorMessage>Description is required.</FormErrorMessage>
        </Container>
      </Content>
    </>
  );
};
