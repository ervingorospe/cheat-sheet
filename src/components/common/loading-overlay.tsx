import { Button } from "@/components/theme";
import { Modal } from "react-native";
import { Spinner, Text, YStack } from "tamagui";

export type LoadingOverlayProps = {
  visible: boolean;
  message?: string;
  onCancel?: () => void;
  cancelLabel?: string;
};

export default function LoadingOverlay({
  visible,
  message = "",
  onCancel,
  cancelLabel = "Cancel",
}: LoadingOverlayProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <YStack
        flex={1}
        alignItems="center"
        justifyContent="center"
        backgroundColor="$background"
        padding="$xl"
      >
        <Spinner size="large" color="$primary" />

        <Text
          color="$textHeader"
          fontSize="$5"
          fontWeight="600"
          marginTop="$md"
          textAlign="center"
        >
          {message}
        </Text>

        {onCancel && (
          <YStack paddingHorizontal="$xl" paddingVertical="$sm">
            <Button marginTop="$xl" onPress={onCancel} variant="outline">
              {cancelLabel}
            </Button>
          </YStack>
        )}
      </YStack>
    </Modal>
  );
}
