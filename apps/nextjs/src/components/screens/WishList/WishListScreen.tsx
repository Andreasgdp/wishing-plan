import { Center, Container, Tag } from "@chakra-ui/react";
import { EmptyStateWrapper } from "@components/EmptyStateWrapper";
import { Content } from "@components/layouts/Content";
import { trpc } from "@utils/trpc";
import { WishesList } from "./WishesList";
import { WishModal } from "./WishModal";

export type WishForm = {
  title: string;
  description?: string;
  price: string;
  url: string;
  imageUrl: string;
};

type WishListScreenProps = {
  wishListId: string;
};

export const WishListScreen = (props: WishListScreenProps) => {
  const {
    data: wishes,
    isLoading: isLoadingWishes,
    refetch: refetchWishLists,
  } = trpc.wishList.getWishes.useQuery({
    id: props.wishListId,
  });

  const { isLoading: isLoadingSettings } = trpc.settings.get.useQuery();
  const createWish = trpc.wish.create.useMutation();

  const onSubmit = async (
    title: string,
    description: string,
    url: string,
    imageUrl: string,
    price: number,
  ) => {
    await createWish.mutateAsync({
      title: title,
      description: description ?? "",
      price: price,
      url: url,
      imageUrl: imageUrl,
      wishListId: props.wishListId,
    });
    await refetchWishLists();
  };

  return (
    <>
      <Content>
        <Container maxW="container.xl">
          <Center h="100px">
            <WishModal
              buttonProps={{
                variant: "solid",
                colorScheme: "green",
              }}
              buttonName="Add a wish"
              onSubmit={onSubmit}
            />
          </Center>
          <EmptyStateWrapper
            isLoading={isLoadingWishes && isLoadingSettings}
            data={wishes}
            EmptyComponent={
              <Center>
                <Tag size={"lg"} variant="solid" colorScheme="teal">
                  No Wishes Yet
                </Tag>
              </Center>
            }
            NonEmptyComponent={
              <WishesList
                refreshListFunc={refetchWishLists}
                wishes={wishes ?? []}
              />
            }
          />
        </Container>
      </Content>
    </>
  );
};
