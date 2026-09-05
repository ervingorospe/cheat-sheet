import { Paper } from "@/components/theme";
import { NoteListItem } from "@/lib/notes";
import { formatDate } from "@/utils/date";
import { Link } from "expo-router";
import { forwardRef, memo } from "react";
import { GetProps, SizableText, YStack } from "tamagui";

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
        marginBottom="$sm"
        pressStyle={{ scale: 0.98, opacity: 0.85 }}
        {...props}
      >
        <YStack paddingVertical="$sm" gap="$md">
          <SizableText fontSize="$5" fontWeight="700" numberOfLines={1}>
            {note.title || "Untitled note"}
          </SizableText>

          {note.content && (
            <SizableText numberOfLines={2}>{note.content}</SizableText>
          )}

          <SizableText fontSize="$2" color="$secondary">
            {formatDate(note.created_at)}
          </SizableText>
        </YStack>
      </Paper>
    );
  },
);

NoteCardContent.displayName = "NoteCardContent";
