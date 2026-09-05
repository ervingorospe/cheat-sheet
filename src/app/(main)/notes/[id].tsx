import Screen from "@/components/layout/screen";
import NoteDetailSkeleton from "@/components/notes/note-detail-skeleton";
import { H3, Paragraph, SizableText } from "@/components/theme";
import { useNote } from "@/hooks/use-note";
import { useLocalSearchParams } from "expo-router";
import { ScrollView } from "react-native";
import { XStack, YStack } from "tamagui";

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: note, isLoading } = useNote(id);

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

  const keyPoints = Array.isArray(note.key_points)
    ? (note.key_points as string[])
    : [];

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <H3>{note.title || "Untitled note"}</H3>
        <Paragraph color="$muted" marginTop="$xs" marginBottom="$lg">
          {formatDate(note.created_at)}
        </Paragraph>

        {note.content && (
          <YStack marginBottom="$lg">
            <Paragraph>{note.content}</Paragraph>
          </YStack>
        )}

        {keyPoints.length > 0 && (
          <YStack gap="$sm">
            <SizableText fontSize="$5" fontWeight="700" marginBottom="$xs">
              Key Points
            </SizableText>

            {keyPoints.map((point, index) => (
              <XStack key={index} gap="$sm" alignItems="flex-start">
                <SizableText color="$primary" fontWeight="700">
                  •
                </SizableText>
                <Paragraph flex={1}>{point}</Paragraph>
              </XStack>
            ))}
          </YStack>
        )}
      </ScrollView>
    </Screen>
  );
}
