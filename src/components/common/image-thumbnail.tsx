import { useSkeletonPulse } from "@/hooks/use-skeleton-pulse";
import { useState } from "react";
import { Animated, Image, ImageStyle, Pressable } from "react-native";
import { YStack } from "tamagui";

type ImageThumbnailProps = {
  url: string;
  style?: ImageStyle;
  onPress: () => void;
};

export default function ImageThumbnail({
  url,
  style,
  onPress,
}: ImageThumbnailProps) {
  const [isLoading, setIsLoading] = useState(true);
  const opacity = useSkeletonPulse();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.6 : 1,
        position: "relative",
      })}
    >
      {isLoading && (
        <Animated.View
          style={[
            style,
            {
              opacity,
              position: "absolute",
            },
          ]}
        >
          <YStack
            width="100%"
            height="100%"
            borderRadius="$sm"
            backgroundColor="$paperVariant"
          />
        </Animated.View>
      )}

      <Image
        source={{ uri: url }}
        style={[
          style,
          {
            opacity: isLoading ? 0 : 1,
          },
        ]}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
    </Pressable>
  );
}
