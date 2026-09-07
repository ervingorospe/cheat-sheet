import { fetchFolderById } from "@/lib/folders";
import { useQuery } from "@tanstack/react-query";

export function useFolder(id: string) {
  return useQuery({
    queryKey: ["folders", "detail", id],
    queryFn: () => fetchFolderById(id),
    enabled: !!id,
  });
}