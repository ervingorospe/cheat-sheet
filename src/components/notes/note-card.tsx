import { H4, Paper } from "@/components/theme";
import { useDeleteNote } from "@/hooks/use-delete-note";
import { NoteListItem } from "@/lib/notes";
import { formatDate } from "@/utils/date";
import { ChevronRight } from "@tamagui/lucide-icons-2";
import { useQueryClient } from "@tanstack/react-query";
import { Link, router } from "expo-router";
import { forwardRef, memo, useRef } from "react";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import { GetProps, SizableText, XStack, YStack } from "tamagui";
import NoteActionButtons from "./note-action-buttons";

type NoteCardProps = {
  note: NoteListItem;
  folderId?: string | null;
};

function NoteCard({ note, folderId }: NoteCardProps) {
  const swipeableRef = useRef<SwipeableMethods>(null);
  const queryClient = useQueryClient();

  const { confirmDeleteNote, isDeleting } = useDeleteNote(note.id, {
    onDeleted: () => {
      queryClient.removeQueries({
        queryKey: ["notes", "detail", note.id],
      });

      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "notes" && query.queryKey[1] !== "detail",
      });

      router.back();
    },
  });

  const handleDeletePress = () => {
    swipeableRef.current?.close();
    confirmDeleteNote();
  };

  const handleEdit = () => {
    swipeableRef.current?.close();
    router.push(`/notes/${note.id}?isEdit=true`);
  };

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      overshootRight={false}
      rightThreshold={40}
      containerStyle={{ marginBottom: 12 }}
      renderRightActions={() => (
        <XStack height="100%">
          <NoteActionButtons onEdit={handleEdit} onDelete={handleDeletePress} />
        </XStack>
      )}
    >
      <Link href={{ pathname: "/notes/[id]", params: { id: note.id } }} asChild>
        <NoteCardContent note={note} />
      </Link>
    </ReanimatedSwipeable>
  );
}

export default memo(NoteCard);

type NoteCardContentProps = { note: NoteListItem } & GetProps<typeof Paper>;

const NoteCardContent = forwardRef<any, NoteCardContentProps>(
  ({ note, ...props }, ref) => {
    return (
      <Paper ref={ref} pressStyle={{ scale: 0.98, opacity: 0.85 }} {...props}>
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
