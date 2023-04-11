import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Center,
  IconButton,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";

const ThemeToggleButton = () => {
  const { toggleColorMode } = useColorMode();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        style={{ display: "inline-block" }}
        key={useColorModeValue("light", "dark")}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Center>
          <IconButton
            borderRadius="3xl"
            aria-label="Toggle theme"
            colorScheme={useColorModeValue("purple", "orange")}
            icon={useColorModeValue(<MoonIcon />, <SunIcon />)}
            onClick={toggleColorMode}
          ></IconButton>
        </Center>
      </motion.div>
    </AnimatePresence>
  );
};

export default ThemeToggleButton;
