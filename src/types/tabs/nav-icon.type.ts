import { Home } from "@tamagui/lucide-icons-2";
import { Href } from "expo-router";
import { GetProps, YStack } from "tamagui";

export type NavIcon = {
  id: string;
  icon: typeof Home;
  path: Href;
  activePath: string;
};

export type NavIconProps = {
  isActive: boolean;
  icon: typeof Home;
} & GetProps<typeof YStack>;
