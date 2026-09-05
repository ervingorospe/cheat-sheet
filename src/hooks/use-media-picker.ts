import { useLoadingOverlay } from "@/providers/loading-overlay-provider";
import { toast } from "@tamagui/toast/v2";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { useCallback } from "react";

const MAX_IMAGE_SELECTION = 10;
const MAX_IMAGE_DIMENSION = 1568; // Gemini's own docs recommend this as a sufficient max side length for image understanding — larger doesn't improve accuracy, just cost/latency

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
  const { show: showLoading, hide: hideLoading } = useLoadingOverlay();
  const { selectionLimit = MAX_IMAGE_SELECTION } = options;

  const pickFromLibrary = useCallback(async (): Promise<PickedMedia[]> => {
    showLoading();
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    try {
      if (status !== "granted") {
        console.warn("Media library permission was not granted");
        toast("Media library permission was not granted");

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

      const compressed = await Promise.all(result.assets.map(compressImageAsset));

      return compressed;
    } catch (error) {
      console.error("Failed to access select photos:", error);
      toast("Failed to access select photos");

      return [];
    } finally {
      hideLoading()
    }
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

    return compressImageAsset(result.assets[0]);
  }, []);

  return { pickFromLibrary, pickFromCamera };
}

async function compressImageAsset(asset: ImagePicker.ImagePickerAsset): Promise<PickedMedia> {
  const { show: showLoading, hide: hideLoading } = useLoadingOverlay();

  try {
    showLoading();

    const context = ImageManipulator.manipulate(asset.uri);
    context.resize({ width: MAX_IMAGE_DIMENSION });

    const renderedImage = await context.renderAsync();
    const result = await renderedImage.saveAsync({
      compress: 0.7,
      format: SaveFormat.JPEG,
    });

    return {
      uri: result.uri,
      type: "image",
      fileName: asset.fileName ?? null,
      fileSize: null,
    };
  } catch (error) {
    console.error("Failed to compress image, using original:", error);
    return mapAssetToPickedMedia(asset);
  } finally {
    hideLoading()
  }
}

function mapAssetToPickedMedia(asset: ImagePicker.ImagePickerAsset): PickedMedia {
  return {
    uri: asset.uri,
    type: asset.type === "video" ? "video" : "image",
    fileName: asset.fileName ?? null,
    fileSize: asset.fileSize ?? null,
  };
}