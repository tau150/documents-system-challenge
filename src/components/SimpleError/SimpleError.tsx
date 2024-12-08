import { Box, Text } from "@chakra-ui/react";
import { OctagonAlert } from "lucide-react";

export function SimpleError({ message = "Something went wrong" }: { message?: string }) {
  return (
    <Box
      alignItems="center"
      bg="red.100"
      borderRadius="md"
      color="red.700"
      display="flex"
      gap={8}
      maxWidth="400px"
      p={8}
    >
      <OctagonAlert size={16} />
      <Text fontSize="sm" fontWeight="medium">
        {message}
      </Text>
    </Box>
  );
}
