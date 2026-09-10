import NoteCard from "@/components/notes/note-card";
import NoteCardSkeleton from "@/components/notes/note-card-skeleton";
import { SizableText } from "@/components/theme";
import { useRecentNotes } from "@/hooks/use-recent-notes";
import { Link } from "expo-router";
import { XStack, YStack } from "tamagui";

export default function RecentNotesSection() {
  const { data: notes, isLoading } = useRecentNotes(5);

  if (!isLoading && (!notes || notes.length === 0)) {
    return null;
  }

  return (
    <YStack marginBottom="$xl">
      <XStack
        justifyContent="space-between"
        alignItems="center"
        marginBottom="$sm"
      >
        <SizableText fontSize="$5" fontWeight="700">
          Recent Notes
        </SizableText>

        <Link href="/(tabs)/library" asChild>
          <SizableText color="$primary" fontWeight="600">
            See all
          </SizableText>
        </Link>
      </XStack>

      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <NoteCardSkeleton key={index} />
          ))
        : notes!.map((note) => <NoteCard key={note.id} note={note} />)}
    </YStack>
  );
}
