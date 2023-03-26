// src/pages/_app.tsx
import { ClerkProvider } from "@clerk/nextjs";
import type { AppType } from "next/app";
import "../styles/globals.css";
import { trpc } from "../utils/trpc";

import { ChakraProvider, useColorModeValue } from "@chakra-ui/react";
import { dark } from "@clerk/themes";
import { Analytics } from "@vercel/analytics/react";
import { AnimatePresence } from "framer-motion";
import Head from "next/head";
import NextProgress from "nextjs-progressbar";
import Fonts from "../components/common/Theme/Fonts";
import Layout from "../components/layouts/Layout";
import theme from "../libs/theme";

const prefersDarkMode = () => {
  return globalThis?.window?.matchMedia("(prefers-color-scheme: dark)").matches;
};

const MyApp: AppType = ({ Component, pageProps: { ...pageProps }, router }) => {
  const activeColor = useColorModeValue("#3fba73", "#9ee871");
  const colorBackground = useColorModeValue("#232a38", "#f9f9f9");

  return (
    <ClerkProvider
      {...pageProps}
      appearance={{
        baseTheme: prefersDarkMode() ? dark : undefined,
        variables: {
          colorBackground: colorBackground,
        },
      }}
    >
      <Head>
        {!prefersDarkMode() && (
          <>
            <link rel="shortcut icon" href="/favicon/light/favicon.ico" />

            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/favicon/light/apple-touch-icon.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon/light/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/favicon/light/favicon-16x16.png"
            />
          </>
        )}
        {prefersDarkMode() && (
          <>
            <link rel="shortcut icon" href="/favicon/dark/favicon.ico" />
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/favicon/dark/apple-touch-icon.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon/dark/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/favicon/dark/favicon-16x16.png"
            />
          </>
        )}
      </Head>
      <ChakraProvider theme={theme}>
        <Fonts />
        <Layout>
          <AnimatePresence
            mode="wait"
            initial={true}
            onExitComplete={() => {
              if (typeof window !== "undefined") {
                window.scrollTo({ top: 0 });
              }
            }}
          >
            <NextProgress
              color={activeColor}
              options={{ showSpinner: false }}
            />
            <Component {...pageProps} key={router.route} />
            <Analytics />
          </AnimatePresence>
        </Layout>
      </ChakraProvider>
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);
