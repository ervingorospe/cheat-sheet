import { compressImage } from "@/lib/image";
import { useLoadingOverlay } from "@/providers/loading-overlay-provider";
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

export type MediaPickerError = "permission_denied" | "picker_failed";

export type MediaPickerResult<T> = {
  data: T | null;
  cancelled: boolean;
  error: MediaPickerError | null;
};

export type UseMediaPickerOptions = {
  selectionLimit?: number;
};

const CANCELLED_RESULT = { data: null, cancelled: true, error: null } as const;

function permissionDeniedResult<T>(): MediaPickerResult<T> {
  return { data: null, cancelled: false, error: "permission_denied" };
}

function pickerFailedResult<T>(): MediaPickerResult<T> {
  return { data: null, cancelled: false, error: "picker_failed" };
}

export function useMediaPicker(options: UseMediaPickerOptions = {}) {
  const { show: showLoading, hide: hideLoading } = useLoadingOverlay();
  const { selectionLimit = MAX_IMAGE_SELECTION } = options;

  const pickFromLibrary = useCallback(async (): Promise<MediaPickerResult<PickedMedia[]>> => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        console.warn("Media library permission was not granted");
        return permissionDeniedResult();
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        selectionLimit: Math.min(selectionLimit, MAX_IMAGE_SELECTION),
        quality: 0.8,
      });

      if (result.canceled || result.assets.length === 0) {
        return CANCELLED_RESULT;
      }

      showLoading();
      const compressed = await Promise.all(
        result.assets.map(compressImageAsset)
      );

      return { data: compressed, cancelled: false, error: null };
    } catch (error) {
      console.error("Failed to select photos:", error);
      return pickerFailedResult();
    } finally {
      hideLoading();
    }
  }, [selectionLimit, showLoading, hideLoading]);

  const pickFromCamera = useCallback(async (): Promise<MediaPickerResult<PickedMedia>> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        console.warn("Camera permission was not granted");
        return permissionDeniedResult();
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.8,
      });

      if (result.canceled || result.assets.length === 0) {
        return CANCELLED_RESULT;
      }

      showLoading();
      const compressed = await compressImageAsset(result.assets[0]);

      return { data: compressed, cancelled: false, error: null };
    } catch (error) {
      console.error("Failed to capture photo:", error);
      return pickerFailedResult();
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  return {
    pickFromLibrary,
    pickFromCamera,
  };
}

async function compressImageAsset(
  asset: ImagePicker.ImagePickerAsset
): Promise<PickedMedia> {
  try {
    const uri = await compressImage(asset.uri, {
      maxDimension: MAX_IMAGE_DIMENSION,
      quality: 0.7,
    });

    return {
      uri,
      type: "image",
      fileName: asset.fileName ?? null,
      fileSize: null,
    };
  } catch (error) {
    console.warn(
      "Image compression failed, falling back to original asset:",
      error
    );
    return mapAssetToPickedMedia(asset);
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