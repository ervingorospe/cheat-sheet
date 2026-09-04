import Screen from "@/components/layout/screen";
import NotesList from "@/components/notes/notes-list";

export default function LibraryScreen() {
  return (
    <Screen>
      <NotesList />
    </Screen>
  );
}

/**
import Screen from "@/components/layout/screen";
import NotesList from "@/components/notes/notes-list";
import { useLocalSearchParams } from "expo-router";

export default function FolderScreen() {
  const { folderId } = useLocalSearchParams<{ folderId: string }>();

  return (
    <Screen>
      <NotesList folderId={folderId} emptyMessage="This folder is empty" />
    </Screen>
  );
}
 */
