import Avatar from "@/components/common/avatar";
import Screen from "@/components/layout/screen";
import {
  AppSection,
  AppTextStack,
  Button,
  H2,
  Paragraph,
  SizableText,
} from "@/components/theme";
import { useAuth } from "@/providers/auth-provider";
import { getUserName } from "@/utils/user";
import { LogOut } from "@tamagui/lucide-icons-2";
import { Alert } from "react-native";
import { XStack, YStack } from "tamagui";

export default function ProfileScreen() {
  const { session, logout } = useAuth();

  const user = session?.user ?? null;
  const name = getUserName(user);

  const handleLogoutPress = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: handleConfirmedLogout },
    ]);
  };

  const handleConfirmedLogout = async () => {
    const { error } = await logout();

    if (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Screen>
      <YStack
        flex={1}
        paddingHorizontal="$xl"
        paddingTop="$xxl"
        paddingBottom="$xl"
      >
        <AppSection flex={1} alignItems="center">
          <Avatar user={user} size={96} />

          <AppTextStack marginTop="$lg" alignItems="center">
            <H2>{name}</H2>
            {user?.email && (
              <Paragraph color="$secondary">{user.email}</Paragraph>
            )}
          </AppTextStack>
        </AppSection>

        <Button variant="outlineDanger" onPress={handleLogoutPress}>
          <XStack alignItems="center" gap="$2">
            <LogOut size="$1" color="$error" />
            <SizableText color="$error" fontWeight="600">
              Log Out
            </SizableText>
          </XStack>
        </Button>
      </YStack>
    </Screen>
  );
}
