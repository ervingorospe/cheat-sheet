import { fetchFolderById } from "@/lib/folders";
import { useQuery } from "@tanstack/react-query";

export function useNoteFolder(folderId: string | null) {
  return useQuery({
    queryKey: ["folders", "detail", folderId],
    queryFn: () => fetchFolderById(folderId as string),
    enabled: !!folderId,
  });
}