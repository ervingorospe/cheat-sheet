import { fetchRecentNotes } from "@/lib/notes";
import { useQuery } from "@tanstack/react-query";

export function useRecentNotes(limit: number = 5) {
  return useQuery({
    queryKey: ["notes", "recent", limit],
    queryFn: () => fetchRecentNotes(limit),
  });
}