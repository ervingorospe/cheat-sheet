import SwipeDeleteAction from "@/components/common/swipe-delete-action";
import { H4, Paper } from "@/components/theme";
import { notesQueryKey } from "@/hooks/use-notes-list";
import { deleteNote, NoteListItem, NotesPage } from "@/lib/notes";
import { useToast } from "@/providers/toast-provider";
import { formatDate } from "@/utils/date";
import { ChevronRight } from "@tamagui/lucide-icons-2";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Link } from "expo-router";
import { forwardRef, memo, useRef } from "react";
import { Alert } from "react-native";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import { GetProps, SizableText, XStack, YStack } from "tamagui";

type NoteCardProps = {
  note: NoteListItem;
  folderId?: string | null;
};

function NoteCard({ note, folderId }: NoteCardProps) {
  const swipeableRef = useRef<SwipeableMethods>(null);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutate: handleDelete } = useMutation({
    mutationFn: () => deleteNote(note.id),
    onMutate: async () => {
      const queryKey = notesQueryKey(folderId);

      await queryClient.cancelQueries({ queryKey });

      const previousData =
        queryClient.getQueryData<InfiniteData<NotesPage>>(queryKey);

      queryClient.setQueryData<InfiniteData<NotesPage>>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            notes: page.notes.filter((n) => n.id !== note.id),
          })),
        };
      });

      return { previousData, queryKey };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
      showToast("Something went wrong. Please try again.");
    },
    onSuccess: (result, _vars, context) => {
      if (result.error && context?.previousData) {
        queryClient.setQueryData(context.queryKey, context.previousData);
        showToast(result.error);
      }
    },
  });

  const confirmDelete = () => {
    Alert.alert(
      "Delete note?",
      "This can't be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => swipeableRef.current?.close(),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            swipeableRef.current?.close();
            handleDelete();
          },
        },
      ],
      { onDismiss: () => swipeableRef.current?.close() },
    );
  };

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      overshootRight={false}
      rightThreshold={40}
      containerStyle={{ marginBottom: 12 }}
      renderRightActions={() => <SwipeDeleteAction onPress={confirmDelete} />}
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
