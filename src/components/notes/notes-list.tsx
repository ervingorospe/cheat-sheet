import NoteCard from "@/components/notes/note-card";
import { SizableText } from "@/components/theme";
import { useNotesList } from "@/hooks/use-notes-list";
import { FlatList } from "react-native";
import { Spinner, YStack } from "tamagui";

type NotesListProps = {
  folderId?: string | null;
  emptyMessage?: string;
};

export default function NotesList({
  folderId,
  emptyMessage = "No notes yet",
}: NotesListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useNotesList(folderId);

  const notes = data?.pages.flatMap((page) => page.notes) ?? [];

  return (
    <FlatList
      style={{
        paddingVertical: 20,
      }}
      data={notes}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <NoteCard note={item} />}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? <Spinner color="$primary" /> : null
      }
      ListEmptyComponent={
        !isLoading ? (
          <YStack alignItems="center" paddingTop="$xxl">
            <SizableText color="$secondary">{emptyMessage}</SizableText>
          </YStack>
        ) : null
      }
    />
  );
}
