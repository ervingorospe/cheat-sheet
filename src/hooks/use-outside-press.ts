import { useCallback } from "react";

type UseOutsidePressResult = {
  isActive: boolean;
  overlayProps: {
    onPress: () => void;
  };
};

export function useOutsidePress(
  isActive: boolean,
  onOutsidePress: () => void,
): UseOutsidePressResult {
  const handlePress = useCallback(() => {
    onOutsidePress();
  }, [onOutsidePress]);

  return {
    isActive,
    overlayProps: {
      onPress: handlePress,
    },
  };
}
