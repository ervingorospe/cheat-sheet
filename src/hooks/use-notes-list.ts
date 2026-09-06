import { fetchNotesPage } from "@/lib/notes";
import { useInfiniteQuery } from "@tanstack/react-query";

export function notesQueryKey(folderId?: string | null) {
  return ["notes", folderId === undefined ? "all" : (folderId ?? "root")] as const;
}

export function useNotesList(folderId?: string | null) {
  return useInfiniteQuery({
    queryKey: notesQueryKey(folderId),
    queryFn: ({ pageParam }) => fetchNotesPage(pageParam, folderId),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}