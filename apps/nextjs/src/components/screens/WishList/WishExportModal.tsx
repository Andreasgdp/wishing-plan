import {
  Button,
  ButtonProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  FormControl,
  FormLabel,
  Checkbox,
} from "@chakra-ui/react";
import type { Wish } from "@prisma/client";
import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { WishPDFExport } from "./WishPDFExport";

type WishExportModalProps = {
  buttonName: string;
  buttonProps: ButtonProps;
  wishes: Wish[];
};

type WishCheck = {
  wish: Wish;
  checked: boolean;
};

export const WishExportModal = (props: WishExportModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [wishChecks, setWishChecks] = useState<WishCheck[]>([]);
  const [canDownload, setCanDownload] = useState<boolean>(false);
  const [disableDownload, setDisableDownload] = useState<boolean>(true);

  useEffect(() => {
    toggleAllwishChecks(false);
  }, []);

  const toggleAllwishChecks = (checked: boolean) => {
    setWishChecks(
      props.wishes.map((wish: Wish) => {
        return { wish: wish, checked: checked };
      }),
    );
  };

  const onAllCheckboxChange = (e: any) => {
    // if all the wishes are selected
    if (e.target.checked) {
      toggleAllwishChecks(true);
      setDisableDownload(false);
      return;
    }

    // if unselect all
    toggleAllwishChecks(false);
    setDisableDownload(true);
  };

  const onCheckboxChange = (e: any) => {
    const newWishChecks: WishCheck[] = wishChecks.map(
      (wishCheck: WishCheck) => {
        if (wishCheck.wish.id === e.target.value) {
          wishCheck.checked = e.target.checked;
        }
        return wishCheck;
      },
    );
    setDisableDownload(
      newWishChecks.find((wishCheck: WishCheck) => wishCheck.checked) ===
        undefined,
    );
    setWishChecks(newWishChecks);
  };

  const closeModal = () => {
    setCanDownload(false);
    toggleAllwishChecks(false);
    onClose();
  };

  const getCheckedWishes = (): Wish[] => {
    const exportWishes: WishCheck[] = wishChecks.filter(
      (wishCheck: WishCheck) => {
        return wishCheck.checked;
      },
    );
    return exportWishes.map((wishCheck: WishCheck) => wishCheck.wish);
  };

  return (
    <>
      <Button {...props.buttonProps} onClick={onOpen}>
        {props.buttonName}
      </Button>
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        size={{ base: "xs", md: "xl" }}
      >
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>
            <ModalCloseButton />
          </ModalHeader>

          <ModalBody>
            <FormControl>
              {canDownload ? (
                <></>
              ) : (
                <>
                  <FormLabel>Select wishes to export</FormLabel>
                  <div className="flex h-36 flex-col overflow-y-auto">
                    <Checkbox
                      colorScheme="green"
                      onChange={onAllCheckboxChange}
                    ></Checkbox>
                    {wishChecks.map((wishCheck: WishCheck) => {
                      return (
                        <div className="flex-row">
                          <Checkbox
                            colorScheme="red"
                            onChange={onCheckboxChange}
                            value={wishCheck.wish.id}
                            isChecked={wishCheck.checked}
                          >
                            {wishCheck.wish.title}
                          </Checkbox>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </FormControl>
            {canDownload ? (
              <>
                <p>PDF generated, ready to download...</p>
                <PDFDownloadLink
                  document={<WishPDFExport wishes={getCheckedWishes()} />}
                  fileName={"Wishing Plan - " + new Date().toUTCString()}
                  className="mt-5 flex justify-center rounded-md border-2 p-2"
                  onClick={closeModal}
                >
                  Download PDF
                </PDFDownloadLink>
              </>
            ) : (
              <></>
            )}
          </ModalBody>

          <ModalFooter>
            {canDownload ? (
              <></>
            ) : (
              <Button
                isDisabled={disableDownload}
                onClick={() => setCanDownload(true)}
              >
                Generate PDF
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
