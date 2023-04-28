import { WishListScreen } from "@components/screens/WishList/WishListScreen";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { generateSSGHelper } from "src/helpers/ssgHelper";
import { prisma } from "@wishingplan/db";


const WishListPage: NextPage<{ id: string }> = ({ id }) => {
  return (
    <>
      <Head>
        <title>Wishes</title>
        <meta
          name="description"
          content="Your wish lists. Add wishes to your wish lists"
        />
      </Head>

      <WishListScreen wishListId={id} />
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.wishlistid;

  if (typeof id !== "string") throw new Error("no id");

  await ssg.wishList.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const wishlists = await prisma.wishList.findMany({
    select: {
      id: true,
    },
  });

  return {
    paths: wishlists.map((wishlist) => ({
      params: {
        wishlistid: wishlist.id,
      },
    })),
    fallback: "blocking",
  };
};
export default WishListPage;
