import Facebook from "@/assets/icons/facebook.svg";
import Google from "@/assets/icons/google.svg";
import { useAuth } from "@/providers/auth-provider";
import { Pressable } from "react-native";
import { XStack } from "tamagui";

export default function SocialMediaLogin() {
  const { loginWithOAuth } = useAuth();

  return (
    <XStack gap="$4" justifyContent="center">
      <Pressable onPress={() => loginWithOAuth("google")}>
        <Google width={40} height={40} />
      </Pressable>
      <Pressable onPress={() => loginWithOAuth("facebook")}>
        <Facebook width={40} height={40} />
      </Pressable>
    </XStack>
  );
}
