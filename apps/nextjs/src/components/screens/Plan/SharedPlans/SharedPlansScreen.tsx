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
import { GenericListModal } from "../../../common/Modal/GenericListModal";
import { SharedPlansList } from "./SharedPlansList";

export type WishListForm = {
  name: string;
  description: string;
};

export const SharedPlansScreen = () => {
  const {
    data: plans,
    isLoading,
    refetch: refetchWishLists,
  } = trpc.plan.getAll.useQuery();

  const createPlan = trpc.plan.create.useMutation();

  const onSubmit = async (name: string, description: string) => {
    await createPlan.mutateAsync({
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
              <Heading>Shared Plans</Heading>
              <GenericListModal
                buttonProps={{
                  variant: "solid",
                  colorScheme: "green",
                }}
                buttonName="Create a New Plan"
                labels={{
                  name: "Name",
                  description: "Description",
                }}
                placeholders={{
                  name: "Name of the Plan",
                  description: "Description of the Plan",
                }}
                onSubmit={onSubmit}
              />
            </Flex>
          </Center>
          <EmptyStateWrapper
            isLoading={isLoading}
            data={plans}
            EmptyComponent={
              <Center>
                <Tag size={"lg"} variant="solid" colorScheme="teal">
                  No WishLists
                </Tag>
              </Center>
            }
            NonEmptyComponent={
              <SharedPlansList
                refreshListFunc={refetchWishLists}
                wishLists={plans ?? []}
              />
            }
          />
          <FormErrorMessage>Description is required.</FormErrorMessage>
        </Container>
      </Content>
    </>
  );
};
