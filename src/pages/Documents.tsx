import { Heading, Box, Text } from "@chakra-ui/react";
import { NavLink } from "react-router";
import { DocumentList } from "@/components";
import { ROUTES } from "@/Router";

export function Documents() {
  return (
    <>
      <Heading as="h2" mb={2} size="lg">
        Document Management
      </Heading>
      <Text color="gray.600">Request signatures, and track document statuses</Text>
      <Box mt={6}>
        <NavLink to={ROUTES.ROOT}>Documents upload</NavLink>
      </Box>
      <Box mt={8}>
        <DocumentList />
      </Box>
    </>
  );
}
