import { WishListScreen } from "@components/screens/WishList/WishListScreen";
import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { generateSSGHelper } from "src/helpers/ssgHelper";

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

  const wishlist = await ssg.wishList.getById.fetch({ id });

  if (!wishlist) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
export default WishListPage;
