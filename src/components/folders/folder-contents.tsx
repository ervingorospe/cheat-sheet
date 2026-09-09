import FolderCard from "@/components/folders/folder-card";
import NoteCard from "@/components/notes/note-card";
import { H4, SizableText } from "@/components/theme";
import { useFoldersList } from "@/hooks/use-folders-list";
import { useNotesList } from "@/hooks/use-notes-list";
import { Notebook } from "@tamagui/lucide-icons-2";
import { useCallback, useMemo } from "react";
import { FlatList } from "react-native";
import { Separator, Spinner, YStack } from "tamagui";
import NoteSearchTrigger from "../notes/note-search-trigger";
import FolderListSkeleton from "./folder-card-skeleton";

type ContentItem =
  | { type: "folder"; id: string; data: any }
  | { type: "folders-empty"; id: string }
  | { type: "notes-header"; id: string }
  | { type: "note"; id: string; data: any }
  | { type: "notes-empty"; id: string };

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

    const result: ContentItem[] = [];

    // Folders
    if (folderItems.length > 0) {
      result.push(...folderItems);
    } else if (noteItems.length > 0) {
      result.push({
        type: "folders-empty",
        id: "folders-empty",
      });
    }

    // Notes section
    if (noteItems.length > 0) {
      result.push({
        type: "notes-header",
        id: "notes-header",
      });

      result.push(...noteItems);
    } else if (folderItems.length > 0) {
      result.push({
        type: "notes-header",
        id: "notes-header",
      });

      result.push({
        type: "notes-empty",
        id: "notes-empty",
      });
    }

    return result;
  }, [folders, notes]);

  const renderItem = useCallback(
    ({ item }: { item: ContentItem }) => {
      if (item.type === "folders-empty") {
        return (
          <YStack alignItems="center">
            <SizableText color="$secondary">No folders found</SizableText>
          </YStack>
        );
      }

      if (item.type === "notes-header") {
        return (
          <YStack marginTop="$xxl">
            <H4 color="$secondary">
              <Notebook size="$1" color="$secondary" /> Notes
            </H4>
            <YStack flex={1} marginTop="$md">
              <NoteSearchTrigger />
            </YStack>
          </YStack>
        );
      }

      if (item.type === "notes-empty") {
        return (
          <YStack alignItems="center">
            <SizableText color="$secondary">No notes found</SizableText>
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
      style={{ paddingBottom: 20 }}
      data={items}
      keyExtractor={(item) => `${item.type}-${item.id}`}
      renderItem={renderItem}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={
        isFetchingNextPage ? (
          <YStack alignItems="center" paddingVertical="$md">
            <Spinner color="$primary" />
          </YStack>
        ) : null
      }
      ListEmptyComponent={
        <YStack alignItems="center" paddingTop="$xxl">
          <SizableText color="$secondary">This folder is empty</SizableText>
        </YStack>
      }
    />
  );
}
