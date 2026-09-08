import IconAction from "@/components/common/icon-action";
import CreateFolderSheet from "@/components/folders/create-folder-sheet";
import EditFolderSheet from "@/components/folders/edit-folder-sheet";
import FolderContents from "@/components/folders/folder-contents";
import ExpandableAction from "@/components/layout/expandable-action";
import Screen from "@/components/layout/screen";
import { SizableText } from "@/components/theme";
import { useFolder } from "@/hooks/use-folder";
import { FolderPlus, Home, Pencil } from "@tamagui/lucide-icons-2";
import { Link, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { XStack, YStack } from "tamagui";

export default function FolderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: folder } = useFolder(id);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  return (
    <Screen>
      <XStack
        alignItems="center"
        justifyContent="space-between"
        marginTop="$md"
        paddingBottom="$md"
      >
        <SizableText fontSize="$6" fontWeight="600" numberOfLines={1}>
          {folder?.name ?? "Folder"}
        </SizableText>

        <XStack>
          <IconAction
            key="edit-folder"
            size="$1"
            icon={Pencil}
            onPress={() => setIsEditSheetOpen(true)}
          />

          <IconAction
            key="add-folder"
            size="$1"
            icon={FolderPlus}
            onPress={() => setIsCreateSheetOpen(true)}
          />
        </XStack>
      </XStack>

      <FolderContents parentFolderId={id} />

      <CreateFolderSheet
        open={isCreateSheetOpen}
        parentFolderId={id}
        onClose={() => setIsCreateSheetOpen(false)}
      />

      {folder && (
        <EditFolderSheet
          open={isEditSheetOpen}
          folderId={id}
          currentName={folder.name}
          onClose={() => setIsEditSheetOpen(false)}
        />
      )}

      <YStack position="absolute" width="100%" bottom="$xl" right="$xl">
        <XStack paddingLeft={10} width="100%" justifyContent="space-between">
          <Link href="/" asChild>
            <YStack
              padding="15"
              borderRadius={100}
              backgroundColor="$paperVariant"
              transition="quick"
              pressStyle={{ scale: 0.9 }}
            >
              <Home size="$1" color="$secondary" />
            </YStack>
          </Link>

          <XStack marginBottom="$-4">
            <ExpandableAction folderId={id} />
          </XStack>
        </XStack>
      </YStack>
    </Screen>
  );
}
