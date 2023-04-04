import { Box, Button, Flex, HStack, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";

const ExpandableCard=({children, title, modalSize="xl"}: any) => {
  const [open, setOpen] = useState(true)
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose} = useDisclosure()


  const expandableContent = () => {
    return (
      <Box width="full" height="full" padding={4} backgroundColor="white" shadow={"md"} borderTop={2}>
        {children}
      </Box>
    );
  }

  const toggleExpand = () => {
    setOpen(!open)
  }

  const renderToggleButton = () => {
    if (open) {
      return (
        <Image onClick={toggleExpand} width={4} height={4} src="/minimize.png" />
      );
    }
    return (
      <Image onClick={toggleExpand} width={4} height={4} src="/maximize.png" />
    );
  }

  const renderModalOpenButton = () => {
    return (
      <Image onClick={onModalOpen} width={5} height={5} src="/popout.png" />
    );
  }

  return (
    <>
      <Box border={2} rounded="md">
        <Flex cursor="pointer" roundedTop="md" width="full" padding={4} shadow="sm" backgroundColor="white" justify="space-between">
          <HStack>
            {renderToggleButton()}
            <Text fontSize="sm">{title}</Text>
          </HStack>
          <HStack>
            {renderModalOpenButton()}
          </HStack>
        </Flex>
        {open && expandableContent()}
      </Box>
      <Modal isOpen={isModalOpen} onClose={onModalClose} size={modalSize}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {children}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ExpandableCard;