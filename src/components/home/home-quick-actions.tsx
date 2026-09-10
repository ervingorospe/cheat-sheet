import CreateFolderSheet from "@/components/folders/create-folder-sheet";
import { Paper } from "@/components/theme";
import { useCreateNoteFlow } from "@/hooks/use-create-note-flow";
import { FolderPlus, Upload } from "@tamagui/lucide-icons-2";
import { useState } from "react";
import { SizableText, XStack } from "tamagui";

export default function HomeQuickActions() {
  const { startFromLibrary } = useCreateNoteFlow();
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

  return (
    <>
      <XStack gap="$sm" marginBottom="$xl">
        <QuickActionCard
          icon={Upload}
          label="New Note"
          onPress={startFromLibrary}
        />
        <QuickActionCard
          icon={FolderPlus}
          label="New Folder"
          onPress={() => setIsCreateFolderOpen(true)}
        />
      </XStack>

      <CreateFolderSheet
        open={isCreateFolderOpen}
        parentFolderId={null}
        onClose={() => setIsCreateFolderOpen(false)}
      />
    </>
  );
}

function QuickActionCard({
  icon: Icon,
  label,
  onPress,
}: {
  icon: typeof Upload;
  label: string;
  onPress: () => void;
}) {
  return (
    <Paper
      flex={1}
      paddingVertical="$lg"
      alignItems="center"
      gap="$sm"
      pressStyle={{ scale: 0.97, opacity: 0.85 }}
      onPress={onPress}
    >
      <Icon size={24} color="$primary" />
      <SizableText fontWeight="600">{label}</SizableText>
    </Paper>
  );
}
