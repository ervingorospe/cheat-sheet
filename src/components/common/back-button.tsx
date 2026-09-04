import { ArrowLeft } from "@tamagui/lucide-icons-2";
import { router } from "expo-router";
import { XStack } from "tamagui";

export default function BackButton() {
  return (
    <XStack
      width="$4"
      height="$4"
      alignItems="center"
      justifyContent="center"
      pressStyle={{
        opacity: 0.6,
        scale: 0.95,
      }}
      marginLeft="$-3"
      onPress={() => router.back()}
    >
      <ArrowLeft size="$1" color="$primary" />
    </XStack>
  );
}
