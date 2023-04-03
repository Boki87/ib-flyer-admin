import { useState } from "react";
import {
  Input,
  Button,
  InputGroup,
  InputLeftElement,
  chakra,
  Box,
  FormControl,
  InputRightElement,
  Center,
} from "@chakra-ui/react";
import { sessionOptions } from "../lib/session";
import { withIronSessionSsr } from "iron-session/next";
import { FormEvent } from "react";
import { useRouter } from "next/router";
import { FaUserAlt, FaLock } from "react-icons/fa";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleShowClick = () => setShowPassword(!showPassword);

  async function submitHandler(e: FormEvent) {
    e.preventDefault();
    const { email, password } = e.currentTarget as HTMLFormElement;
    const loginReq = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });

    const loginRes = await loginReq.json();
    if (loginRes.email) {
      router.push("/");
    }
  }

  return (
    <Box w="full" h="full" bg="gray.50">
      Login
      <Center w="full" h="full">
        <Box maxW="lg">
          <form onSubmit={submitHandler}>
            <FormControl mb="10px">
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<CFaUserAlt color="gray.300" />}
                />
                <Input
                  required
                  name="email"
                  type="email"
                  placeholder="email address"
                />
              </InputGroup>
            </FormControl>
            <FormControl mb="10px">
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  color="gray.300"
                  children={<CFaLock color="gray.300" />}
                />
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button type="submit" w="full">
              LOGIN
            </Button>
          </form>
        </Box>
      </Center>
    </Box>
  );
}

export const getServerSideProps = withIronSessionSsr(async ({ req, res }) => {
  const { user } = req.session;

  if (user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}, sessionOptions);
