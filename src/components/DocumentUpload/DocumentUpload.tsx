import { useState } from "react";
import { Stack, Box } from "@chakra-ui/react";
import { Document } from "@/domain";
import { Toaster } from "@/components/ui/toaster";
import { Uploader, DocumentsToAssign } from "@/components";

export function DocumentUpload() {
  const [documentsToAssign, setDocumentsToAssign] = useState<Document[]>([]);

  const handleUploadedDocuments = (docs: Document[]) => {
    setDocumentsToAssign((prev) => [...prev, ...docs]);
  };

  return (
    <Box>
      <Toaster />
      <Box>
        <Stack alignItems="flex-start" flexDir={{ sm: "column", lg: "row" }} gap={12}>
          <Box
            bg="white"
            borderRadius="md"
            maxW={{ sm: "100%", lg: "4/12" }}
            minW={{ sm: "100%", lg: "4/12" }}
            p={8}
            shadow="md"
          >
            <Uploader onUpload={(docs) => handleUploadedDocuments(docs)} />
          </Box>
          {documentsToAssign.length > 0 && (
            <Box
              bg="white"
              borderRadius="md"
              maxW={{ sm: "100%", lg: "4/12" }}
              minW={{ sm: "100%", lg: "4/12" }}
              p={8}
              shadow="md"
            >
              <DocumentsToAssign documents={documentsToAssign} />
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
