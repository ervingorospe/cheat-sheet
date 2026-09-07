import BackButton from "@/components/common/back-button";
import IconAction from "@/components/common/icon-action";
import CreateFolderDialog from "@/components/folders/create-folder-dialog";
import FolderContents from "@/components/folders/folder-contents";
import Screen from "@/components/layout/screen";
import { SizableText } from "@/components/theme";
import { useFolder } from "@/hooks/use-folder";
import { FolderPlus } from "@tamagui/lucide-icons-2";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { XStack } from "tamagui";

export default function FolderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: folder } = useFolder(id);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Screen>
      <BackButton />

      <XStack
        alignItems="center"
        justifyContent="space-between"
        marginTop="$md"
      >
        <SizableText size="$6" fontWeight="600" numberOfLines={1}>
          {folder?.name ?? "Folder"}
        </SizableText>

        <IconAction
          key="add-folder"
          size="$2"
          icon={FolderPlus}
          onPress={() => setIsDialogOpen(true)}
        />
      </XStack>

      <FolderContents parentFolderId={id} />

      <CreateFolderDialog
        visible={isDialogOpen}
        parentFolderId={id}
        onClose={() => setIsDialogOpen(false)}
      />
    </Screen>
  );
}
