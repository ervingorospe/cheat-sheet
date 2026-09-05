import AppHeader from "@/components/layout/app-header";
import CustomTabBar from "@/components/layout/custom-tab-bar";
import { Stack, usePathname } from "expo-router";
import { useTheme, YStack } from "tamagui";

const titleMap: Record<string, string> = {
  "/library": "Library",
  "/settings": "Settings",
  "/folder": "Folder",
};

export default function TabLayout() {
  const pathname = usePathname();
  const theme = useTheme();
  const isHome = pathname === "/";
  const title = titleMap[pathname] ?? "Home";

  return (
    <YStack flex={1}>
      <AppHeader title={title} isHome={isHome} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.background.val,
          },
        }}
      />

      <CustomTabBar />
    </YStack>
  );
}
