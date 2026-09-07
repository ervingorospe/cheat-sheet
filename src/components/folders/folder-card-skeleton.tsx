import { useSkeletonPulse } from "@/hooks/use-skeleton-pulse";
import { Animated } from "react-native";
import { XStack, YStack } from "tamagui";

const SKELETON_COUNT = 6;

export default function FolderListSkeleton() {
  const opacity = useSkeletonPulse();

  return (
    <Animated.View style={{ opacity }}>
      <YStack>
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <YStack key={index}>
            <XStack
              alignItems="center"
              justifyContent="space-between"
              paddingVertical="$md"
            >
              {/* Folder icon + name */}
              <XStack alignItems="center" gap="$md" flex={1}>
                {/* Folder icon */}
                <YStack
                  width={24}
                  height={24}
                  borderRadius="$sm"
                  backgroundColor="$paper"
                />

                {/* Folder name */}
                <YStack
                  height={16}
                  width={`${45 + (index % 3) * 10}%`}
                  borderRadius="$sm"
                  backgroundColor="$paper"
                />
              </XStack>

              {/* Chevron */}
              <YStack
                width={16}
                height={16}
                borderRadius="$sm"
                backgroundColor="$paper"
                opacity={0.5}
              />
            </XStack>

            {/* Separator — don't render after last item */}
            {index < SKELETON_COUNT - 1 && (
              <XStack height={1} backgroundColor="$borderColor" />
            )}
          </YStack>
        ))}
      </YStack>
    </Animated.View>
  );
}
