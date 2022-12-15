import { Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import Navigation from "./Navigation";

interface ILayout {
  children: ReactNode;
}

export default function Layout({ children }: ILayout) {
  return (
    <Box>
      <Navigation />
      <Box maxW="6xl" mx="auto" px="20px" pt="70px">{children}</Box>
    </Box>
  );
}
