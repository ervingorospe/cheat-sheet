import FolderCard from "@/components/folders/folder-card";
import NoteCard from "@/components/notes/note-card";
import { H4, SizableText } from "@/components/theme";
import { useFoldersList } from "@/hooks/use-folders-list";
import { useNotesList } from "@/hooks/use-notes-list";
import { Notebook } from "@tamagui/lucide-icons-2";
import { useCallback, useMemo } from "react";
import { FlatList } from "react-native";
import { Separator, Spinner, YStack } from "tamagui";
import FolderListSkeleton from "./folder-card-skeleton";

type ContentItem =
  | { type: "folder"; id: string; data: any }
  | { type: "notes-header"; id: string }
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
    const folderItems: ContentItem[] = (folders ?? []).map((folder) => ({
      type: "folder",
      id: folder.id,
      data: folder,
    }));

    const noteItems: ContentItem[] = notes.map((note) => ({
      type: "note",
      id: note.id,
      data: note,
    }));

    return [
      ...folderItems,
      ...(noteItems.length > 0
        ? [{ type: "notes-header", id: "notes-header" } as ContentItem]
        : []),
      ...noteItems,
    ];
  }, [folders, notes]);

  const renderItem = useCallback(
    ({ item }: { item: ContentItem }) => {
      if (item.type === "notes-header") {
        return (
          <YStack marginTop="$xxl" marginBottom="$lg">
            <H4 color="$secondary">
              <Notebook size="$1" color="$secondary" /> Notes
            </H4>
          </YStack>
        );
      }

      if (item.type === "folder") {
        const lastFolderId = folders?.[folders.length - 1]?.id;
        const isLastFolder = item.id === lastFolderId;

        return (
          <YStack>
            <FolderCard folder={item.data} />

            {!isLastFolder && (
              <Separator borderColor="$paper" marginVertical="$sm" />
            )}
          </YStack>
        );
      }

      return (
        <YStack>
          <NoteCard note={item.data} />
        </YStack>
      );
    },
    [folders],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const isLoading = foldersLoading || notesLoading;

  if (isLoading) {
    return <FolderListSkeleton />;
  }

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
        <YStack alignItems="center" paddingTop="$xxl">
          <SizableText color="$secondary">This folder is empty</SizableText>
        </YStack>
      }
    />
  );
}
