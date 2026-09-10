import ExpandableActionButton from "@/components/common/expandable-action-button";
import { useCreateNoteFlow } from "@/hooks/use-create-note-flow";
import { Camera, Upload } from "@tamagui/lucide-icons-2";

type ExpandableActionProps = {
  folderId?: string | null;
};

export default function ExpandableAction({
  folderId = null,
}: ExpandableActionProps) {
  const { startFromLibrary, startFromCamera } = useCreateNoteFlow(folderId);

  const actions = [
    { key: "upload", icon: Upload, onPress: startFromLibrary },
    { key: "camera", icon: Camera, onPress: startFromCamera },
  ];

  return <ExpandableActionButton actions={actions} />;
}
