import { useSkeletonPulse } from "@/hooks/use-skeleton-pulse";
import { Animated } from "react-native";
import { XStack, YStack } from "tamagui";

export default function NoteDetailSkeleton() {
  const opacity = useSkeletonPulse();

  return (
    <Animated.View style={{ opacity }}>
      <YStack gap="$md">
        {/* Title */}
        <YStack
          height={32}
          width="75%"
          borderRadius="$sm"
          backgroundColor="$paper"
        />

        {/* Date */}
        <YStack
          height={14}
          width="30%"
          borderRadius="$sm"
          backgroundColor="$paper"
          marginBottom="$lg"
        />

        {/* Content */}
        <YStack gap="$sm" marginBottom="$lg">
          <YStack
            height={16}
            width="100%"
            borderRadius="$sm"
            backgroundColor="$paper"
          />
          <YStack
            height={16}
            width="100%"
            borderRadius="$sm"
            backgroundColor="$paper"
          />
          <YStack
            height={16}
            width="90%"
            borderRadius="$sm"
            backgroundColor="$paper"
          />
          <YStack
            height={16}
            width="75%"
            borderRadius="$sm"
            backgroundColor="$paper"
          />
        </YStack>

        {/* Key Points title */}
        <YStack
          height={22}
          width="35%"
          borderRadius="$sm"
          backgroundColor="$paper"
          marginBottom="$xs"
        />

        {/* Key Points */}
        <YStack gap="$md">
          {[1, 2, 3].map((item) => (
            <XStack key={item} gap="$sm" alignItems="flex-start">
              {/* Bullet */}
              <YStack
                width={8}
                height={8}
                marginTop={5}
                borderRadius={100}
                backgroundColor="$paper"
              />

              {/* Point text */}
              <YStack flex={1} gap="$sm">
                <YStack
                  height={15}
                  width="100%"
                  borderRadius="$sm"
                  backgroundColor="$paper"
                />
                <YStack
                  height={15}
                  width="85%"
                  borderRadius="$sm"
                  backgroundColor="$paper"
                />
              </YStack>
            </XStack>
          ))}
        </YStack>
      </YStack>
    </Animated.View>
  );
}
