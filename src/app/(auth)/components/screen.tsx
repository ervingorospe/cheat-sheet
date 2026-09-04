import { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack } from "tamagui";

function Screen({ children }: PropsWithChildren) {
  return (
    <YStack flex={1} backgroundColor="$background">
      <SafeAreaView
        style={{
          flex: 1,
          paddingHorizontal: 10,
        }}
      >
        {children}
      </SafeAreaView>
    </YStack>
  );
}

export default Screen;
