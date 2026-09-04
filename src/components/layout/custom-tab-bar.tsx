import { Paper } from "@/components/theme";
import { leftIcons, rightIcons } from "@/constants/auth/tabs/nav-menu.constant";
import { NavIconProps } from "@/types/tabs/nav-icon.type";
import { Link, usePathname } from "expo-router";
import { forwardRef } from "react";
import { XStack, YStack } from "tamagui";
import ExpandableAction from "./expandable-action";

export default function CustomTabBar() {
  const pathname = usePathname();

  return (
    <YStack alignItems="center" paddingBottom="$xl" paddingHorizontal="$xl">
      <Paper>
        <XStack width="100%" alignItems="center" justifyContent="space-between">
          {leftIcons.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.activePath;

            return (
              <Link key={item.id} href={item.path} asChild>
                <NavIcon isActive={isActive} icon={Icon} />
              </Link>
            );
          })}

          {/* Floating center action button */}
          <ExpandableAction />

          {rightIcons.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.activePath;

            return (
              <Link key={item.id} href={item.path} asChild>
                <NavIcon isActive={isActive} icon={Icon} />
              </Link>
            );
          })}
        </XStack>
      </Paper>
    </YStack>
  );
}

const NavIcon = forwardRef<any, NavIconProps>(
  ({ isActive, icon, ...props }, ref) => {
    const Icon = icon;

    return (
      <YStack
        ref={ref}
        padding="10"
        borderBottomWidth={isActive ? 3 : 0}
        borderBottomColor={isActive ? "$secondary" : "transparent"}
        scale={isActive ? 1 : 0.95}
        transition="quick"
        {...props}
      >
        <Icon size="$1" color={isActive ? "$textHeader" : "$secondary"} />
      </YStack>
    );
  },
);

NavIcon.displayName = "NavIcon";
