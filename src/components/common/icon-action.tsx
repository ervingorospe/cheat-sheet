import { IconActionProps } from "@/types/common/icon-action.type";
import { XStack } from "tamagui";

export default function IconAction({
  onPress,
  width = 60,
  color = "$primary",
  icon: Icon,
  size = 22,
}: IconActionProps) {
  return (
    <XStack
      width={width}
      height="100%"
      alignItems="center"
      justifyContent="center"
    >
      <XStack
        borderWidth={1}
        borderColor={color}
        borderRadius={100}
        padding={7}
        backgroundColor="transparent"
        pressStyle={{ scale: 0.9, backgroundColor: color }}
        transition="quick"
        onPress={onPress}
      >
        <Icon size={size} color={color} />
      </XStack>
    </XStack>
  );
}
