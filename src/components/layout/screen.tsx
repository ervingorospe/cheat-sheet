import { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack } from "tamagui";

function Screen({ children }: PropsWithChildren) {
  return (
    <YStack flex={1} backgroundColor="$background">
      <SafeAreaView
        edges={["left", "right", "bottom"]}
        style={{
          flex: 1,
          paddingHorizontal: 4,
        }}
      >
        <YStack flex={1} paddingHorizontal="$sm">
          {children}
        </YStack>
      </SafeAreaView>
    </YStack>
  );
}

export default Screen;
