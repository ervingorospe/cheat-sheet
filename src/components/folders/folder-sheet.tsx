import SheetModal from "@/components/common/sheet-modal";
import FolderForm from "@/components/folders/folder-form";
import { FolderFormValues } from "@/schema/folders/folder.schema";
import { SizableText, YStack } from "tamagui";

type FolderSheetProps = {
  open: boolean;
  title: string;
  defaultValues?: Partial<FolderFormValues>;
  isSubmitting?: boolean;
  onSubmit: (values: FolderFormValues) => void | Promise<void>;
  onClose: () => void;
};

export default function FolderSheet({
  open,
  title,
  defaultValues,
  isSubmitting = false,
  onSubmit,
  onClose,
}: FolderSheetProps) {
  return (
    <SheetModal open={open} onClose={onClose}>
      <YStack gap="$lg" paddingHorizontal={15} marginTop={20}>
        <SizableText fontSize="$6" fontWeight="$7">
          {title}
        </SizableText>

        <FolderForm
          defaultValues={defaultValues}
          isSubmitting={isSubmitting}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </YStack>
    </SheetModal>
  );
}
