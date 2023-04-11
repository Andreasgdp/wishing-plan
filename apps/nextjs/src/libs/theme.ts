import type { StyleFunctionProps } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import type { Styles } from "@chakra-ui/theme-tools";
import { mode } from "@chakra-ui/theme-tools";

const styles: Styles = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  global: (props: Record<string, any> | StyleFunctionProps) => ({
    body: {
      // Light, dark
      bg: mode("#ffffff", "gray.800")(props),
    },
  }),
};

const components = {
  Heading: {
    variants: {
      "section-title": {
        textDecoration: "underline",
        fontSize: 20,
        textUnderlineOffset: 6,
        textDecorationColor: "#525252",
        textDecorationThickness: 4,
        marginTop: 3,
        marginBottom: 4,
      },
      "company-title": {
        fontSize: 20,
        textDecorationThickness: 4,
        marginTop: 3,
        marginBottom: 0,
      },
    },
  },
  Link: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    baseStyle: (props: Record<string, any> | StyleFunctionProps) => ({
      color: mode("#bb71e8", "#ba3f86")(props),
      textUnderlineOffset: 3,
    }),
  },
};

const fonts = {
  heading: "'Montserrat'",
};

const colors = {
  navBarPrimaryLight: "#9ee871",
  navBarPrimaryDark: "#3fba73",
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const sizes = {
  sizes: {
    container: {
      xl: "100px",
    },
  },
};

const theme = extendTheme({ styles, components, fonts, colors, config, sizes });
export default theme;
