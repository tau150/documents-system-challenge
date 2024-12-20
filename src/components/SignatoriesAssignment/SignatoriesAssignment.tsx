import { useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import { validateEmailArray } from "./SignatoriesAssignment.utils";
import { SignatoriesForm } from "./components/SignatoriesForm";
import { useService } from "@/hooks";
import { API } from "@/services/documentsApi";
import { MAILER } from "@/services/mailerApi";
import { Toaster } from "@/components/ui/toaster";
import { Document } from "@/domain";
import { notifySuccess, notifyError } from "@/utils/notify";
interface SignatoriesAssignmentProps {
  document: { name: string; id: string };
  inline?: boolean;
  onCancel: (value: boolean | null) => void;
  setDocument: (doc: null) => void;
  onAssign?: (doc: Document) => void;
}

export function SignatoriesAssignment({
  document,
  inline = false,
  setDocument,
  onCancel,
  onAssign,
}: SignatoriesAssignmentProps) {
  const [inputValue, setInputValue] = useState("");
  const [isValidationError, setIsValidationError] = useState(false);
  const { callRequest: assignSignatories } = useService<Document>(API.assignSignatories, {
    callOnLoad: false,
    onSuccess: async (res) => {
      notifySuccess("Signatories assigned to the document");
      try {
        if (res?.signatories?.[0]) {
          // For testing purposes I am sending the email, just to the first signer
          await MAILER.sendEmail(res.id, res?.signatories[0]);
        }
      } catch (_e) {
        notifyError("There was an issue sending the email");
      }
      onAssign?.(res);
      setTimeout(() => {
        setDocument(null);
      }, 1000);
    },
    onError: () => notifyError("Error assigning signatories to the document"),
  });

  const handleSubmitAssignment = (signatories: string[]) => {
    assignSignatories(document.id, signatories);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emails = inputValue.trim().split(",");

    const isSuccess = validateEmailArray(emails);

    if (!isSuccess) {
      setIsValidationError(true);

      return;
    }

    handleSubmitAssignment(emails);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    if (e.target.value === "") {
      setIsValidationError(false);
    }
  };

  if (inline) {
    return (
      <>
        <Toaster />
        <SignatoriesForm
          isError={isValidationError}
          value={inputValue}
          onCancel={onCancel}
          onChange={handleOnChange}
          onSubmit={handleSubmit}
        />
      </>
    );
  }

  return (
    <Box mt={4}>
      <Toaster />
      <Text mb={2}>{`Assign signatories to:`}</Text>
      <Text fontWeight="bold">{document.name}</Text>
      <Text fontWeight="light" mt={2} textStyle="xs">
        Separate signatories email by coma without spaces
      </Text>
      <Box mt={4}>
        <SignatoriesForm
          isError={isValidationError}
          value={inputValue}
          onCancel={onCancel}
          onChange={handleOnChange}
          onSubmit={handleSubmit}
        />
      </Box>
    </Box>
  );
}
