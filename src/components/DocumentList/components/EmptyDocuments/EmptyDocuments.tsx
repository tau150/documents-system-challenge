import { Flex } from "@chakra-ui/react";

export function EmptyDocuments() {
  return (
    <Flex
      alignItems="center"
      bg="white"
      borderRadius="md"
      h="60vh"
      justifyContent="center"
      mt={4}
      shadow="md"
    >
      There are no documents yet.
    </Flex>
  );
}
