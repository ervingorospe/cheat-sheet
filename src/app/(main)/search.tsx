import NoteCard from "@/components/notes/note-card";
import NoteCardSkeleton from "@/components/notes/note-card-skeleton";
import { SizableText } from "@/components/theme";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useSearchNotes } from "@/hooks/use-search-notes";
import { Search } from "@tamagui/lucide-icons-2";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList } from "react-native";
import { Input, XStack, YStack } from "tamagui";

const MIN_QUERY_LENGTH = 3;
const DEBOUNCE_MS = 350;

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim();
  const shouldSearch = trimmedQuery.length >= MIN_QUERY_LENGTH;
  const debouncedQuery = useDebouncedValue(trimmedQuery, DEBOUNCE_MS);

  const { data: results, isLoading } = useSearchNotes(
    shouldSearch ? debouncedQuery : "",
  );

  return (
    <YStack flex={1} paddingHorizontal="$lg" paddingTop="$lg">
      <XStack alignItems="center" gap="$sm">
        <XStack
          flex={1}
          alignItems="center"
          backgroundColor="$paperVariant"
          borderRadius={100}
          paddingHorizontal="$md"
          height={44}
        >
          <Input
            flex={1}
            backgroundColor="transparent"
            borderWidth={0}
            paddingHorizontal={0}
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="Search notes..."
            returnKeyType="search"
          />
          <Search size={18} color="$secondary" />
        </XStack>

        <SizableText
          color="$primary"
          fontWeight="600"
          onPress={() => router.back()}
        >
          Cancel
        </SizableText>
      </XStack>

      <YStack flex={1} marginTop="$lg">
        {!shouldSearch ? (
          <YStack alignItems="center" paddingTop="$xxl">
            <SizableText color="$secondary">
              Type at least {MIN_QUERY_LENGTH} characters to search
            </SizableText>
          </YStack>
        ) : isLoading ? (
          <YStack paddingVertical="$lg">
            {Array.from({ length: 3 }).map((_, index) => (
              <NoteCardSkeleton key={index} />
            ))}
          </YStack>
        ) : (
          <FlatList
            data={results ?? []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <NoteCard note={item} />}
            ListEmptyComponent={
              <YStack alignItems="center" paddingTop="$xxl">
                <SizableText color="$secondary">No notes found</SizableText>
              </YStack>
            }
          />
        )}
      </YStack>
    </YStack>
  );
}
