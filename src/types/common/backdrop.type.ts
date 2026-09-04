import type { ColorTokens } from "tamagui";

export type BackdropProps = {
  isVisible: boolean;
  onPress: () => void;
  backgroundColor?: ColorTokens | "transparent";
};
