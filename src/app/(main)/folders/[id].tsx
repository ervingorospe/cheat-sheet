import CreateFolderSheet from "@/components/folders/create-folder-sheet";
import EditFolderSheet from "@/components/folders/edit-folder-sheet";
import FolderContents from "@/components/folders/folder-contents";
import ExpandableAction from "@/components/layout/expandable-action";
import Screen from "@/components/layout/screen";
import { Button, SizableText } from "@/components/theme";
import { useDeleteFolder } from "@/hooks/use-delete-folder";
import { useFolder } from "@/hooks/use-folder";
import { FolderPlus, Home, Pencil, Trash2 } from "@tamagui/lucide-icons-2";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Spinner, XStack, YStack } from "tamagui";

export default function FolderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: folder } = useFolder(id);
  const router = useRouter();
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  const { confirmDeleteFolder, isDeleting, isCheckingImpact } = useDeleteFolder(
    id,
    {
      onDeleted: () => router.back(),
    },
  );

  const isBusyDeleting = isDeleting || isCheckingImpact;

  return (
    <Screen>
      <XStack justifyContent="space-between" alignItems="center">
        <Button
          variant="text"
          key="delete-folder"
          icon={
            isBusyDeleting ? (
              <Spinner color="$error" />
            ) : (
              <Trash2 size="$1" color="$error" />
            )
          }
          color="$error"
          onPress={confirmDeleteFolder}
          disabled={isBusyDeleting}
        >
          {isBusyDeleting ? "Deleting..." : "Delete"}
        </Button>

        <XStack gap="$xl">
          <Button
            variant="text"
            icon={<Pencil size="$1" />}
            onPress={() => setIsEditSheetOpen(true)}
            disabled={isBusyDeleting}
          >
            Edit
          </Button>

          <Button
            variant="text"
            color="$primary"
            icon={<FolderPlus size="$1" />}
            onPress={() => setIsCreateSheetOpen(true)}
            disabled={isBusyDeleting}
          >
            Folder
          </Button>
        </XStack>
      </XStack>
      <XStack marginTop="$md">
        <SizableText fontSize="$6" fontWeight="600" numberOfLines={1}>
          {folder?.name ?? "Folder"}
        </SizableText>
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

      <YStack position="absolute" bottom="$xl" width="100%" right="$xl">
        <XStack width="100%" justifyContent="space-between">
          <Link href="/" asChild>
            <XStack
              backgroundColor="$paperVariant"
              borderRadius={100}
              padding={13}
              pressStyle={{ scale: 0.9 }}
            >
              <Home size="$1.5" color="$secondary" />
            </XStack>
          </Link>

          <XStack marginBottom="$-5">
            <ExpandableAction folderId={id} />
          </XStack>
        </XStack>
      </YStack>
    </Screen>
  );
}
