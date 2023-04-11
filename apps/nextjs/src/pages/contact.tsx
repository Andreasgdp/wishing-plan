import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  Textarea,
  useColorModeValue,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Content } from "@components/layouts/Content";
import type { NextPage } from "next";
import { BsDiscord, BsGithub, BsPerson } from "react-icons/bs";
import {
  MdEmail,
  MdFacebook,
  MdLocationOn,
  MdOutlineEmail,
  MdPhone,
} from "react-icons/md";

const Contact: NextPage = () => {
  return (
    <Content>
      <Container maxW="full" mt={0} centerContent overflow="hidden">
        <Flex>
          <Box
            bg={useColorModeValue("gray.50", "gray.700")}
            color={useColorModeValue("gray.50", "white")}
            borderRadius="lg"
            m={{ sm: 4, md: 16, lg: 10 }}
            p={{ sm: 5, md: 5, lg: 16 }}
          >
            <Box p={4}>
              <Wrap spacing={{ base: 20, sm: 3, md: 5, lg: 20 }}>
                <WrapItem>
                  <Box>
                    <Heading>Contact</Heading>
                    <Text mt={{ sm: 3, md: 3, lg: 5 }} color="gray.300">
                      Fill up the form below to contact
                    </Text>
                    <Box
                      py={{
                        base: 5,
                        sm: 5,
                        md: 8,
                        lg: 10,
                      }}
                    >
                      <VStack pl={0} spacing={3} alignItems="flex-start">
                        <Button
                          size="md"
                          height="48px"
                          width="220px"
                          variant="ghost"
                          color="gray.300"
                          _hover={{
                            border: "2px solid #1C6FEB",
                          }}
                          leftIcon={<MdPhone color="#ba3f86" size="20px" />}
                        >
                          +45-93606242
                        </Button>
                        <Button
                          size="md"
                          height="48px"
                          width="220px"
                          variant="ghost"
                          color="gray.300"
                          _hover={{
                            border: "2px solid #1C6FEB",
                          }}
                          leftIcon={<MdEmail color="#ba3f86" size="20px" />}
                        >
                          andreasgdp@gmail.com
                        </Button>
                        <Button
                          size="md"
                          height="48px"
                          width="220px"
                          variant="ghost"
                          color="gray.300"
                          _hover={{
                            border: "2px solid #1C6FEB",
                          }}
                          leftIcon={
                            <MdLocationOn color="#ba3f86" size="20px" />
                          }
                        >
                          Odense, Denmark
                        </Button>
                      </VStack>
                    </Box>
                    <HStack
                      mt={{ lg: 10, md: 10 }}
                      spacing={5}
                      px={5}
                      alignItems="flex-start"
                    >
                      <IconButton
                        aria-label="facebook"
                        variant="ghost"
                        size="lg"
                        isRound={true}
                        _hover={{ bg: "green.400" }}
                        icon={<MdFacebook size="28px" />}
                      />
                      <IconButton
                        aria-label="github"
                        variant="ghost"
                        size="lg"
                        isRound={true}
                        _hover={{ bg: "green.400" }}
                        icon={<BsGithub size="28px" />}
                      />
                      <IconButton
                        aria-label="discord"
                        variant="ghost"
                        size="lg"
                        isRound={true}
                        _hover={{ bg: "green.400" }}
                        icon={<BsDiscord size="28px" />}
                      />
                    </HStack>
                  </Box>
                </WrapItem>
                <WrapItem>
                  <Box
                    bg={useColorModeValue("white", "gray.600")}
                    borderRadius="lg"
                  >
                    <Box
                      m={8}
                      color={useColorModeValue("gray.600", "gray.100")}
                    >
                      <VStack spacing={5}>
                        <FormControl id="name">
                          <FormLabel>Your Name</FormLabel>
                          <InputGroup borderColor="gray.100">
                            <InputLeftElement pointerEvents="none">
                              <BsPerson color="gray.800" />
                            </InputLeftElement>
                            <Input
                              type="text"
                              size="md"
                              placeholder="John Doe"
                              _placeholder={{
                                opacity: 1,
                                color: "gray.300",
                              }}
                            />
                          </InputGroup>
                        </FormControl>
                        <FormControl id="name">
                          <FormLabel>Mail</FormLabel>
                          <InputGroup borderColor="gray.100">
                            <InputLeftElement pointerEvents="none">
                              <MdOutlineEmail color="gray.800" />
                            </InputLeftElement>
                            <Input
                              type="text"
                              size="md"
                              placeholder="example@gmail.com"
                              _placeholder={{
                                opacity: 1,
                                color: "gray.300",
                              }}
                            />
                          </InputGroup>
                        </FormControl>
                        <FormControl id="name">
                          <FormLabel>Message</FormLabel>
                          <Textarea
                            borderColor="gray.100"
                            placeholder="message"
                            _placeholder={{
                              opacity: 1,
                              color: "gray.300",
                            }}
                          />
                        </FormControl>
                        <FormControl id="name" float="right">
                          <Button
                            variant="solid"
                            bg="green.400"
                            color={useColorModeValue("gray.50", "gray.700")}
                            _hover={{}}
                          >
                            Send Message
                          </Button>
                        </FormControl>
                      </VStack>
                    </Box>
                  </Box>
                </WrapItem>
              </Wrap>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Content>
  );
};

export default Contact;
