import Screen from "@/components/layout/screen";
import NoteDetailEdit from "@/components/notes/note-detail-edit";
import NoteDetailSkeleton from "@/components/notes/note-detail-skeleton";
import NoteDetailView from "@/components/notes/note-detail-view";
import { Paragraph } from "@/components/theme";
import { useNote } from "@/hooks/use-note";
import { UpdateNoteInput, updateNote } from "@/lib/notes";
import { useToast } from "@/providers/toast-provider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ScrollView } from "react-native";
import { YStack } from "tamagui";

export default function NoteDetailScreen() {
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
        <ScrollView
          contentContainerStyle={{ padding: 10 }}
          showsVerticalScrollIndicator={false}
        >
          <NoteDetailView note={note} onEdit={() => setIsEditing(true)} />
        </ScrollView>
      )}
    </Screen>
  );
}
