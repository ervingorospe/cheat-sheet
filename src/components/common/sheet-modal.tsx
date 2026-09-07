import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { ScrollView, Sheet } from "tamagui";

type SheetModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function SheetModal({
  open,
  onClose,
  children,
}: SheetModalProps) {
  return (
    <Sheet
      modal
      open={open}
      onOpenChange={(nextOpen: boolean) => {
        if (!nextOpen) {
          onClose();
        }
      }}
      snapPoints={[80]}
      snapPointsMode="percent"
      dismissOnSnapToBottom
      dismissOnOverlayPress
      zIndex={100_000}
    >
      <Sheet.Overlay
        style={{
          backgroundColor: "transparent",
        }}
        transition="quick"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />

      <Sheet.Handle backgroundColor="$paper" />

      <Sheet.Frame flex={1} backgroundColor="$paper" borderRadius={20}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            flex={1}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: 20,
              paddingBottom: 40,
            }}
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </Sheet.Frame>
    </Sheet>
  );
}
