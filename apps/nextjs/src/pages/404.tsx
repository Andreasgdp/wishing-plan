import { Button, Link } from "@chakra-ui/react";
import { Content } from "@components/layouts/Content";
import NextLink from "next/link";

// pages/404.js
export default function Custom404() {
  return (
    <Content>
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-9xl font-bold">404</h1>
        <p className="text-2xl font-semibold">Page not found</p>
        <Link
          as={NextLink}
          href="/"
          className="mt-4
			"
        >
          <Button colorScheme="purple" size="lg">
            <a>Go back home</a>
          </Button>
        </Link>
      </div>
    </Content>
  );
}
