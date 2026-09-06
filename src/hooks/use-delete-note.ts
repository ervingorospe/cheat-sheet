import { confirmDelete } from "@/lib/alerts";
import { deleteNote } from "@/lib/notes";
import { useLoadingOverlay } from "@/providers/loading-overlay-provider";
import { useToast } from "@/providers/toast-provider";
import { useMutation } from "@tanstack/react-query";

type UseDeleteNoteOptions = {
  onDeleted: () => void;
};

export function useDeleteNote(noteId: string, { onDeleted }: UseDeleteNoteOptions) {
  const { showToast } = useToast();
  const { show: showLoading, hide: hideLoading } = useLoadingOverlay();

  const { mutate: deleteNoteMutation, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteNote(noteId),
    onMutate: () => {
      showLoading({ message: "Deleting note..." });
    },
    onSuccess: (result) => {
      if (result.error) {
        showToast(result.error);
        return;
      }
      onDeleted();
    },
    onError: () => {
      showToast("Something went wrong. Please try again.");
    },
    onSettled: () => {
      hideLoading();
    },
  });

  const handleDelete = () => {
    confirmDelete({
      title: "Delete note?",
      onConfirm: () => deleteNoteMutation(),
    });
  };

  return { handleDelete, isDeleting };
}