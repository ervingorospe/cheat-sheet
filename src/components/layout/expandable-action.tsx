import ExpandableActionButton from "@/components/common/expandable-action-button";
import { PickedMedia, useMediaPicker } from "@/hooks/use-media-picker";
import { useNoteGeneration } from "@/hooks/use-note-generation";
import { getFriendlyErrorMessage } from "@/lib/errors";
import { createNote } from "@/lib/notes";
import { useLoadingOverlay } from "@/providers/loading-overlay-provider";
import { useToast } from "@/providers/toast-provider";
import { Camera, Upload } from "@tamagui/lucide-icons-2";

export default function ExpandableAction() {
  const { pickFromLibrary, pickFromCamera } = useMediaPicker();
  const { generateNotes, cancelGeneration } = useNoteGeneration();
  const { show: showLoading, hide: hideLoading } = useLoadingOverlay();
  const { showToast } = useToast();

  const generateAndSave = async (mediaItems: PickedMedia[]) => {
    showLoading({ message: "Generating Notes...", onCancel: cancelGeneration });
    const generationResult = await generateNotes(mediaItems);

    if (generationResult.cancelled) return;

    if (generationResult.error || !generationResult.data) {
      console.error("Failed to generate notes:", generationResult.error);
      showToast(getFriendlyErrorMessage(generationResult.error));
      return;
    }

    showLoading({ message: "Saving your note..." });

    const { error: saveError } = await createNote(generationResult.data);

    hideLoading();

    if (saveError) {
      console.error("Failed to save note:", saveError);
      showToast(getFriendlyErrorMessage(saveError));
      return;
    }

    // TODO: navigate to the new note, or refresh whatever list is showing notes
  };

  const actions = [
    {
      key: "upload",
      icon: Upload,
      onPress: async () => {
        const mediaItems = await pickFromLibrary();
        if (mediaItems.length === 0) return;
        await generateAndSave(mediaItems);
      },
    },
    {
      key: "camera",
      icon: Camera,
      onPress: async () => {
        const media = await pickFromCamera();
        if (!media) return;
        await generateAndSave([media]);
      },
    },
  ];

  return <ExpandableActionButton actions={actions} />;
}
