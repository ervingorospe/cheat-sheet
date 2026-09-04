import { BackdropProps } from "@/types/common/backdrop.type";
import { YStack } from "tamagui";

export default function Backdrop({
  isVisible,
  onPress,
  backgroundColor = "transparent",
}: BackdropProps) {
  if (!isVisible) return null;

  return (
    <YStack
      position="absolute"
      top={-1000}
      left={-1000}
      right={-1000}
      bottom={-1000}
      backgroundColor={backgroundColor}
      onPress={onPress}
    />
  );
}
