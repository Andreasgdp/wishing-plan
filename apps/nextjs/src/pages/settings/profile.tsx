import Head from "next/head";

import { Button, Container, Stack } from "@chakra-ui/react";
import { useAuth, useUser } from "@clerk/nextjs";
import { Navigation } from "@components/common/Navigation/Navigation";
import { Content } from "@components/layouts/Content";
import { settingsNavigationData } from "@lib/constants";

// TODO: implement something like this to get rid of duplicate code when creating new pages in the settings section
// https://github.com/hauptrolle/chakra-templates/blob/main/src/pages/%5B...slug%5D.tsx

// Create about page component
const Profile = () => {
	const { user } = useUser();
	const { signOut } = useAuth();

  return (
    <>
      <Head>
        <title>Profile - {user?.username}</title>
      </Head>
      <Container maxW={"7xl"} flex={"1 0 auto"} py={8}>
        <Stack
          direction={{ base: "column", lg: "row" }}
          spacing={{ base: 0, lg: 8 }}
        >
          <Navigation data={settingsNavigationData} baseURL="/settings" />
          <Content>
            <Button onClick={() => signOut()} variant="solid" colorScheme="red">
              Sign Out
            </Button>
          </Content>
        </Stack>
      </Container>
    </>
  );
};

export default Profile;
