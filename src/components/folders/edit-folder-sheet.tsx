import FolderSheet from "@/components/folders/folder-sheet";
import { useUpdateFolder } from "@/hooks/use-update-folder";
import { useToast } from "@/providers/toast-provider";
import { FolderFormValues } from "@/schema/folders/folder.schema";

type EditFolderSheetProps = {
  open: boolean;
  folderId: string;
  currentName: string;
  onClose: () => void;
};

export default function EditFolderSheet({
  open,
  folderId,
  currentName,
  onClose,
}: EditFolderSheetProps) {
  const { mutateAsync, isPending } = useUpdateFolder();
  const { showToast } = useToast();

  const handleSubmit = async (values: FolderFormValues) => {
    if (values.name.trim() === currentName) {
      onClose();
      return;
    }

    const result = await mutateAsync({
      id: folderId,
      name: values.name,
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
      title="Edit Folder"
      defaultValues={{ name: currentName }}
      isSubmitting={isPending}
      onSubmit={handleSubmit}
      onClose={onClose}
    />
  );
}
