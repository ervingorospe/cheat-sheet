import SheetModal from "@/components/common/sheet-modal";
import { useMoveNote } from "@/hooks/use-move-note";
import { fetchFolders, Folder } from "@/lib/folders";
import { useToast } from "@/providers/toast-provider";
import {
  ChevronDown,
  ChevronRight,
  Folder as FolderIcon,
  Home,
} from "@tamagui/lucide-icons-2";
import { useQueries } from "@tanstack/react-query";
import { useState } from "react";
import { SizableText, Spinner, XStack, YStack } from "tamagui";

type MoveNoteSheetProps = {
  open: boolean;
  noteId: string;
  currentFolderId: string | null;
  onClose: () => void;
};

export default function MoveNoteSheet({
  open,
  noteId,
  currentFolderId,
  onClose,
}: MoveNoteSheetProps) {
  const { mutateAsync, isPending } = useMoveNote();
  const { showToast } = useToast();
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const parentIdsToFetch = [null, ...expandedIds];

  const queries = useQueries({
    queries: parentIdsToFetch.map((parentId) => ({
      queryKey: ["folders", parentId ?? "root"],
      queryFn: () => fetchFolders(parentId),
    })),
  });

  const foldersByParent: Record<string, Folder[] | undefined> = {};
  const loadingByParent: Record<string, boolean> = {};

  parentIdsToFetch.forEach((parentId, index) => {
    const key = parentId ?? "root";
    foldersByParent[key] = queries[index].data;
    loadingByParent[key] = queries[index].isLoading;
  });

  const toggleExpand = (folderId: string) => {
    setExpandedIds((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId],
    );
  };

  const handleSelect = async (folderId: string | null) => {
    if (folderId === currentFolderId) {
      onClose();
      return;
    }

    const result = await mutateAsync({ id: noteId, folderId });

    if (result.error) {
      showToast(result.error, "error");
      return;
    }

    showToast("Note moved.", "success");
    onClose();
  };

  return (
    <SheetModal open={open} onClose={onClose}>
      <YStack gap="$lg">
        <SizableText fontSize="$6" fontWeight="700">
          Move to Folder
        </SizableText>

        <YStack gap="$xs">
          <FolderPickerRow
            isRootOption
            depth={0}
            currentFolderId={currentFolderId}
            onSelect={handleSelect}
            disabled={isPending}
          />

          <FolderRows
            parentKey="root"
            depth={0}
            foldersByParent={foldersByParent}
            loadingByParent={loadingByParent}
            expandedIds={expandedIds}
            onToggleExpand={toggleExpand}
            currentFolderId={currentFolderId}
            onSelect={handleSelect}
            disabled={isPending}
          />
        </YStack>
      </YStack>
    </SheetModal>
  );
}

type FolderRowsProps = {
  parentKey: string;
  depth: number;
  foldersByParent: Record<string, Folder[] | undefined>;
  loadingByParent: Record<string, boolean>;
  expandedIds: string[];
  onToggleExpand: (folderId: string) => void;
  currentFolderId: string | null;
  onSelect: (folderId: string | null) => void;
  disabled: boolean;
};

function FolderRows({
  parentKey,
  depth,
  foldersByParent,
  loadingByParent,
  expandedIds,
  onToggleExpand,
  currentFolderId,
  onSelect,
  disabled,
}: FolderRowsProps) {
  const folders = foldersByParent[parentKey];
  const isLoading = loadingByParent[parentKey];

  if (isLoading) {
    return (
      <XStack paddingLeft={depth * 20 + 12} paddingVertical="$sm">
        <Spinner size="small" />
      </XStack>
    );
  }

  if (!folders || folders.length === 0) {
    return null;
  }

  return (
    <>
      {folders.map((folder) => {
        const isExpanded = expandedIds.includes(folder.id);

        return (
          <YStack key={folder.id}>
            <FolderPickerRow
              folder={folder}
              depth={depth}
              isExpanded={isExpanded}
              onToggleExpand={() => onToggleExpand(folder.id)}
              currentFolderId={currentFolderId}
              onSelect={onSelect}
              disabled={disabled}
            />

            {isExpanded && (
              <FolderRows
                parentKey={folder.id}
                depth={depth + 1}
                foldersByParent={foldersByParent}
                loadingByParent={loadingByParent}
                expandedIds={expandedIds}
                onToggleExpand={onToggleExpand}
                currentFolderId={currentFolderId}
                onSelect={onSelect}
                disabled={disabled}
              />
            )}
          </YStack>
        );
      })}
    </>
  );
}

type FolderPickerRowProps = {
  folder?: Folder;
  depth: number;
  isRootOption?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  currentFolderId: string | null;
  onSelect: (folderId: string | null) => void;
  disabled: boolean;
};

function FolderPickerRow({
  folder,
  depth,
  isRootOption = false,
  isExpanded = false,
  onToggleExpand,
  currentFolderId,
  onSelect,
  disabled,
}: FolderPickerRowProps) {
  const folderId = isRootOption ? null : folder!.id;
  const isCurrent = folderId === currentFolderId;
  const label = isRootOption ? "No Folder (Root)" : folder!.name;

  return (
    <XStack
      alignItems="center"
      gap="$sm"
      paddingVertical="$sm"
      paddingLeft={depth * 20}
      opacity={disabled ? 0.5 : 1}
    >
      {!isRootOption ? (
        <XStack padding="$xs" onPress={() => !disabled && onToggleExpand?.()}>
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </XStack>
      ) : (
        <XStack width={24} />
      )}

      <XStack
        flex={1}
        alignItems="center"
        gap="$sm"
        paddingVertical="$xs"
        onPress={() => !disabled && onSelect(folderId)}
      >
        {isRootOption ? (
          <Home size={18} color="$secondary" />
        ) : (
          <FolderIcon size={18} color="$primary" />
        )}

        <SizableText
          fontSize="$4"
          fontWeight={isCurrent ? "700" : "400"}
          color={isCurrent ? "$primary" : undefined}
        >
          {label}
          {isCurrent ? " (current)" : ""}
        </SizableText>
      </XStack>
    </XStack>
  );
}
