import { createFolder } from "@/lib/folders";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, parentFolderId }: { name: string; parentFolderId: string | null }) =>
      createFolder(name, parentFolderId),
    onSuccess: (result, variables) => {
      if (result.data) {
        queryClient.invalidateQueries({ queryKey: ["folders", variables.parentFolderId ?? "root"] });
      }
    },
  });
}