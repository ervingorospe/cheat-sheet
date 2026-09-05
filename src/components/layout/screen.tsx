import { PropsWithChildren } from "react";
import { YStack } from "tamagui";

function Screen({ children }: PropsWithChildren) {
  return (
    <YStack flex={1} backgroundColor="$background">
      <YStack flex={1} paddingHorizontal="$sm">
        {children}
      </YStack>
    </YStack>
  );
}

export default Screen;
