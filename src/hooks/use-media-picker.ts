import * as ImagePicker from "expo-image-picker";
import { useCallback } from "react";

const MAX_IMAGE_SELECTION = 10;

export type PickedMedia = {
  uri: string;
  type: "image" | "video";
  fileName: string | null;
  fileSize: number | null;
};

export type UseMediaPickerOptions = {
  selectionLimit?: number;
};

export function useMediaPicker(options: UseMediaPickerOptions = {}) {
  const { selectionLimit = MAX_IMAGE_SELECTION } = options;

  const pickFromLibrary = useCallback(async (): Promise<PickedMedia[]> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      console.warn("Media library permission was not granted");
      return [];
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: Math.min(selectionLimit, MAX_IMAGE_SELECTION),
      quality: 0.8,
    });

    if (result.canceled || result.assets.length === 0) {
      return [];
    }

    return result.assets.map(mapAssetToPickedMedia);
  }, [selectionLimit]);

  const pickFromCamera = useCallback(async (): Promise<PickedMedia | null> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      console.warn("Camera permission was not granted");
      return null;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (result.canceled || result.assets.length === 0) {
      return null;
    }

    return mapAssetToPickedMedia(result.assets[0]);
  }, []);

  return { pickFromLibrary, pickFromCamera };
}

function mapAssetToPickedMedia(
  asset: ImagePicker.ImagePickerAsset,
): PickedMedia {
  return {
    uri: asset.uri,
    type: asset.type === "video" ? "video" : "image",
    fileName: asset.fileName ?? null,
    fileSize: asset.fileSize ?? null,
  };
}