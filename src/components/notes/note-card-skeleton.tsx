import { Paper } from "@/components/theme";
import { useSkeletonPulse } from "@/hooks/use-skeleton-pulse";
import { Animated } from "react-native";
import { YStack } from "tamagui";

export default function NoteCardSkeleton() {
  const opacity = useSkeletonPulse();

  return (
    <Animated.View style={{ opacity }}>
      <Paper marginBottom="$sm">
        <YStack paddingVertical="$sm" gap="$md">
          {/* Title */}
          <YStack
            height={20}
            width="70%"
            borderRadius="$sm"
            backgroundColor="$paperVariant"
          />

          {/* Content */}
          <YStack gap="$sm">
            <YStack
              height={16}
              width="100%"
              borderRadius="$sm"
              backgroundColor="$paperVariant"
            />

            <YStack
              height={16}
              width="85%"
              borderRadius="$sm"
              backgroundColor="$paperVariant"
            />
          </YStack>

          {/* Date */}
          <YStack
            height={12}
            width="25%"
            borderRadius="$sm"
            backgroundColor="$paperVariant"
          />
        </YStack>
      </Paper>
    </Animated.View>
  );
}
