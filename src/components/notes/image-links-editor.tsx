import Images from "@/components/common/images";
import { Button } from "@/components/theme";
import { useMediaPicker } from "@/hooks/use-media-picker";
import { deleteNoteImage, uploadNoteImage } from "@/lib/notes";
import { useToast } from "@/providers/toast-provider";
import { ImagePlus, X } from "@tamagui/lucide-icons-2";
import { useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Spinner, XStack, YStack } from "tamagui";

type ImageLinksEditorProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  originalImages: string[];
};

export default function ImageLinksEditor<T extends FieldValues>({
  control,
  name,
  originalImages,
}: ImageLinksEditorProps<T>) {
  const [isUploading, setIsUploading] = useState(false);
  const { showToast } = useToast();

  const { pickFromLibrary } = useMediaPicker({
    selectionLimit: 10,
    isShowLoading: false,
  });

  const { field } = useController({
    name,
    control,
    defaultValue: [] as never,
  });

  const images = (field.value as string[] | undefined) ?? [];

  const pickAndUpload = async () => {
    setIsUploading(true);

    const result = await pickFromLibrary();

    if (result.cancelled) {
      return;
    }

    if (result.error) {
      if (result.error === "permission_denied") {
        showToast(
          "We need access to your photos to continue. You can enable this in Settings.",
        );
      } else {
        showToast("Failed to select images. Please try again.");
      }

      return;
    }

    if (!result.data?.length) {
      return;
    }

    try {
      const uploadResults = await Promise.all(
        result.data.map((media) => uploadNoteImage(media.uri)),
      );

      const successfulUrls = uploadResults
        .filter(
          (result): result is { url: string; error: null } =>
            result.error === null && result.url !== null,
        )
        .map((result) => result.url);

      const failedUploads = uploadResults.filter(
        (result) => result.error || !result.url,
      );

      if (successfulUrls.length > 0) {
        field.onChange([...images, ...successfulUrls]);
      }

      if (failedUploads.length > 0) {
        showToast(
          successfulUrls.length > 0
            ? `${successfulUrls.length} image(s) uploaded, but ${failedUploads.length} failed.`
            : "Failed to upload images. Please try again.",
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const url = images[index];

    field.onChange(images.filter((_, i) => i !== index));

    // Only newly-added images (not yet part of the saved note) get purged
    // immediately — an original image just gets unlinked here, and only
    // actually deleted from storage once the parent form confirms Save.
    if (!originalImages.includes(url)) {
      deleteNoteImage(url);
    }
  };

  return (
    <YStack gap="$sm">
      <XStack flexWrap="wrap" gap="$sm">
        {images.map((url, index) => (
          <XStack key={url} position="relative">
            <Images
              images={[url]}
              thumbnailStyle={{ width: 80, height: 80, borderRadius: 8 }}
            />

            <XStack
              position="absolute"
              top={-6}
              right={-6}
              width={22}
              height={22}
              borderRadius={11}
              backgroundColor="$error"
              alignItems="center"
              justifyContent="center"
              onPress={() => removeImage(index)}
            >
              <X size={12} color="white" />
            </XStack>
          </XStack>
        ))}
      </XStack>

      <Button
        size="$3"
        variant="text"
        color="$primary"
        icon={isUploading ? <Spinner size="small" /> : <ImagePlus size={16} />}
        onPress={pickAndUpload}
        disabled={isUploading}
      >
        {isUploading ? "Uploading..." : "Add image"}
      </Button>
    </YStack>
  );
}
