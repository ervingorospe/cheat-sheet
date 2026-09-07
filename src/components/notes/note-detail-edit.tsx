import Form from "@/components/common/form";
import DocLinksEditor from "@/components/notes/doc-links-editor";
import ImageLinksEditor from "@/components/notes/image-links-editor";
import KeyPointsEditor from "@/components/notes/key-points-editor";
import { AppFormInputs, Button, SizableText } from "@/components/theme";
import { useDeleteNote } from "@/hooks/use-delete-note";
import {
  Note,
  UpdateNoteInput,
  deleteNoteImage,
  toDocLinks,
  toImageLinks,
  toKeyPoints,
} from "@/lib/notes";
import { useAppHeaderHeight } from "@/providers/header-height-provider";
import { useToast } from "@/providers/toast-provider";
import {
  NoteEditFormValues,
  noteEditSchema,
} from "@/schema/notes/note-edit.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Trash2, X } from "@tamagui/lucide-icons-2";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { Platform } from "react-native";
import {
  KeyboardAvoidingView,
  KeyboardStickyView,
} from "react-native-keyboard-controller";
import { ScrollView, Spinner, XStack, YStack } from "tamagui";

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
  const { appHeaderHeight } = useAppHeaderHeight();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const originalImages = toImageLinks(note.image_links);

  const { control, handleSubmit, getValues } = useForm<NoteEditFormValues>({
    resolver: zodResolver(noteEditSchema),
    defaultValues: {
      title: note.title ?? "",
      content: note.content ?? "",
      key_points: toKeyPoints(note.key_points).map((value) => ({ value })),
      doc_links: toDocLinks(note.doc_links),
      image_links: originalImages,
    },
    mode: "onChange",
  });

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

  const handleCancel = () => {
    const currentImages = getValues("image_links") ?? [];

    const unsavedUploads = currentImages.filter(
      (url) => !originalImages.includes(url),
    );

    if (unsavedUploads.length > 0) {
      Promise.all(unsavedUploads.map((url) => deleteNoteImage(url)));
    }

    onCancel();
  };

  const onSubmit = (values: NoteEditFormValues) => {
    const removedImages = originalImages.filter(
      (url) => !values.image_links.includes(url),
    );

    if (removedImages.length > 0) {
      console.log("Removing images from storage on save:", removedImages);

      Promise.all(removedImages.map((url) => deleteNoteImage(url))).then(
        (results) => {
          console.log("Removed-image cleanup results:", results);
        },
      );
    }

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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={appHeaderHeight}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingBottom: 100,
        }}
      >
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

            <ImageLinksEditor
              control={control}
              name="image_links"
              originalImages={originalImages}
            />

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

      <KeyboardStickyView
        offset={{ closed: 0, opened: 0 }}
        style={{
          position: "absolute",
          bottom: -30,
          left: 0,
          right: 0,
        }}
      >
        <YStack
          alignItems="center"
          paddingTop="$sm"
          paddingBottom="$xl"
          paddingHorizontal="15"
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
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>

            <XStack justifyContent="flex-end" gap="$xl">
              <Button
                variant="text"
                icon={<X size={16} />}
                onPress={handleCancel}
                opacity={isBusy ? 0.5 : 1}
                disabled={isBusy}
              >
                Cancel
              </Button>

              <Button
                variant="text"
                color="$primary"
                icon={isSaving ? <Spinner size="small" /> : <Check size={16} />}
                onPress={handleSubmit(onSubmit, onInvalid)}
                opacity={isBusy ? 0.5 : 1}
                disabled={isBusy}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </XStack>
          </XStack>
        </YStack>
      </KeyboardStickyView>
    </KeyboardAvoidingView>
  );
}
