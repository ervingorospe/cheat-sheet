import { getFoldersCount } from "@/lib/folders";
import { getNotesCount } from "@/lib/notes";
import { useQuery } from "@tanstack/react-query";

export function useHomeStats() {
  return useQuery({
    queryKey: ["home", "stats"],
    queryFn: async () => {
      const [notesCount, foldersCount] = await Promise.all([getNotesCount(), getFoldersCount()]);
      return { notesCount, foldersCount };
    },
  });
}