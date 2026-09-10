import { H3, Paragraph } from "@/components/theme";
import { Sparkles } from "@tamagui/lucide-icons-2";
import { YStack } from "tamagui";

export default function EmptyHomeState() {
  return (
    <YStack alignItems="center" paddingTop="$xxl" gap="$sm">
      <Sparkles size={40} color="$primary" />
      <H3 textAlign="center">Capture your first note</H3>
      <Paragraph color="$secondary" textAlign="center" paddingHorizontal="$xl">
        Snap a photo, upload an image, or record a video — I'll turn it into
        organized notes automatically. Tap the + button to get started.
      </Paragraph>
    </YStack>
  );
}
