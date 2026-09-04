import {
  Sora_400Regular,
  Sora_500Medium,
  Sora_600SemiBold,
  Sora_700Bold,
} from "@expo-google-fonts/sora";
import { useFonts } from "expo-font";

export default function useAppFonts() {
  return useFonts({
    Sora: Sora_400Regular,
    SoraMedium: Sora_500Medium,
    SoraSemiBold: Sora_600SemiBold,
    SoraBold: Sora_700Bold,
  });
}
