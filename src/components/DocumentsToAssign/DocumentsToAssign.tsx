import { useState } from "react";
import { VStack, Heading, Text, Box, HStack } from "@chakra-ui/react";
import { UserPlus } from "lucide-react";
import { SignatoriesAssignment } from "@/components";
import { Document } from "@/domain";

interface DocumentsToAssignProps {
  documents: Document[];
}

export function DocumentsToAssign({ documents }: DocumentsToAssignProps) {
  const [documentToAssign, setDocumentToAssign] = useState<{ name: string; id: string } | null>(
    null,
  );

  return (
    <VStack alignItems="flex-start">
      <Heading alignSelf={"center"} as="h3" size="md">
        Assign signatories
      </Heading>
      <Box mt={4} w="100%">
        {documents.map((doc) => (
          <HStack
            key={doc.id}
            borderBottomWidth={1}
            gap={12}
            justifyContent="space-between"
            my={2}
            pb={2}
          >
            <Text truncate>{doc.name}</Text>
            <Box alignItems="center" display="flex" gap={4}>
              <UserPlus
                color="violet"
                cursor="pointer"
                size={16}
                onClick={() => setDocumentToAssign({ name: doc.name, id: doc.id })}
              />
            </Box>
          </HStack>
        ))}
        {documentToAssign && (
          <SignatoriesAssignment
            document={documentToAssign}
            setDocument={setDocumentToAssign}
            onCancel={() => setDocumentToAssign(null)}
          />
        )}
      </Box>
    </VStack>
  );
}
