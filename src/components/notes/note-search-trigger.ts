import { Paper } from "@/components/theme";
import { Search } from "@tamagui/lucide-icons-2";
import { Link } from "expo-router";
import { createElement, forwardRef } from "react";
import { GetProps, SizableText, XStack } from "tamagui";

export default function NoteSearchTrigger() {
  return createElement(
    Link,
    { href: "/search", asChild: true },
    createElement(NoteSearchTriggerContent),
  );
}

type NoteSearchTriggerContentProps = GetProps<typeof Paper>;

const NoteSearchTriggerContent = forwardRef<any, NoteSearchTriggerContentProps>(
  (props, ref) => {
    return createElement(
      Paper,
      {
        ref,
        padding: "$lg",
        marginBottom: "$md",
        pressStyle: { scale: 0.98, opacity: 0.85 },
        ...props,
      },
      createElement(
        XStack,
        { alignItems: "center", justifyContent: "space-between" },
        createElement(SizableText, { color: "$secondary" }, "Search notes..."),
        createElement(Search, { size: 18, color: "$secondary" }),
      ),
    );
  },
);

NoteSearchTriggerContent.displayName = "NoteSearchTriggerContent";