import IconAction from "@/components/common/icon-action";
import CreateFolderSheet from "@/components/folders/create-folder-sheet";
import FolderCard from "@/components/folders/folder-card";
import FolderListSkeleton from "@/components/folders/folder-card-skeleton";
import Screen from "@/components/layout/screen";
import { SizableText } from "@/components/theme";
import { useFoldersList } from "@/hooks/use-folders-list";
import { FolderPlus } from "@tamagui/lucide-icons-2";
import { useCallback, useState } from "react";
import { FlatList } from "react-native";
import { XStack, YStack } from "tamagui";

export default function FolderScreen() {
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);

  const { data: folders, isLoading } = useFoldersList(null);

  const renderItem = useCallback(
    ({ item }: { item: NonNullable<typeof folders>[number] }) => (
      <FolderCard folder={item} />
    ),
    [],
  );

  if (isLoading) {
    return (
      <YStack paddingHorizontal={10} marginTop={20}>
        <FolderListSkeleton />
      </YStack>
    );
  }

  return (
    <Screen>
      <XStack alignItems="center" justifyContent="flex-end" paddingBottom="$sm">
        <IconAction
          size="$2"
          icon={FolderPlus}
          onPress={() => setIsCreateSheetOpen(true)}
        />
      </XStack>

      <FlatList
        data={folders ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <XStack height={1} backgroundColor="$paper" />
        )}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading ? (
            <YStack alignItems="center" paddingTop="$xxl">
              <SizableText color="$secondary">No folders yet</SizableText>
            </YStack>
          ) : null
        }
      />

      <CreateFolderSheet
        open={isCreateSheetOpen}
        parentFolderId={null}
        onClose={() => setIsCreateSheetOpen(false)}
      />
    </Screen>
  );
}
