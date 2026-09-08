import { updateFolder } from "@/lib/folders";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateFolder(id, name),
    onSuccess: (result, variables) => {
      if (result.data) {
        queryClient.setQueryData(["folders", "detail", variables.id], result.data);
        queryClient.invalidateQueries({
          predicate: (query) => query.queryKey[0] === "folders" && query.queryKey[1] !== "detail",
        });
      }
    },
  });
}