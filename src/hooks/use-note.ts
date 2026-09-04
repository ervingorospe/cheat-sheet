import { fetchNoteById } from "@/lib/notes";
import { useQuery } from "@tanstack/react-query";

export function useNote(id: string) {
  return useQuery({
    queryKey: ["notes", "detail", id],
    queryFn: () => fetchNoteById(id),
    enabled: !!id,
  });
}