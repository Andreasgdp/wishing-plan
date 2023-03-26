import { Heading, Link, Stack, Text } from "@chakra-ui/react";
import { SignIn } from "@clerk/nextjs";
import NextLink from "next/link";

import { Content } from "../../components/layouts/Content";

const SignInPage = () => {
  return (
    <Content>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool{" "}
            <Link as={NextLink} color={"blue.400"} href={"/features"}>
              features
            </Link>{" "}
            ✌️
          </Text>
        </Stack>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-4">
          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
        </div>
      </Stack>
    </Content>
  );
};

export default SignInPage;
