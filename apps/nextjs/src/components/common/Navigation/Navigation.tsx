import { Link, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";

const NavigationLink = ({
  href,
  children,
  asPath,
}: {
  href: string;
  children: ReactNode;
  asPath: string;
}) => {
  const isActive = asPath === href;

  const activeBg = useColorModeValue("green.50", "green.900");
  const inactiveBg = useColorModeValue("gray.100", "gray.900");

  const activeColor = useColorModeValue("green.700", "green.400");
  const inactiveColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Link
      as={NextLink}
      href={href}
      fontSize={"sm"}
      rounded={"md"}
      px={3}
      py={2}
      ml={"-12px!important"}
      bg={isActive ? activeBg : undefined}
      fontWeight={isActive ? 600 : 400}
      color={isActive ? activeColor : inactiveColor}
      _hover={{
        bg: isActive ? activeBg : inactiveBg,
      }}
    >
      {children}
    </Link>
  );
};

export type NavigationData = {
  name: string;
  children?: {
    name: string;
    url: string;
  }[];
}[];

type NavigationProps = {
  data?: NavigationData;
  baseURL?: string;
};

export const Navigation = (props: NavigationProps) => {
  const { asPath } = useRouter();
  const categoryColor = useColorModeValue("gray.800", "gray.200");

  const baseURL = props.baseURL ? props.baseURL.replace(/\/$/, "") : "";

  return (
    <Stack
      as={"nav"}
      spacing={6}
      maxW={{ md: "3xs" }}
      w={"full"}
      flexShrink={0}
      display={{ base: "none", lg: "block" }}
    >
      {props.data &&
        props.data.map((category) => (
          <Stack key={category.name}>
            <Text
              textTransform={"uppercase"}
              color={categoryColor}
              fontWeight={700}
              fontSize={"sm"}
              letterSpacing={1}
            >
              {category.name}
            </Text>
            <Stack spacing={1}>
              {category.children?.map((subCategory) => (
                <NavigationLink
                  asPath={asPath}
                  key={subCategory.name}
                  href={`${baseURL}${subCategory.url}`}
                >
                  {subCategory.name}
                </NavigationLink>
              ))}
            </Stack>
          </Stack>
        ))}
    </Stack>
  );
};
