import IconAction from "@/components/common/icon-action";
import CreateFolderDialog from "@/components/folders/create-folder-dialog";
import FolderCard from "@/components/folders/folder-card";
import Screen from "@/components/layout/screen";
import { SizableText } from "@/components/theme";
import { useFoldersList } from "@/hooks/use-folders-list";
import { FolderPlus } from "@tamagui/lucide-icons-2";
import { useCallback, useState } from "react";
import { FlatList } from "react-native";
import { XStack, YStack } from "tamagui";

export default function FolderScreen() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: folders, isLoading } = useFoldersList(null);

  const renderItem = useCallback(
    ({ item }: { item: NonNullable<typeof folders>[number] }) => (
      <FolderCard folder={item} />
    ),
    [],
  );

  return (
    <Screen>
      <XStack alignItems="center" justifyContent="flex-end">
        <IconAction
          key="add-folder"
          size="$2"
          icon={FolderPlus}
          onPress={() => setIsDialogOpen(true)}
        />
      </XStack>

      <FlatList
        style={{ paddingVertical: 20 }}
        data={folders ?? []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          !isLoading ? (
            <YStack alignItems="center" paddingTop="$xxl">
              <SizableText color="$secondary">No folders yet</SizableText>
            </YStack>
          ) : null
        }
      />

      <CreateFolderDialog
        visible={isDialogOpen}
        parentFolderId={null}
        onClose={() => setIsDialogOpen(false)}
      />
    </Screen>
  );
}
