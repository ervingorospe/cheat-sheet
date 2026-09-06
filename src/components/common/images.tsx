import { ChevronLeft, ChevronRight } from "@tamagui/lucide-icons-2";
import { Sheet } from "@tamagui/sheet";
import { useState } from "react";
import { Image, ImageStyle, Pressable } from "react-native";
import { Button, SizableText, XStack, YStack } from "tamagui";

type NoteImagesProps = {
  images: string[];
  thumbnailStyle?: ImageStyle;
};

export default function NoteImages({
  images,
  thumbnailStyle,
}: NoteImagesProps) {
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
          <Pressable
            key={url}
            onPress={() => setSelectedImage(url)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Image source={{ uri: url }} style={thumbnailStyle} />
          </Pressable>
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

              {/* Previous */}
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

              {/* Next */}
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

              {/* Image counter */}
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
