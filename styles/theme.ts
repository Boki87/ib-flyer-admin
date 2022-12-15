import { extendTheme } from "@chakra-ui/react";

const styles = {
  global: () => ({
    html: {
      h: "100%",
      w: "100%",
      scrollBehavior: "smooth",
    },
    body: {
      h: "100%",
      w: "100%",
    },
    "#__next": {
      h: "100%",
      w: "100%",
    },
    "#nprogress .bar": {
      height: "5px",
    },
  }),
};

const theme = extendTheme({
  styles,
});

export default theme;
