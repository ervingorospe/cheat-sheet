import ExpandableActionButton from "@/components/common/expandable-action-button";
import { PickedMedia, useMediaPicker } from "@/hooks/use-media-picker";
import { useNoteGeneration } from "@/hooks/use-note-generation";
import {
  getNoteGenerationErrorMessage,
  MEDIA_PICKER_ERROR_MESSAGES,
} from "@/lib/errors";
import { createNote, deleteNoteImage, uploadNoteImage } from "@/lib/notes";
import { useLoadingOverlay } from "@/providers/loading-overlay-provider";
import { useToast } from "@/providers/toast-provider";
import { Camera, Upload } from "@tamagui/lucide-icons-2";
import { useRouter } from "expo-router";

export default function ExpandableAction() {
  const router = useRouter();
  const { pickFromLibrary, pickFromCamera } = useMediaPicker();
  const { generateNotes, cancelGeneration } = useNoteGeneration();
  const { show: showLoading, hide: hideLoading } = useLoadingOverlay();
  const { showToast } = useToast();

  const generateAndSave = async (mediaItems: PickedMedia[]) => {
    showLoading({ message: "Generating Notes...", onCancel: cancelGeneration });

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
    );

    hideLoading();

    if (saveError || !note) {
      console.error("Failed to save note:", saveError);
      showToast(getNoteGenerationErrorMessage(saveError));
      await Promise.all(uploadedUrls.map((url) => deleteNoteImage(url)));
      return;
    }

    router.push(`/notes/${note.id}`);
  };

  const actions = [
    {
      key: "upload",
      icon: Upload,
      onPress: async () => {
        const result = await pickFromLibrary();

        if (result.error) {
          showToast(MEDIA_PICKER_ERROR_MESSAGES[result.error]);
          return;
        }
        if (result.cancelled || !result.data) return;

        await generateAndSave(result.data);
      },
    },
    {
      key: "camera",
      icon: Camera,
      onPress: async () => {
        const result = await pickFromCamera();

        if (result.error) {
          showToast(MEDIA_PICKER_ERROR_MESSAGES[result.error]);
          return;
        }
        if (result.cancelled || !result.data) return;

        await generateAndSave([result.data]);
      },
    },
  ];

  return <ExpandableActionButton actions={actions} />;
}
