import { Tag, Text, useColorModeValue } from "@chakra-ui/react";
import { useAuth } from "@clerk/nextjs";
import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";

const LogoBox = styled.span`
  font-weight: bold;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  height: 30px;
  line-height: 20px;
  padding: 10px;
  img {
    transition-duration: 250ms;
  }
  &:hover img {
    transform: rotate(15deg);
  }
`;

type LogoProps = {
  showVersion?: boolean;
};

const Logo = (props: LogoProps) => {
  const { isLoaded, userId } = useAuth();
  const url = isLoaded && userId ? "/" : "/product";

  const logoImg = `/logo${useColorModeValue("-light", "-dark")}.svg`;
  return (
    <Link href={url} style={{ display: "flex" }}>
      <LogoBox>
        {/* The with is set to 25.68 to medigate warning of inproper scaling based on the ratio of the svg file. */}
        <Image src={logoImg} width={25.68} height={25} alt="logo" />
        <Text
          color={useColorModeValue("gray.700", "white.900")}
          ml={3}
          letterSpacing={"tight"}
        >
          Wishing Plan
        </Text>

        {props.showVersion && (
          <Tag
            size="md"
            ml={2}
            colorScheme="purple"
            letterSpacing={"tight"}
            fontWeight="bold"
          >
            Alpha
          </Tag>
        )}
      </LogoBox>
    </Link>
  );
};

export default Logo;
