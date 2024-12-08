import { HStack, Input, Button, Text } from "@chakra-ui/react";

interface SignatoriesFormProps {
  value: string;
  isError: boolean;
  onCancel: (val: boolean | null) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SignatoriesForm({
  isError,
  onSubmit,
  onChange,
  onCancel,
  value,
}: SignatoriesFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <Input placeholder="Insert emails" value={value} onChange={onChange} />
      {isError && (
        <Text color="red" ml={1} mt={1} textStyle="xs">
          Invalid format
        </Text>
      )}
      <HStack justifyContent="space-between" mt={4}>
        <Button
          bg="white"
          colorPalette="red"
          size="xs"
          variant="outline"
          onClick={() => onCancel(null)}
        >
          Cancel
        </Button>
        <Button size="xs" type="submit">
          Assign
        </Button>
      </HStack>
    </form>
  );
}
