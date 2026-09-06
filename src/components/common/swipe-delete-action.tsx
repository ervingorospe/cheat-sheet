import { Trash2 } from "@tamagui/lucide-icons-2";
import { XStack } from "tamagui";

type SwipeDeleteActionProps = {
  onPress: () => void;
  width?: number;
};

export default function SwipeDeleteAction({
  onPress,
  width = 72,
}: SwipeDeleteActionProps) {
  return (
    <XStack
      width={width}
      height="100%"
      alignItems="center"
      justifyContent="center"
      borderRadius="$md"
    >
      <XStack
        borderWidth={1}
        padding={10}
        borderRadius={100}
        borderColor="$error"
        backgroundColor="transparent"
        pressStyle={{ scale: 0.9, backgroundColor: "$error" }}
        transition="quick"
        onPress={onPress}
      >
        <Trash2 size={22} color="$error" />
      </XStack>
    </XStack>
  );
}
