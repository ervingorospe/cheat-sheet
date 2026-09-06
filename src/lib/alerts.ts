import { Alert } from "react-native";

type ConfirmDeleteOptions = {
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

export function confirmDelete({
  title = "Delete this item?",
  message = "This can't be undone.",
  onConfirm,
  onCancel,
}: ConfirmDeleteOptions): void {
  Alert.alert(
    title,
    message,
    [
      {
        text: "Cancel",
        style: "cancel",
        onPress: onCancel,
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: onConfirm,
      },
    ],
    { onDismiss: onCancel }
  );
}