import { Camera } from "@tamagui/lucide-icons-2";

export type IconActionProps = {
  key: string;
  icon: typeof Camera;
  onPress: () => void;
  color?: string;
  width?: number;
  size?: string | number;
};
