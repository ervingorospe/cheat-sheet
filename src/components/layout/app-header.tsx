import AppAvatar from "@/components/common/avatar";
import BackButton from "@/components/common/back-button";
import GradientLinear from "@/components/common/gradient-linear";
import { SizableText } from "@/components/theme";
import { useAuth } from "@/providers/auth-provider";
import { getUserName } from "@/utils/user";
import { XStack, YStack } from "tamagui";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  isHome?: boolean;
  isBack?: boolean;
};

export default function AppHeader({
  title,
  isHome = false,
  isBack = false,
}: AppHeaderProps) {
  const { session } = useAuth();
  const user = session?.user ?? null;

  const name = getUserName(user);

  return (
    <XStack
      width="100%"
      paddingVertical="$4"
      backgroundColor="$paper"
      paddingHorizontal="$5"
      borderBottomLeftRadius="$10"
      borderBottomRightRadius="$10"
      elevation={2}
      zIndex={1}
    >
      <XStack
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        gap="$1"
        flex={1}
        marginTop="$9"
      >
        <YStack gap="$1">
          <XStack alignItems="center">
            {isBack && <BackButton />}

            <GradientLinear>
              <SizableText fontSize="$4" fontWeight="700">
                {isHome ? "Welcome back," : title}
              </SizableText>
            </GradientLinear>
          </XStack>

          {isHome && (
            <SizableText color="$textHeader" fontSize="$3">
              {name}
            </SizableText>
          )}
        </YStack>

        <AppAvatar user={user} link="/profile" />
      </XStack>
    </XStack>
  );
}
