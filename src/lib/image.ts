import { ImageManipulator, SaveFormat } from "expo-image-manipulator";

export type CompressImageOptions = {
  maxDimension?: number;
  quality?: number;
};

export async function compressImage(
  uri: string,
  { maxDimension = 1920, quality = 0.7 }: CompressImageOptions = {}
): Promise<string> {
  const context = ImageManipulator.manipulate(uri);

  context.resize({ width: maxDimension });

  const renderedImage = await context.renderAsync();

  const result = await renderedImage.saveAsync({
    compress: quality,
    format: SaveFormat.JPEG,
  });

  return result.uri;
}