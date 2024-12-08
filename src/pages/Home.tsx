import { Heading, Box, Text } from "@chakra-ui/react";
import { NavLink } from "react-router";
import { DocumentUpload } from "@/components";
import { ROUTES } from "@/Router";

export function Home() {
  return (
    <>
      <Heading as="h2" mb={2} size="lg">
        Document Uploader
      </Heading>
      <Text color="gray.600">Upload and request signatures</Text>
      <Box mt={6}>
        <NavLink to={ROUTES.DOCUMENTS}>Documents status</NavLink>
      </Box>
      <Box mt={8}>
        <DocumentUpload />
      </Box>
    </>
  );
}
