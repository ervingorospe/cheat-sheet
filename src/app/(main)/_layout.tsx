import AppHeader from "@/components/layout/app-header";
import { Stack, usePathname } from "expo-router";
import { useTheme, YStack } from "tamagui";

const titleMap: Record<string, string> = {
  "/profile": "Profile",
};

export default function TabLayout() {
  const pathname = usePathname();
  const theme = useTheme();
  const title = titleMap[pathname] ?? "";

  return (
    <YStack flex={1}>
      <AppHeader isBack={true} title={title} />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: theme.background.val,
            paddingBottom: 30,
          },
        }}
      />
    </YStack>
  );
}
