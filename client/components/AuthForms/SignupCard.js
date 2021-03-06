/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Select,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useAuth } from "../../context/AuthContext";
import { TransactionContext } from "../../src/ether/TransactionContext";

export default function SignupCard() {
  let {
    connectWallet,
    checkIfWalletIsConnect,
    currentAccount,
    setRider,
    setDriver,
  } = useContext(TransactionContext);

  //Prompt User to Connect Wallet
  useEffect(() => {
    connectWallet();
  }, [currentAccount]);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const displayNameRef = useRef();
  const [role, setRole] = useState('');
  const { signup, login } = useAuth();
  const history = useHistory();

  function CheckPasswordMatch(passwordRef, passwordConfirmRef) {
    return passwordRef.current.value !== passwordConfirmRef.current.value;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (CheckPasswordMatch(passwordRef, passwordConfirmRef)){
      alert("Passwords do not match");
      return setError('passwords do not match');
    }
    setLoading(true);
    try {
      const newUser = await signup(emailRef.current.value, passwordConfirmRef.current.value, displayNameRef.current.value, role);
      await login(emailRef.current.value, passwordConfirmRef.current.value)
      //Add Driver to blockchain dictionary
      if (role === "DRIVER") {
        setDriver();
      }
      //Add Rider to blockchain dictionary
      if (role === "RIDER") {
        setRider();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <form onSubmit={handleSubmit}>
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"} textAlign={"center"}>
              Sign up
            </Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id="email" isRequired>
                <FormLabel>Email address</FormLabel>
                <Input ref={emailRef} type="email" />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl id="password-confrim" isRequired>
                <FormLabel>Password Confirm</FormLabel>
                <InputGroup>
                  <Input
                    ref={passwordConfirmRef}
                    type={showPassword ? "text" : "password"}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl id="displayName" isRequired>
                <FormLabel>Username</FormLabel>
                <Input ref={displayNameRef} type="text" />
              </FormControl>
              <FormControl id="roleSelect" isRequired>
                <FormLabel htmlFor="role">Role</FormLabel>
                <Select
                  id="role"
                  placeholder="Select Role"
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="RIDER">Rider</option>
                  <option value="DRIVER">Driver</option>
                </Select>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  type="submit"
                  loadingText="Submitting"
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Already a user?{" "}
                  <Link as={RouterLink} color="blue.500" to="/login">
                    Log In
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </form>
    </Flex>
  );
}
