import Head from "next/head";

import { useUser } from "@clerk/nextjs";
import { PlanScreen } from "@components/screens/Plan/PlanScreen";

const Plan = () => {
  const { user } = useUser();

  const email = user?.primaryEmailAddress?.toString() ?? "Loading...";

  return (
    <>
      <Head>
        <title>Plan - {email}</title>
      </Head>

      <PlanScreen />
    </>
  );
};

export default Plan;
