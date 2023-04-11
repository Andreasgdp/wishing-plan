import {
  Avatar,
  Box,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

const Testimonial = ({ children }: { children: ReactNode }) => {
  return <Box>{children}</Box>;
};

const TestimonialContent = ({ children }: { children: ReactNode }) => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      boxShadow={"lg"}
      p={8}
      rounded={"xl"}
      align={"center"}
      pos={"relative"}
      _after={{
        content: `""`,
        w: 0,
        h: 0,
        borderLeft: "solid transparent",
        borderLeftWidth: 16,
        borderRight: "solid transparent",
        borderRightWidth: 16,
        borderTop: "solid",
        borderTopWidth: 16,
        borderTopColor: useColorModeValue("white", "gray.800"),
        pos: "absolute",
        bottom: "-16px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {children}
    </Stack>
  );
};

const TestimonialHeading = ({ children }: { children: ReactNode }) => {
  return (
    <Heading as={"h3"} fontSize={"xl"}>
      {children}
    </Heading>
  );
};

const TestimonialText = ({ children }: { children: ReactNode }) => {
  return (
    <Text
      textAlign={"center"}
      color={useColorModeValue("gray.600", "gray.400")}
      fontSize={"sm"}
    >
      {children}
    </Text>
  );
};

const TestimonialAvatar = ({
  src,
  name,
  title,
}: {
  src: string;
  name: string;
  title: string;
}) => {
  return (
    <Flex align={"center"} mt={8} direction={"column"}>
      <Avatar src={src} mb={2} />
      <Stack spacing={-1} align={"center"}>
        <Text fontWeight={600}>{name}</Text>
        <Text fontSize={"sm"} color={useColorModeValue("gray.600", "gray.400")}>
          {title}
        </Text>
      </Stack>
    </Flex>
  );
};

export function TestemonialSection() {
  return (
    <Box bg={useColorModeValue("gray.100", "gray.700")}>
      <Container maxW={"7xl"} py={16} as={Stack} spacing={12}>
        <Stack spacing={0} align={"center"}>
          <Heading>Our Clients Speak</Heading>
          <Text>Our clients love us! Check out what they have to say</Text>
        </Stack>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={{ base: 10, md: 4, lg: 10 }}
        >
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>Amazing Product</TestimonialHeading>
              <TestimonialText>
                Wishing Plan brings a new level of organization to my life. It
                allows me to focus saving for important goals.
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={
                "https://media.licdn.com/dms/image/C4D03AQHQtxBLy9t63w/profile-displayphoto-shrink_800_800/0/1563041153318?e=1676505600&v=beta&t=s2BOWv9cVwincpckSSU7XXcgiQM9YKvm9Lrtr5Ygy9A"
              }
              name={"Andreas Petersen"}
              title={"Co-founder of BHelpful"}
            />
          </Testimonial>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>Intuitive Design</TestimonialHeading>
              <TestimonialText>
                I love how easy and intuitive the application is to use.
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={
                "https://media.licdn.com/dms/image/C4D03AQHQtxBLy9t63w/profile-displayphoto-shrink_800_800/0/1563041153318?e=1676505600&v=beta&t=s2BOWv9cVwincpckSSU7XXcgiQM9YKvm9Lrtr5Ygy9A"
              }
              name={"Andreas Petersen"}
              title={"Co-founder of BHelpful"}
            />
          </Testimonial>
          <Testimonial>
            <TestimonialContent>
              <TestimonialHeading>Easy Planning</TestimonialHeading>
              <TestimonialText>
                It is amazing how easy it is to plan and prioritize my wishList.
              </TestimonialText>
            </TestimonialContent>
            <TestimonialAvatar
              src={
                "https://media.licdn.com/dms/image/C4D03AQHQtxBLy9t63w/profile-displayphoto-shrink_800_800/0/1563041153318?e=1676505600&v=beta&t=s2BOWv9cVwincpckSSU7XXcgiQM9YKvm9Lrtr5Ygy9A"
              }
              name={"Andreas Petersen"}
              title={"Co-founder of BHelpful"}
            />
          </Testimonial>
        </Stack>
      </Container>
    </Box>
  );
}
