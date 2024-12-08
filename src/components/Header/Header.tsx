import { Box, Container, Heading } from "@chakra-ui/react";

export function Header() {
  return (
    <Box as="header" bg="blue.500" color="white" py={4} shadow="md">
      <Container maxW="container.xl">
        <Heading size="3xl" textAlign="center">
          Document Management System
        </Heading>
      </Container>
    </Box>
  );
}
