import { Box, Container, Text } from "@chakra-ui/react";
import { Content } from "@components/layouts/Content";
import Head from "next/head";

// Create about page component
const About = () => {
  return (
    <Content>
      <Container maxW="container.xl">
        <Head>
          <title>Features</title>
        </Head>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
        >
          <Text fontSize="2xl" fontWeight="bold">
            This is the features page for Wishing Plan.
          </Text>
          <Text fontSize="xl" fontWeight="medium">
            ...
          </Text>
        </Box>
      </Container>
    </Content>
  );
};

export default About;
