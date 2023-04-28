import { WishListScreen } from "@components/screens/WishList/WishListScreen";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const WishListPage: NextPage = () => {
  const router = useRouter();
  const wishListId = router.query.wishlistid as string;

  return (
    <>
      <Head>
        <title>Wishes</title>
        <meta
          name="description"
          content="Your wish lists. Add wishes to your wish lists"
        />
      </Head>

      {wishListId && <WishListScreen wishListId={wishListId} />}
    </>
  );
};

export default WishListPage;
