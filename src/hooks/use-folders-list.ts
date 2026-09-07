import { fetchFolders } from "@/lib/folders";
import { useQuery } from "@tanstack/react-query";

export function useFoldersList(parentFolderId: string | null) {
  return useQuery({
    queryKey: ["folders", parentFolderId ?? "root"],
    queryFn: () => fetchFolders(parentFolderId),
  });
}