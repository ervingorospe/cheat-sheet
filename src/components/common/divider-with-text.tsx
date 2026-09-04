import { ComponentType } from "react";
import { XStack } from "tamagui";
import { SizableText } from "../theme";

type DividerWithTextProps = {
  children?: string;
  icon?: ComponentType<{ size?: number; color?: string }>;
};

export function DividerWithText({
  children,
  icon: Icon,
}: DividerWithTextProps) {
  return (
    <XStack alignItems="center" width="100%" gap="$3">
      <XStack flex={1} height={1} backgroundColor="$border" />

      {Icon && <Icon size={16} color="$secondaryText" />}

      {children && (
        <SizableText fontSize="$2" color="$secondaryText" whiteSpace="nowrap">
          {children}
        </SizableText>
      )}

      <XStack flex={1} height={1} backgroundColor="$border" />
    </XStack>
  );
}
