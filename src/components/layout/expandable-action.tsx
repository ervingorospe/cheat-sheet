import ExpandableActionButton from "@/components/common/expandable-action-button";
import { PickedMedia, useMediaPicker } from "@/hooks/use-media-picker";
import { useNoteGeneration } from "@/hooks/use-note-generation";
import { createNote } from "@/lib/notes";
import { useLoadingOverlay } from "@/providers/loading-overlay-provider";
import { Camera, Upload } from "@tamagui/lucide-icons-2";

export default function ExpandableAction() {
  const { pickFromLibrary, pickFromCamera } = useMediaPicker();
  const { generateNotes } = useNoteGeneration();
  const { show: showLoading, hide: hideLoading } = useLoadingOverlay();

  const generateAndSave = async (mediaItems: PickedMedia[]) => {
    const generationResult = await generateNotes(mediaItems);

    if (generationResult.cancelled) return;

    if (generationResult.error || !generationResult.data) {
      console.error("Failed to generate notes:", generationResult.error);
      return;
    }

    // generateNotes left the overlay showing on success — update its
    // message and continue, rather than a hide/show flicker.
    showLoading({ message: "Saving your note..." });

    const { error: saveError } = await createNote(generationResult.data);

    hideLoading();

    if (saveError) {
      console.error("Failed to save note:", saveError);
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
