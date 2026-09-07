import Screen from "@/components/layout/screen";
import NoteDetailEdit from "@/components/notes/note-detail-edit";
import NoteDetailSkeleton from "@/components/notes/note-detail-skeleton";
import NoteDetailView from "@/components/notes/note-detail-view";
import { Button, Paragraph } from "@/components/theme";
import { useDeleteNote } from "@/hooks/use-delete-note";
import { useNote } from "@/hooks/use-note";
import { UpdateNoteInput, updateNote } from "@/lib/notes";
import { useToast } from "@/providers/toast-provider";
import { IconActionProps } from "@/types/common/icon-action.type";
import {
  FolderInput,
  Home,
  Library,
  Pencil,
  Trash2,
} from "@tamagui/lucide-icons-2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView } from "react-native";
import { Spinner, XStack, YStack } from "tamagui";

export const actionButtons: IconActionProps[] = [
  {
    key: "home",
    icon: Home,
    onPress: () => {},
  },
  {
    key: "library",
    icon: Library,
    onPress: () => {},
  },
];

export default function NoteDetailScreen() {
  const router = useRouter();

  const { id, isEdit } = useLocalSearchParams<{
    id: string;
    isEdit?: string;
  }>();
  const { data: note, isLoading } = useNote(id);
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [isEditing, setIsEditing] = useState(isEdit === "true");

  const { mutate: saveNote, isPending: isSaving } = useMutation({
    mutationFn: (updates: UpdateNoteInput) => updateNote(id, updates),
    onSuccess: (result) => {
      if (result.error || !result.data) {
        showToast(result.error ?? "Something went wrong. Please try again.");
        return;
      }

      queryClient.setQueryData(["notes", "detail", id], result.data);
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "notes" && query.queryKey[1] !== "detail",
      });
      showToast("Saved.", "success");
      setIsEditing(false);
    },
    onError: () => {
      showToast("Something went wrong. Please try again.");
    },
  });

  const { confirmDeleteNote, isDeleting } = useDeleteNote(id, {
    onDeleted: () => {
      queryClient.removeQueries({
        queryKey: ["notes", "detail", id],
      });

      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "notes" && query.queryKey[1] !== "detail",
      });

      router.back();
    },
  });

  const isBusy = isSaving || isDeleting;

  if (isLoading) {
    return (
      <Screen>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20 }}
        >
          <NoteDetailSkeleton />
        </ScrollView>
      </Screen>
    );
  }

  if (!note) {
    return (
      <Screen>
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Paragraph color="$muted">This note could not be found.</Paragraph>
        </YStack>
      </Screen>
    );
  }

  return (
    <Screen>
      {isEditing ? (
        <NoteDetailEdit
          note={note}
          isSaving={isSaving}
          onSave={saveNote}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={{ padding: 10, paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          >
            <NoteDetailView note={note} />
          </ScrollView>

          <YStack
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            alignItems="center"
            paddingBottom="$xl"
            paddingTop="$md"
            paddingHorizontal="40"
            backgroundColor="$background"
          >
            <XStack
              width="100%"
              alignItems="center"
              justifyContent="space-between"
            >
              <Button
                variant="text"
                color="$error"
                icon={
                  isDeleting ? <Spinner size="small" /> : <Trash2 size={16} />
                }
                onPress={confirmDeleteNote}
                opacity={isBusy ? 0.5 : 1}
                disabled={isBusy}
              >
                Delete
              </Button>

              <XStack justifyContent="flex-end" gap="$xl">
                <Button
                  variant="text"
                  icon={<FolderInput size={16} />}
                  onPress={() => {}}
                >
                  Move
                </Button>

                <Button
                  variant="text"
                  color="$primary"
                  icon={<Pencil size={16} />}
                  onPress={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              </XStack>
            </XStack>
          </YStack>
        </>
      )}
    </Screen>
  );
}
