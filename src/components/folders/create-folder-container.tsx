import FolderSheet from "@/components/folders/folder-sheet";
import { useCreateFolder } from "@/hooks/use-create-folder";
import { useToast } from "@/providers/toast-provider";
import { FolderFormValues } from "@/schema/folders/folder.schema";

type CreateFolderSheetProps = {
  open: boolean;
  parentFolderId: string | null;
  onClose: () => void;
};

export default function CreateFolderSheet({
  open,
  parentFolderId,
  onClose,
}: CreateFolderSheetProps) {
  const { mutateAsync, isPending } = useCreateFolder();
  const { showToast } = useToast();

  const handleSubmit = async (values: FolderFormValues) => {
    const result = await mutateAsync({
      name: values.name,
      parentFolderId,
    });

    if (result.error) {
      showToast(result.error);
      return;
    }

    onClose();
  };

  return (
    <FolderSheet
      open={open}
      title="New Folder"
      isSubmitting={isPending}
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  );
}
