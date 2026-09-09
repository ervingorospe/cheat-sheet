import ChangePasswordSheet from "@/components/profile/change-password-sheet";
import { Paper, SizableText } from "@/components/theme";
import { hasPasswordAuth } from "@/lib/auth";
import { User } from "@supabase/supabase-js";
import { ChevronRight, KeyRound } from "@tamagui/lucide-icons-2";
import { useState } from "react";
import { XStack } from "tamagui";

type ChangePasswordProps = {
  user: User | null;
};

export default function ChangePassword({ user }: ChangePasswordProps) {
  const [isPasswordSheetOpen, setIsPasswordSheetOpen] = useState(false);

  if (hasPasswordAuth(user)) {
    return (
      <Paper
        onPress={() => setIsPasswordSheetOpen(true)}
        pressStyle={{
          opacity: 0.6,
          scale: 0.95,
        }}
      >
        <XStack justifyContent="space-between" alignItems="center">
          {hasPasswordAuth(user) && (
            <XStack alignItems="center" gap="$sm" paddingVertical={10}>
              <KeyRound size="$1" color="$primary" />
              <SizableText fontSize={16} color="$primary">
                Change Password
              </SizableText>
            </XStack>
          )}

          <ChevronRight color="$primary" />
        </XStack>

        <ChangePasswordSheet
          open={isPasswordSheetOpen}
          onClose={() => setIsPasswordSheetOpen(false)}
        />
      </Paper>
    );
  }
}
