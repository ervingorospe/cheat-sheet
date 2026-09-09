import Avatar from "@/components/common/avatar";
import Screen from "@/components/layout/screen";
import ChangePassword from "@/components/profile/change-password";
import ProfileEdit from "@/components/profile/profile-edit";
import {
  AppSection,
  AppTextStack,
  Button,
  H2,
  Paper,
  Paragraph,
  SizableText,
} from "@/components/theme";
import { useAuth } from "@/providers/auth-provider";
import { ChevronRight, LogOut, Pencil } from "@tamagui/lucide-icons-2";
import { useState } from "react";
import { Alert } from "react-native";
import { XStack, YStack } from "tamagui";

export default function ProfileScreen() {
  const { session, profile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const user = session?.user ?? null;
  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    "there";

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

  if (isEditing && profile && user) {
    return (
      <Screen>
        <ProfileEdit
          user={user}
          profile={profile}
          onDone={() => setIsEditing(false)}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <YStack flex={1} paddingBottom="$xl">
        <AppSection flex={1}>
          <Paper paddingVertical={30}>
            <XStack width="100%" position="relative" justifyContent="center">
              <Avatar user={user} avatarUrl={profile?.avatar_url} size={96} />
            </XStack>

            <AppTextStack alignItems="center">
              <H2>{displayName}</H2>
              {profile?.email && (
                <Paragraph color="$secondary">{profile.email}</Paragraph>
              )}

              <XStack marginTop={15}>
                <Button
                  onPress={() => setIsEditing(true)}
                  marginTop="0"
                  icon={<Pencil />}
                >
                  <SizableText>Edit Profile</SizableText>
                </Button>
              </XStack>
            </AppTextStack>
          </Paper>

          <AppTextStack>
            <ChangePassword user={user} />
            <Paper
              onPress={handleLogoutPress}
              pressStyle={{
                opacity: 0.6,
                scale: 0.95,
              }}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <XStack alignItems="center" gap="$sm" paddingVertical={10}>
                  <LogOut size="$1" color="$error" />
                  <SizableText fontSize={16} color="$error">
                    Log Out
                  </SizableText>
                </XStack>

                <ChevronRight color="$error" />
              </XStack>
            </Paper>
          </AppTextStack>
        </AppSection>
      </YStack>
    </Screen>
  );
}
