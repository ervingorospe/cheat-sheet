import { createAnimations } from "@tamagui/animations-react-native";

export const animations = createAnimations({
  quick: {
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  bouncy: {
    damping: 9,
    mass: 0.9,
    stiffness: 150,
  },
});
