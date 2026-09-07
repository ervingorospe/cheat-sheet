import { Button } from "@/components/theme";
import { useCreateFolder } from "@/hooks/use-create-folder";
import { useToast } from "@/providers/toast-provider";
import { useState } from "react";
import { Modal } from "react-native";
import { Input, SizableText, YStack } from "tamagui";

type CreateFolderDialogProps = {
  visible: boolean;
  parentFolderId: string | null;
  onClose: () => void;
};

export default function CreateFolderDialog({
  visible,
  parentFolderId,
  onClose,
}: CreateFolderDialogProps) {
  const [name, setName] = useState("");
  const { mutateAsync, isPending } = useCreateFolder();
  const { showToast } = useToast();

  const handleCreate = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const result = await mutateAsync({ name: trimmedName, parentFolderId });

    if (result.error) {
      showToast(result.error);
      return;
    }

    setName("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="rgba(0,0,0,0.65)"
        padding="$xl"
      >
        <YStack
          backgroundColor="$background"
          borderRadius="$md"
          padding="$lg"
          width="100%"
          gap="$md"
        >
          <SizableText fontSize="$5" fontWeight="700">
            New Folder
          </SizableText>

          <Input
            value={name}
            onChangeText={setName}
            placeholder="Folder name"
            autoFocus
          />

          <YStack
            flexDirection="row"
            gap="$sm"
            justifyContent="flex-end"
            marginTop="$sm"
          >
            <Button variant="text" onPress={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button onPress={handleCreate} disabled={isPending || !name.trim()}>
              {isPending ? "Creating..." : "Create"}
            </Button>
          </YStack>
        </YStack>
      </YStack>
    </Modal>
  );
}
