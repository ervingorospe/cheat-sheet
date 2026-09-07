import IconAction from "@/components/common/icon-action";
import CreateFolderSheet from "@/components/folders/create-folder-container";
import FolderContents from "@/components/folders/folder-contents";
import Screen from "@/components/layout/screen";
import { useFolder } from "@/hooks/use-folder";
import { FolderPlus } from "@tamagui/lucide-icons-2";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { XStack } from "tamagui";

export default function FolderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: folder } = useFolder(id);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);

  return (
    <Screen>
      <XStack alignItems="center" justifyContent="flex-end" marginTop="$md">
        <IconAction
          key="add-folder"
          size="$2"
          icon={FolderPlus}
          onPress={() => setIsCreateSheetOpen(true)}
        />
      </XStack>

      <FolderContents parentFolderId={id} />

      <CreateFolderSheet
        open={isCreateSheetOpen}
        parentFolderId={id}
        onClose={() => setIsCreateSheetOpen(false)}
      />
    </Screen>
  );
}
