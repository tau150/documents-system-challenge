import { VStack, Heading, Table, Badge, Flex, Spinner, HStack, Box, Text } from "@chakra-ui/react";
import { Trash2, UserPlus } from "lucide-react";
import { useCallback, useState } from "react";
import { getBadgeColor, getDocumentToVerify } from "./DocumentsList.utils";
import { EmptyDocuments } from "./components/EmptyDocuments";
import { useService } from "@/hooks/useService";
import { API } from "@/services/documentsApi";
import { Toaster } from "@/components/ui/toaster";
import { Document, Status } from "@/domain";
import { SimpleError, SignatoriesAssignment } from "@/components";
import { notifyError, notifySuccess } from "@/utils/notify";

export function DocumentList() {
  const [documentToAssign, setDocumentToAssign] = useState<{ name: string; id: string } | null>(
    null,
  );
  const [documents, setDocuments] = useState<Document[]>([]);
  const { error, isLoading } = useService(API.getAll, {
    pollingInterval: 10000,
    onSuccess: useCallback((response: Document[]) => {
      setDocuments((prev) => {
        const prevPendingDocumentsIds = prev
          .filter((doc) => doc.status === Status.PENDING)
          .map((doc) => doc.id);

        response.forEach((doc) => {
          const docToCheck = getDocumentToVerify(prevPendingDocumentsIds, doc);

          if (docToCheck) {
            const action = doc.status === Status.SIGNED ? "Signed" : "Declined";

            notifySuccess(`${doc.name} was ${action}`, "Document status update");
          }
        });

        return response;
      });
    }, []),
  });
  const { callRequest: deleteDocument } = useService(API.deleteDocumentById, {
    callOnLoad: false,
    onSuccess: (deletedId: string | void) => {
      notifySuccess("Deletion successfully");
      if (deletedId) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== deletedId));
      }
    },
    onError: () => notifyError("Error deleting the document"),
  });

  const handleDeleteDocument = (id: string) => {
    deleteDocument(id);
  };

  const handleOnAssign = (document: Document) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === document.id) {
          return document;
        }

        return doc;
      }),
    );
  };

  if (isLoading) {
    return (
      <Flex alignItems="center" h="60vh" justifyContent="center" w="100%">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    <Flex alignItems="center" h="60vh" justifyContent="center" w="100%">
      <SimpleError />
    </Flex>;
  }

  return (
    <VStack align="stretch" mt={4}>
      <Toaster />
      <Heading as="h3" size="md">
        Documents Status
      </Heading>
      {documents && documents?.length > 0 ? (
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Signatories</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader>Actions</Table.ColumnHeader>
              {documentToAssign && <Table.ColumnHeader>Assign signatories</Table.ColumnHeader>}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {documents?.map((doc) => (
              <Table.Row key={doc.id}>
                <Table.Cell>{doc.name}</Table.Cell>
                <Table.Cell>
                  {doc?.signatories && doc.signatories.length > 0 ? (
                    <HStack>
                      {doc.signatories?.map((name) => <Text key={name}>{name}</Text>)}
                    </HStack>
                  ) : (
                    "Not signatories assigned"
                  )}
                </Table.Cell>
                <Table.Cell>
                  <Badge colorPalette={getBadgeColor(doc.status)}>{doc.status}</Badge>
                </Table.Cell>
                <Table.Cell>
                  <HStack alignItems="center" display="flex" gap={4}>
                    <Trash2
                      color="red"
                      cursor="pointer"
                      size={16}
                      onClick={() => handleDeleteDocument(doc.id)}
                    />
                    <UserPlus
                      color="violet"
                      cursor="pointer"
                      size={16}
                      onClick={() => setDocumentToAssign({ name: doc.name, id: doc.id })}
                    />
                  </HStack>
                </Table.Cell>
                {documentToAssign &&
                  (documentToAssign.id === doc.id ? (
                    <Table.Cell borderBottomWidth={0}>
                      <SignatoriesAssignment
                        inline
                        document={documentToAssign}
                        setDocument={setDocumentToAssign}
                        onAssign={handleOnAssign}
                        onCancel={() => setDocumentToAssign(null)}
                      />
                    </Table.Cell>
                  ) : (
                    <Box />
                  ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      ) : (
        <EmptyDocuments />
      )}
    </VStack>
  );
}
