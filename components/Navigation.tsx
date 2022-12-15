import NextLink from "next/link";
import { Box, Button, HStack, Spacer, Link } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ReactNode } from "react";

interface ILinkItem {
  href: string;
  activePath: string;
  children: ReactNode;
}

const LinkItem = ({ href, activePath, children, ...props }: ILinkItem) => {
  const active = href === activePath;
  const color = active ? "gray.700" : "gray.500";
  return (
    <NextLink href={href} passHref scroll={false}>
      <Link {...props} color={color} as="span">
        {children}
      </Link>
    </NextLink>
  );
};

export default function Navigation() {
  const router = useRouter();

  async function logout() {
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/login");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <HStack h="60px" borderBottom="1px" borderColor="gray.200" position="fixed" top="0" left="0" zIndex={2} w="full" bg="white">
      <HStack maxW="6xl" w="full" mx="auto" px="20px">
        <HStack>
          <LinkItem href="/" activePath={router.asPath}>
            Owners
          </LinkItem>
          <LinkItem href="/devices" activePath={router.asPath}>
            Devices
          </LinkItem>
        </HStack>
        <Spacer />
        <Box>
          <Button onClick={logout}>Logout</Button>
        </Box>
      </HStack>
    </HStack>
  );
}
