import Avatar from "@/components/common/avatar";
import { H2, Paragraph } from "@/components/theme";
import { useAuth } from "@/providers/auth-provider";
import { XStack, YStack } from "tamagui";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomeGreeting() {
  const { session, profile } = useAuth();
  const firstName = profile?.first_name;

  return (
    <XStack
      alignItems="center"
      justifyContent="space-between"
      marginBottom="$lg"
    >
      <YStack>
        <Paragraph color="$secondary">{getGreeting()}</Paragraph>
        <H2>{firstName ? `${firstName}!` : "Welcome back!"}</H2>
      </YStack>

      <Avatar
        user={session?.user ?? null}
        avatarUrl={profile?.avatar_url}
        link="/profile"
        size="$4"
      />
    </XStack>
  );
}
