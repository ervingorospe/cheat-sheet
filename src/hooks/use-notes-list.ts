import { fetchNotesPage } from "@/lib/notes";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useNotesList(folderId?: string | null) {
  return useInfiniteQuery({
    queryKey: ["notes", folderId === undefined ? "all" : (folderId ?? "root")],
    queryFn: ({ pageParam }) => fetchNotesPage(pageParam, folderId),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}