import Backdrop from "@/components/common/backdrop";
import { useOutsidePress } from "@/hooks/use-outside-press";
import { ExpandableActionButtonProps } from "@/types/common/expandable-action-button.type";
import { IconActionProps } from "@/types/common/icon-action.type";
import { Camera, Plus } from "@tamagui/lucide-icons-2";
import { useEffect, useState } from "react";
import { AnimatePresence, YStack } from "tamagui";

const DEFAULT_BASE_BOTTOM = 80;
const DEFAULT_BOTTOM_STEP = 65;
const DEFAULT_STAGGER_MS = 60;

export default function ExpandableActionButton({
  actions,
  baseBottom = DEFAULT_BASE_BOTTOM,
  bottomStep = DEFAULT_BOTTOM_STEP,
  staggerMs = DEFAULT_STAGGER_MS,
}: ExpandableActionButtonProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const { overlayProps } = useOutsidePress(isMenuOpen, () =>
    setIsMenuOpen(false),
  );

  useEffect(() => {
    if (!isMenuOpen) {
      setVisibleCount(0);
      return;
    }

    const timers = actions.map((_, index) =>
      setTimeout(
        () => setVisibleCount((count) => Math.max(count, index + 1)),
        index * staggerMs,
      ),
    );

    return () => timers.forEach(clearTimeout);
  }, [isMenuOpen, actions, staggerMs]);

  const handleActionPress = (action: IconActionProps) => {
    action.onPress();
    setIsMenuOpen(false);
  };

  return (
    <>
      <Backdrop isVisible={isMenuOpen} onPress={overlayProps.onPress} />

      <YStack alignItems="center" justifyContent="center">
        <AnimatePresence>
          {actions.slice(0, visibleCount).map((action, index) => (
            <SubActionButton
              key={action.key}
              icon={action.icon}
              bottom={baseBottom + index * bottomStep}
              onPress={() => handleActionPress(action)}
            />
          ))}
        </AnimatePresence>

        <YStack
          width={66}
          height={66}
          borderRadius={100}
          backgroundColor="$primary"
          alignItems="center"
          justifyContent="center"
          marginTop={-28}
          borderWidth={6}
          borderColor="$background"
          pressStyle={{ scale: 0.92 }}
          transition="quick"
          rotate={isMenuOpen ? "45deg" : "0deg"}
          onPress={() => setIsMenuOpen((prev) => !prev)}
        >
          <Plus size="$1.5" color="$textHeader" />
        </YStack>
      </YStack>
    </>
  );
}

const SubActionButton = ({
  icon: Icon,
  bottom,
  onPress,
}: {
  icon: typeof Camera;
  bottom: number;
  onPress: () => void;
}) => {
  return (
    <YStack
      position="absolute"
      bottom={bottom}
      width={50}
      height={50}
      borderRadius={100}
      backgroundColor="$primary"
      alignItems="center"
      justifyContent="center"
      transition="bouncy"
      animateOnly={["transform", "opacity"]}
      enterStyle={{ opacity: 0, y: 20, scale: 0.5 }}
      exitStyle={{ opacity: 0, y: 20, scale: 0.5 }}
      opacity={1}
      y={0}
      scale={1}
      pressStyle={{ scale: 0.9 }}
      onPress={onPress}
    >
      <Icon size="$1" color="$textHeader" />
    </YStack>
  );
};
