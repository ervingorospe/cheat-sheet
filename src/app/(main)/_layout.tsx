import AppHeader from "@/components/layout/app-header";
import {
  AppHeaderHeightProvider,
  useAppHeaderHeight,
} from "@/providers/header-height-provider";
import { Stack, usePathname } from "expo-router";
import { useTheme, YStack } from "tamagui";

const titleMap: Record<string, string> = {
  "/profile": "Profile",
};

function MainLayoutContent() {
  const pathname = usePathname();
  const theme = useTheme();
  const title = titleMap[pathname] ?? "";
  const { setAppHeaderHeight } = useAppHeaderHeight();

  return (
    <YStack flex={1}>
      <YStack onLayout={(e) => setAppHeaderHeight(e.nativeEvent.layout.height)}>
        <AppHeader isBack={true} title={title} />
      </YStack>

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.background.val,
          },
        }}
      />
    </YStack>
  );
}

export default function TabLayout() {
  return (
    <AppHeaderHeightProvider>
      <MainLayoutContent />
    </AppHeaderHeightProvider>
  );
}
