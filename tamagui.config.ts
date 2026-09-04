import { config } from "@tamagui/config";
import { createFont, createTamagui } from "tamagui";
import { animations } from "./animation";

const soraFont = createFont({
  family: "Sora",

  size: {
    1: 12,
    2: 14,
    3: 16,
    4: 18,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 40,
  },

  weight: {
    4: "400",
    5: "500",
    6: "600",
    7: "700",
  },
});

const colors = {
  brand: "#105F2D",
  brandLight: "#22C55E",

  background: "#0A1F33",
  paper: "#0F2A43",
  paperVariant: "#143B59",

  primary: "#3B82F6",
  primaryLight: "#629BF7",
  primaryDark: "#2F68C4",

  secondary: "#38BDF8",
  secondaryLight: "#5FCAF9",

  textHeader: "#F8FAFC",
  textSecondary: "#38BDF8",
  textBody: "#CBD5E1",
  muted: "#94A3B8",

  border: "#245273",

  success: "#22C55E",
  warning: "#F59E0B",

  error: "#EF4444",
  errorVariant: "#F26969",
};

const tamaguiConfig = createTamagui({
  ...config,
  animations,
  fonts: {
    ...config.fonts,
    body: soraFont,
    heading: soraFont,
  },

  tokens: {
    ...config.tokens,

    space: {
      ...config.tokens.space,

      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      xxl: 32,
    },

    radius: {
      ...config.tokens.radius,

      xs: 4,
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
    },

    color: {
      ...config.tokens.color,
      ...colors,
    },
  },

  themes: {
    ...config.themes,

    dark: {
      ...config.themes.dark,

      ...colors,
    },
  },
});

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig;
