import ImageThumbnail from "@/components/common/image-thumbnail";
import { Sheet } from "@tamagui/sheet";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageStyle,
  ViewToken,
} from "react-native";
import { SizableText, XStack, YStack } from "tamagui";

type ImagesProps = {
  images: string[];
  thumbnailStyle?: ImageStyle;
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function Images({ images, thumbnailStyle }: ImagesProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const viewerRef = useRef<FlatList<string>>(null);

  if (images.length === 0) {
    return null;
  }

  const handleOpen = (index: number) => {
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setSelectedIndex(null);
  };

  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const index = viewableItems[0]?.index;

      if (index != null) {
        setSelectedIndex(index);
      }
    },
  ).current;

  return (
    <>
      {/* Image thumbnails */}
      <XStack flexWrap="wrap" gap="$sm" marginBottom="$lg">
        {images.map((url, index) => (
          <ImageThumbnail
            key={url}
            url={url}
            style={thumbnailStyle}
            onPress={() => handleOpen(index)}
          />
        ))}
      </XStack>

      {/* Image viewer */}
      <Sheet
        modal
        open={selectedIndex !== null}
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

        <Sheet.Frame
          flex={1}
          backgroundColor="$background"
          justifyContent="center"
          alignItems="center"
        >
          {selectedIndex !== null && (
            <YStack flex={1} width="100%" position="relative">
              <FlatList
                ref={viewerRef}
                data={images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                initialScrollIndex={selectedIndex}
                keyExtractor={(url) => url}
                getItemLayout={(_, index) => ({
                  length: SCREEN_WIDTH,
                  offset: SCREEN_WIDTH * index,
                  index,
                })}
                onViewableItemsChanged={handleViewableItemsChanged}
                viewabilityConfig={{
                  itemVisiblePercentThreshold: 50,
                }}
                renderItem={({ item }) => (
                  <YStack
                    width={SCREEN_WIDTH}
                    flex={1}
                    justifyContent="center"
                    alignItems="center"
                    padding="$md"
                  >
                    <Image
                      source={{ uri: item }}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                      resizeMode="contain"
                    />
                  </YStack>
                )}
              />

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
