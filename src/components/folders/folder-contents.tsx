import FolderCard from "@/components/folders/folder-card";
import NoteCard from "@/components/notes/note-card";
import { SizableText } from "@/components/theme";
import { useFoldersList } from "@/hooks/use-folders-list";
import { useNotesList } from "@/hooks/use-notes-list";
import { useCallback, useMemo } from "react";
import { FlatList } from "react-native";
import { Spinner, YStack } from "tamagui";

type ContentItem =
  | { type: "folder"; id: string; data: any }
  | { type: "note"; id: string; data: any };

export default function FolderContents({
  parentFolderId,
}: {
  parentFolderId: string | null;
}) {
  const { data: folders, isLoading: foldersLoading } =
    useFoldersList(parentFolderId);
  const {
    data: notesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: notesLoading,
  } = useNotesList(parentFolderId);

  const notes = useMemo(
    () => notesData?.pages.flatMap((page) => page.notes) ?? [],
    [notesData],
  );

  const items = useMemo<ContentItem[]>(() => {
    const folderItems: ContentItem[] = (folders ?? []).map((f) => ({
      type: "folder",
      id: f.id,
      data: f,
    }));
    const noteItems: ContentItem[] = notes.map((n) => ({
      type: "note",
      id: n.id,
      data: n,
    }));
    return [...folderItems, ...noteItems];
  }, [folders, notes]);

  const renderItem = useCallback(({ item }: { item: ContentItem }) => {
    return item.type === "folder" ? (
      <FolderCard folder={item.data} />
    ) : (
      <NoteCard note={item.data} />
    );
  }, []);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const isLoading = foldersLoading || notesLoading;

  return (
    <FlatList
      style={{ paddingVertical: 20 }}
      data={items}
      keyExtractor={(item) => `${item.type}-${item.id}`}
      renderItem={renderItem}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        isFetchingNextPage ? <Spinner color="$primary" /> : null
      }
      ListEmptyComponent={
        !isLoading ? (
          <YStack alignItems="center" paddingTop="$xxl">
            <SizableText color="$secondary">This folder is empty</SizableText>
          </YStack>
        ) : null
      }
    />
  );
}
