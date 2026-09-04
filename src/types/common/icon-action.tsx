import { Camera } from "@tamagui/lucide-icons-2";

export type IconAction = {
  key: string;
  icon: typeof Camera;
  onPress: () => void;
};
