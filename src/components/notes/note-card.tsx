import { H4, Paper } from "@/components/theme";
import { NoteListItem } from "@/lib/notes";
import { formatDate } from "@/utils/date";
import { ChevronRight } from "@tamagui/lucide-icons-2";
import { Link } from "expo-router";
import { forwardRef, memo } from "react";
import { GetProps, SizableText, XStack, YStack } from "tamagui";

function NoteCard({ note }: { note: NoteListItem }) {
  return (
    <Link href={{ pathname: "/notes/[id]", params: { id: note.id } }} asChild>
      <NoteCardContent note={note} />
    </Link>
  );
}

export default memo(NoteCard);

type NoteCardContentProps = { note: NoteListItem } & GetProps<typeof Paper>;

const NoteCardContent = forwardRef<any, NoteCardContentProps>(
  ({ note, ...props }, ref) => {
    return (
      <Paper
        ref={ref}
        marginBottom="$md"
        pressStyle={{ scale: 0.98, opacity: 0.85 }}
        {...props}
      >
        <XStack alignItems="center" gap="$md">
          <YStack flex={1} paddingVertical="$sm" gap="$lg">
            <H4 fontSize="$4" fontWeight="700">
              {note.title || "Untitled note"}
            </H4>

            {note.content && (
              <SizableText numberOfLines={2}>{note.content}</SizableText>
            )}

            <SizableText fontSize="$2" color="$muted">
              {formatDate(note.created_at)}
            </SizableText>
          </YStack>

          <XStack
            width={36}
            height={36}
            borderRadius={18}
            backgroundColor="$paperVariant"
            alignItems="center"
            justifyContent="center"
          >
            <ChevronRight size={20} color="$secondary" />
          </XStack>
        </XStack>
      </Paper>
    );
  },
);

NoteCardContent.displayName = "NoteCardContent";
