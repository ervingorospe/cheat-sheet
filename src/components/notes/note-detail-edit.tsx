import Form from "@/components/common/form";
import DocLinksEditor from "@/components/notes/doc-links-editor";
import ImageLinksEditor from "@/components/notes/image-links-editor";
import KeyPointsEditor from "@/components/notes/key-points-editor";
import { AppFormInputs, Button, SizableText } from "@/components/theme";
import { confirmDelete } from "@/lib/alerts";
import {
  Note,
  UpdateNoteInput,
  deleteNote,
  toDocLinks,
  toImageLinks,
  toKeyPoints,
} from "@/lib/notes";
import { useToast } from "@/providers/toast-provider";
import {
  NoteEditFormValues,
  noteEditSchema,
} from "@/schema/notes/note-edit.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Trash2, X } from "@tamagui/lucide-icons-2";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { ScrollView, Spinner, XStack } from "tamagui";

type NoteDetailEditProps = {
  note: Note;
  isSaving: boolean;
  onSave: (updates: UpdateNoteInput) => void;
  onCancel: () => void;
};

export default function NoteDetailEdit({
  note,
  isSaving,
  onSave,
  onCancel,
}: NoteDetailEditProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { control, handleSubmit } = useForm<NoteEditFormValues>({
    resolver: zodResolver(noteEditSchema),
    defaultValues: {
      title: note.title ?? "",
      content: note.content ?? "",
      key_points: toKeyPoints(note.key_points).map((value) => ({ value })),
      doc_links: toDocLinks(note.doc_links),
      image_links: toImageLinks(note.image_links),
    },
    mode: "onChange",
  });

  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteNote(note.id),
    onSuccess: (result) => {
      if (result.error) {
        showToast(result.error);
        return;
      }

      queryClient.removeQueries({ queryKey: ["notes", "detail", note.id] });
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "notes" && query.queryKey[1] !== "detail",
      });

      router.back();
    },
    onError: () => {
      showToast("Something went wrong. Please try again.");
    },
  });

  const handleDeletePress = () => {
    confirmDelete({
      title: "Delete note?",
      onConfirm: () => handleDelete(),
    });
  };

  const onSubmit = (values: NoteEditFormValues) => {
    onSave({
      title: values.title,
      content: values.content ?? "",
      key_points: values.key_points
        .map((point) => point.value)
        .filter((value) => value.trim().length > 0),
      doc_links: values.doc_links.filter((link) => link.url.trim().length > 0),
      image_links: values.image_links,
    });
  };

  const onInvalid = () => {
    showToast("Please fix the validation errors before saving.");
  };

  const isBusy = isSaving || isDeleting;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[0]}
      contentContainerStyle={{ paddingHorizontal: 10 }}
    >
      <XStack
        justifyContent="space-between"
        backgroundColor="$background"
        paddingVertical="$md"
        zIndex={10}
      >
        <Button
          variant="text"
          color="$error"
          icon={isDeleting ? <Spinner size="small" /> : <Trash2 size={16} />}
          onPress={handleDeletePress}
          opacity={isBusy ? 0.5 : 1}
          disabled={isBusy}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>

        <XStack justifyContent="flex-end" gap="$md">
          <Button
            variant="text"
            icon={<X size={16} />}
            onPress={onCancel}
            opacity={isBusy ? 0.5 : 1}
            disabled={isBusy}
          >
            Cancel
          </Button>

          <Button
            variant="outline"
            icon={isSaving ? <Spinner size="small" /> : <Check size={16} />}
            onPress={handleSubmit(onSubmit, onInvalid)}
            opacity={isBusy ? 0.5 : 1}
            disabled={isBusy}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </XStack>
      </XStack>
      <Form>
        <AppFormInputs>
          <Form.Input
            name="title"
            control={control}
            label="Title"
            placeholder="Note title"
          />

          <Form.TextArea
            name="content"
            control={control}
            label="Summary"
            placeholder="Summary"
            multiline
            numberOfLines={10}
          />

          <SizableText fontSize="$3" fontWeight="700">
            Images
          </SizableText>
          <ImageLinksEditor control={control} name="image_links" />

          <SizableText fontSize="$3" fontWeight="700">
            Key Points
          </SizableText>
          <KeyPointsEditor control={control} name="key_points" />

          <SizableText fontSize="$3" fontWeight="700">
            Links
          </SizableText>
          <DocLinksEditor control={control} name="doc_links" />
        </AppFormInputs>
      </Form>
    </ScrollView>
  );
}
