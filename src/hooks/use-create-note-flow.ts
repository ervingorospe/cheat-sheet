import { PickedMedia, useMediaPicker } from "@/hooks/use-media-picker";
import { useNoteGeneration } from "@/hooks/use-note-generation";
import {
  getNoteGenerationErrorMessage,
  MEDIA_PICKER_ERROR_MESSAGES,
} from "@/lib/errors";
import { createNote, deleteNoteImage, uploadNoteImage } from "@/lib/notes";
import { useLoadingOverlay } from "@/providers/loading-overlay-provider";
import { useToast } from "@/providers/toast-provider";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";

export function useCreateNoteFlow(folderId: string | null = null) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { pickFromLibrary, pickFromCamera } = useMediaPicker();
  const { generateNotes, cancelGeneration } = useNoteGeneration();
  const { show: showLoading, hide: hideLoading } = useLoadingOverlay();
  const { showToast } = useToast();

  const generateAndSave = async (mediaItems: PickedMedia[]) => {
    const [generationResult, uploadResults] = await Promise.all([
      generateNotes(mediaItems),
      Promise.all(mediaItems.map((media) => uploadNoteImage(media.uri))),
    ]);

    const uploadedUrls = uploadResults
      .filter((result): result is { url: string; error: null } =>
        Boolean(result.url),
      )
      .map((result) => result.url);

    if (generationResult.cancelled) {
      await Promise.all(uploadedUrls.map((url) => deleteNoteImage(url)));
      return;
    }

    if (generationResult.error || !generationResult.data) {
      console.error("Failed to generate notes:", generationResult.error);
      showToast(getNoteGenerationErrorMessage(generationResult.error));
      await Promise.all(uploadedUrls.map((url) => deleteNoteImage(url)));
      return;
    }

    showLoading({ message: "Saving your note..." });

    const { data: note, error: saveError } = await createNote(
      generationResult.data,
      uploadedUrls,
      folderId,
    );

    hideLoading();

    if (saveError || !note) {
      console.error("Failed to save note:", saveError);
      showToast(getNoteGenerationErrorMessage(saveError));
      await Promise.all(uploadedUrls.map((url) => deleteNoteImage(url)));
      return;
    }

    queryClient.invalidateQueries({
      predicate: (query) =>
        query.queryKey[0] === "notes" && query.queryKey[1] !== "detail",
    });

    router.push(`/notes/${note.id}`);
  };

  const startFromLibrary = async () => {
    const result = await pickFromLibrary();

    if (result.error) {
      showToast(MEDIA_PICKER_ERROR_MESSAGES[result.error]);
      return;
    }

    if (result.cancelled || !result.data) {
      return;
    }

    showLoading({ message: "Generating Notes...", onCancel: cancelGeneration });
    await generateAndSave(result.data);
  };

  const startFromCamera = async () => {
    const result = await pickFromCamera();

    if (result.error) {
      showToast(MEDIA_PICKER_ERROR_MESSAGES[result.error]);
      return;
    }

    if (result.cancelled || !result.data) {
      return;
    }

    showLoading({ message: "Generating Notes...", onCancel: cancelGeneration });
    await generateAndSave([result.data]);
  };

  return { startFromLibrary, startFromCamera };
}