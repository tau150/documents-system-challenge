import { useState } from "react";
import { FileUp, FileType2, CircleCheck, SquareX } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { VStack, Button, Text, Input, HStack, Box, Icon, List } from "@chakra-ui/react";
import { Toaster } from "@/components/ui/toaster";
import { API } from "@/services/documentsApi";
import { Status, Document } from "@/domain";
import { useService } from "@/hooks";
import { notifyError, notifySuccess } from "@/utils/notify";

interface UploaderProps {
  onUpload: (documents: Document[]) => void;
}

const ACCEPTED_FILE_TYPES = [".pdf", ".docx"];

export function Uploader({ onUpload }: UploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { isLoading, callRequest: saveDocuments } = useService(API.save, {
    callOnLoad: false,
    onSuccess: (response: Document[] | void) => {
      notifySuccess("Documents saved");
      setFiles([]);
      onUpload(response ?? []);
    },
    onError: (errorMessage: string) => notifyError(errorMessage),
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files).filter((file) =>
        ACCEPTED_FILE_TYPES.some((type) => file.name.toLowerCase().endsWith(type)),
      );

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);

      setFiles((prevFiles) => [...(prevFiles ?? []), ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const allFiles = files.map((file) => ({
      name: file.name,
      signatories: null,
      id: uuidv4(),
      status: Status.INITIAL,
    }));

    saveDocuments(allFiles);
  };

  return (
    <Box>
      <Toaster />
      <Box
        bg={dragActive ? "violet.500" : "gray.100"}
        borderColor={dragActive ? "blue.500" : "gray.500"}
        borderRadius="md"
        borderStyle="dashed"
        borderWidth={2}
        p={6}
        position="relative"
        textAlign="center"
        transition="all 0.3s"
        onClick={(e) => e.stopPropagation()}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Input
          multiple
          accept={ACCEPTED_FILE_TYPES.join(",")}
          height="100%"
          left="0"
          opacity="0"
          position="absolute"
          top="0"
          type="file"
          width="100%"
          onChange={handleChange}
        />
        <VStack gap={2}>
          <Icon color="blue.500" h={10} w={10}>
            <FileUp />
          </Icon>
          <Text fontWeight="bold">Drag and drop your files here</Text>
          <Text color="gray.500" fontSize="sm">
            or click to select a file
          </Text>
        </VStack>
      </Box>
      {files?.length > 0 && (
        <Box borderRadius="md" p={4}>
          <VStack align="start" gap={2}>
            <Text fontWeight="bold">Selected Files:</Text>
            <List.Root gap={2} listStyle="none" width="100%">
              {files.map((file, index) => (
                <List.Item key={index} fontSize="sm">
                  <HStack justifyContent="space-between">
                    <HStack>
                      <Icon color="blue.500" h={6} w={6}>
                        <FileType2 />
                      </Icon>
                      <Text truncate>{file.name}</Text>
                    </HStack>
                    <Icon color="red.500" h={4} w={4}>
                      <SquareX cursor="pointer" onClick={() => removeFile(index)} />
                    </Icon>
                  </HStack>
                </List.Item>
              ))}
            </List.Root>
          </VStack>
        </Box>
      )}
      <List.Root gap={2} listStyle="none" textAlign="center">
        <List.Item fontSize="sm" mt={4}>
          <Icon color="green.500" h={4} mr={2} w={4}>
            <CircleCheck />
          </Icon>
          Accepted file types: PDF, DOCX
        </List.Item>
      </List.Root>
      <HStack justifyContent="center">
        <Button
          colorScheme="blue"
          disabled={!files?.length || isLoading}
          mt={4}
          onClick={handleSubmit}
        >
          Upload Documents
        </Button>
      </HStack>
    </Box>
  );
}
