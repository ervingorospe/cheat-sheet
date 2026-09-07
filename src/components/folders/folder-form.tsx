import Form from "@/components/common/form";
import { Button } from "@/components/theme";
import { FolderFormValues, folderSchema } from "@/schema/folders/folder.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "@tamagui/lucide-icons-2";
import { useForm } from "react-hook-form";
import { Spinner, XStack } from "tamagui";

type FolderFormProps = {
  defaultValues?: Partial<FolderFormValues>;
  isSubmitting?: boolean;
  onSubmit: (values: FolderFormValues) => void | Promise<void>;
  onCancel: () => void;
};

export default function FolderForm({
  defaultValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: FolderFormProps) {
  const { control, handleSubmit } = useForm<FolderFormValues>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      name: "",
      ...defaultValues,
    },
    mode: "onChange",
  });

  return (
    <Form
      actions={
        <XStack marginTop={10} justifyContent="flex-end" gap="$lg">
          <Button
            variant="text"
            onPress={onCancel}
            disabled={isSubmitting}
            icon={<X size="$1" />}
            opacity={isSubmitting ? 0.5 : 1}
          >
            Cancel
          </Button>

          <Button
            icon={isSubmitting ? <Spinner size="small" /> : <Check size="$1" />}
            onPress={handleSubmit(onSubmit)}
            opacity={isSubmitting ? 0.5 : 1}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </XStack>
      }
    >
      <Form.Input
        name="name"
        control={control}
        label="Folder name"
        placeholder="e.g. React Native"
        autoFocus
        returnKeyType="done"
      />
    </Form>
  );
}
