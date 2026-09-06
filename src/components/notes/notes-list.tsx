import NoteCard from "@/components/notes/note-card";
import NoteCardSkeleton from "@/components/notes/note-card-skeleton";
import { SizableText } from "@/components/theme";
import { useNotesList } from "@/hooks/use-notes-list";
import { NoteListItem } from "@/lib/notes";
import { useCallback, useMemo } from "react";
import { FlatList, ListRenderItemInfo } from "react-native";
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

  const notes = useMemo(
    () => data?.pages.flatMap((page) => page.notes) ?? [],
    [data],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<NoteListItem>) => (
      <NoteCard note={item} folderId={folderId} />
    ),
    [folderId],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <YStack paddingVertical="$lg">
        {Array.from({ length: 3 }).map((_, index) => (
          <NoteCardSkeleton key={index} />
        ))}
      </YStack>
    );
  }

  return (
    <FlatList
      style={{ paddingVertical: 20 }}
      data={notes}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? <Spinner color="$primary" /> : null
      }
      ListEmptyComponent={
        <YStack alignItems="center" paddingTop="$xxl">
          <SizableText color="$secondary">{emptyMessage}</SizableText>
        </YStack>
      }
    />
  );
}
