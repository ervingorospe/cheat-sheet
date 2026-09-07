import { Button } from "@/components/theme";
import { deleteNoteImage, uploadNoteImage } from "@/lib/notes";
import { useToast } from "@/providers/toast-provider";
import { ImagePlus, X } from "@tamagui/lucide-icons-2";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { Image } from "react-native";
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

  const { field } = useController({
    name,
    control,
    defaultValue: [] as never,
  });

  const images = (field.value as string[] | undefined) ?? [];

  const pickAndUpload = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      showToast(
        "We need access to your photos to continue. You can enable this in Settings.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: false,
      quality: 0.8,
    });

    if (result.canceled || result.assets.length === 0) {
      return;
    }

    setIsUploading(true);

    const { url, error } = await uploadNoteImage(result.assets[0].uri);

    setIsUploading(false);

    if (error || !url) {
      showToast(error ?? "Failed to upload image. Please try again.");
      return;
    }

    field.onChange([...images, url]);
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
            <Image
              source={{ uri: url }}
              style={{ width: 80, height: 80, borderRadius: 8 }}
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
