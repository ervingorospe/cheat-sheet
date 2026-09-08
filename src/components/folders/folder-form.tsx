import Form from "@/components/common/form";
import { Button } from "@/components/theme";
import { FolderFormValues, folderSchema } from "@/schema/folders/folder.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "@tamagui/lucide-icons-2";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Spinner, XStack } from "tamagui";

type FolderFormProps = {
  open: boolean;
  defaultValues?: Partial<FolderFormValues>;
  isSubmitting?: boolean;
  onSubmit: (values: FolderFormValues) => void | Promise<void>;
  onCancel: () => void;
};

const capitalizeWords = (value: string) =>
  value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

export default function FolderForm({
  open,
  defaultValues,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: FolderFormProps) {
  const { control, handleSubmit, reset } = useForm<FolderFormValues>({
    resolver: zodResolver(folderSchema),
    defaultValues: {
      name: "",
      ...defaultValues,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (!open) {
      reset({
        name: "",
        ...defaultValues,
      });
    }
  }, [open, defaultValues, reset]);

  const handleFolderSubmit = (values: FolderFormValues) => {
    onSubmit({
      ...values,
      name: capitalizeWords(values.name.trim()),
    });
  };

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
            onPress={handleSubmit(handleFolderSubmit)}
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
        maxLength={18}
      />
    </Form>
  );
}
