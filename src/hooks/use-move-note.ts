import { moveNote } from "@/lib/notes";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useMoveNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, folderId }: { id: string; folderId: string | null }) => moveNote(id, folderId),
    onSuccess: (result, variables) => {
      if (result.data) {
        queryClient.setQueryData(["notes", "detail", variables.id], result.data);
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "notes" && query.queryKey[1] !== "detail",
        });
      }
    },
  });
}