import { PlanScreen } from "@components/screens/Plan/PlanScreen";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

const SharedPlansPage: NextPage = () => {
  const router = useRouter();
  const planId = router.query.planid as string;

  return (
    <>
      <Head>
        <title>Shared Plans</title>
        <meta
          name="description"
          content="Your friends shared their plans with you."
        />
      </Head>

      {planId && <PlanScreen planId={planId} />}
    </>
  );
};

export default SharedPlansPage;
