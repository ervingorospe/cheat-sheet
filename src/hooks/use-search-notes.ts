import { searchNotes } from "@/lib/notes";
import { useQuery } from "@tanstack/react-query";

const MIN_QUERY_LENGTH = 3;

export function useSearchNotes(query: string) {
  const trimmed = query.trim();

  return useQuery({
    queryKey: ["notes", "search", trimmed],
    queryFn: () => searchNotes(trimmed),
    enabled: trimmed.length >= MIN_QUERY_LENGTH,
  });
}