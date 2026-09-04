import AppHeader from "@/components/layout/app-header";
import CustomTabBar from "@/components/layout/custom-tab-bar";
import { Stack, usePathname } from "expo-router";
import { YStack } from "tamagui";

const titleMap: Record<string, string> = {
  "/profile": "Profile",
};

export default function TabLayout() {
  const pathname = usePathname();
  const title = titleMap[pathname];

  return (
    <YStack flex={1} backgroundColor="$background">
      <AppHeader isBack={true} title={title} />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />

      <CustomTabBar />
    </YStack>
  );
}
