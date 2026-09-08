import { useSkeletonPulse } from "@/hooks/use-skeleton-pulse";
import { ChevronLeft, ChevronRight } from "@tamagui/lucide-icons-2";
import { Sheet } from "@tamagui/sheet";
import { useState } from "react";
import { Animated, Image, ImageStyle, Pressable } from "react-native";
import { Button, SizableText, XStack, YStack } from "tamagui";

type ImagesProps = {
  images: string[];
  thumbnailStyle?: ImageStyle;
};

function ImageSkeleton({ style }: { style?: ImageStyle }) {
  const opacity = useSkeletonPulse();

  return (
    <Animated.View style={[style, { opacity }]}>
      <YStack
        flex={1}
        width="100%"
        height="100%"
        borderRadius="$sm"
        backgroundColor="$paperVariant"
      />
    </Animated.View>
  );
}

function ImageThumbnail({
  url,
  thumbnailStyle,
  onPress,
}: {
  url: string;
  thumbnailStyle?: ImageStyle;
  onPress: () => void;
}) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.6 : 1,
        position: "relative",
      })}
    >
      {isLoading && <ImageSkeleton style={thumbnailStyle} />}

      <Image
        source={{ uri: url }}
        style={[
          thumbnailStyle,
          {
            position: isLoading ? "absolute" : "relative",
            opacity: isLoading ? 0 : 1,
          },
        ]}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
    </Pressable>
  );
}

export default function Images({ images, thumbnailStyle }: ImagesProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (images.length === 0) {
    return null;
  }

  const selectedIndex = selectedImage ? images.indexOf(selectedImage) : -1;

  const hasPrevious = selectedIndex > 0;
  const hasNext = selectedIndex < images.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      setSelectedImage(images[selectedIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setSelectedImage(images[selectedIndex + 1]);
    }
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  return (
    <>
      {/* Image thumbnails */}
      <XStack flexWrap="wrap" gap="$sm" marginBottom="$lg">
        {images.map((url) => (
          <ImageThumbnail
            key={url}
            url={url}
            thumbnailStyle={thumbnailStyle}
            onPress={() => setSelectedImage(url)}
          />
        ))}
      </XStack>

      {/* Image viewer */}
      <Sheet
        modal
        open={selectedImage !== null}
        onOpenChange={(open: boolean) => {
          if (!open) {
            handleClose();
          }
        }}
        snapPoints={[90]}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />

        <Sheet.Handle />

        <Sheet.Frame padding="$md" justifyContent="center" alignItems="center">
          {selectedImage && (
            <YStack flex={1} width="100%" position="relative">
              <Image
                source={{ uri: selectedImage }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                resizeMode="contain"
              />

              {hasPrevious && (
                <Button
                  position="absolute"
                  left={0}
                  top="50%"
                  circular
                  size="$3"
                  icon={ChevronLeft}
                  onPress={handlePrevious}
                />
              )}

              {hasNext && (
                <Button
                  position="absolute"
                  right={0}
                  top="50%"
                  circular
                  size="$3"
                  icon={ChevronRight}
                  onPress={handleNext}
                />
              )}

              <SizableText
                position="absolute"
                bottom="$md"
                alignSelf="center"
                fontSize="$4"
                color="$muted"
              >
                {selectedIndex + 1} / {images.length}
              </SizableText>
            </YStack>
          )}
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
