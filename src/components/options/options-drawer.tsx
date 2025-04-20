import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  useDisclosure,
} from "@heroui/react";
import { IconAdjustment, IconX } from "justd-icons";
import { Options } from "../options";

export const OptionsDrawer = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        isIconOnly
        radius="full"
        color="primary"
        onPress={onOpen}
        className="fixed right-4 bottom-4"
      >
        <IconAdjustment />
      </Button>
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="bottom"
        hideCloseButton
        size="md"
        classNames={{
          wrapper: "print:hidden",
          backdrop: "print:hidden",
          base: "h-full",
        }}
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">
                各種設定
              </DrawerHeader>
              <DrawerBody className="py-0">
                <Options intent="tabs" />
              </DrawerBody>
              <DrawerFooter>
                <Button
                  onPress={() => {
                    print();
                  }}
                  color="primary"
                  className="mr-12 w-full"
                >
                  印刷する
                </Button>
                <Button
                  isIconOnly
                  radius="full"
                  onPress={onClose}
                  className="fixed right-4 bottom-4"
                >
                  <IconX />
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};
