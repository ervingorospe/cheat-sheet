import { deleteFolder, getFolderDeleteImpact } from "@/lib/folders";
import { useLoadingOverlay } from "@/providers/loading-overlay-provider";
import { useToast } from "@/providers/toast-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Alert } from "react-native";

type UseDeleteFolderOptions = {
  onDeleted: () => void;
};

export function useDeleteFolder(folderId: string, { onDeleted }: UseDeleteFolderOptions) {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { show: showLoading, hide: hideLoading } = useLoadingOverlay();
  const [isCheckingImpact, setIsCheckingImpact] = useState(false);

  const { mutate, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      showLoading({
        message: "Deleting folder...",
      });

      try {
        return await deleteFolder(folderId);
      } finally {
        hideLoading();
      }
    },
    onSuccess: (result) => {
      if (result.error) {
        showToast(result.error);
        return;
      }

      queryClient.removeQueries({ queryKey: ["folders", "detail", folderId] });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "folders" || query.queryKey[0] === "notes",
      });

      onDeleted();
    },
    onError: () => {
      showToast("Something went wrong. Please try again.");
    },
  });

  const confirmDeleteFolder = async () => {
    setIsCheckingImpact(true);
    const { folderCount, noteCount } = await getFolderDeleteImpact(folderId);
    setIsCheckingImpact(false);

    const parts: string[] = [];
    if (folderCount > 0) parts.push(`${folderCount} subfolder${folderCount === 1 ? "" : "s"}`);
    if (noteCount > 0) parts.push(`${noteCount} note${noteCount === 1 ? "" : "s"}`);

    const impactMessage =
      parts.length > 0
        ? `This will permanently delete this folder along with ${parts.join(" and ")}. This cannot be undone.`
        : "This folder is empty. Delete it?";

    Alert.alert("Delete Folder", impactMessage, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => mutate() },
    ]);
  };

  return { confirmDeleteFolder, isDeleting, isCheckingImpact };
}