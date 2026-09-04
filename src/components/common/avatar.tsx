import { SizableText } from "@/components/theme";
import { getUserAvatar, getUserInitials, getUserName } from "@/utils/user";
import { Href, Link } from "expo-router";
import { forwardRef } from "react";
import { Avatar, GetProps } from "tamagui";

type AvatarProps = {
  user: Parameters<typeof getUserName>[0];
  link?: Href;
  size?: GetProps<typeof Avatar>["size"];
};

export default function AppAvatar({ user, link, size }: AvatarProps) {
  const name = getUserName(user);
  const avatarUrl = getUserAvatar(user);
  const initials = getUserInitials(name);

  if (!link) {
    return (
      <AvatarContent avatarUrl={avatarUrl} initials={initials} size={size} />
    );
  }

  return (
    <Link href={link} asChild>
      <AvatarContent
        avatarUrl={avatarUrl}
        initials={initials}
        size={size}
        pressable
      />
    </Link>
  );
}

type AvatarContentProps = {
  avatarUrl: string | null;
  initials: string;
  pressable?: boolean;
  size?: GetProps<typeof Avatar>["size"];
} & GetProps<typeof Avatar>;

const AvatarContent = forwardRef<any, AvatarContentProps>(
  ({ avatarUrl, initials, pressable, size, ...props }, ref) => {
    return (
      <Avatar
        ref={ref}
        circular
        size={size || "$3"}
        pressStyle={pressable ? { scale: 0.92, opacity: 0.85 } : undefined}
        transition="quick"
        {...props}
      >
        {avatarUrl && <Avatar.Image src={avatarUrl} />}

        <Avatar.Fallback
          backgroundColor="$blue9"
          alignItems="center"
          justifyContent="center"
        >
          <SizableText color="white" fontSize="$4" fontWeight="700">
            {initials}
          </SizableText>
        </Avatar.Fallback>
      </Avatar>
    );
  },
);

AvatarContent.displayName = "AvatarContent";
