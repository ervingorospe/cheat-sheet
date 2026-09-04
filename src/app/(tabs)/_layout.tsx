import AppHeader from "@/components/layout/app-header";
import CustomTabBar from "@/components/layout/custom-tab-bar";
import { Stack, usePathname } from "expo-router";
import { YStack } from "tamagui";

const titleMap: Record<string, string> = {
  "/library": "Library",
  "/settings": "Settings",
  "/folder": "Folder",
};

export default function TabLayout() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const title = titleMap[pathname] ?? "Home";

  return (
    <YStack flex={1} backgroundColor="$background">
      <AppHeader title={title} isHome={isHome} />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />

      <CustomTabBar />
    </YStack>
  );
}
