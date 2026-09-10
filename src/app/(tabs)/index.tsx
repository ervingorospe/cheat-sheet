import EmptyHomeState from "@/components/home/empty-home-state";
import HomeGreeting from "@/components/home/home-greeting";
import HomeQuickActions from "@/components/home/home-quick-actions";
import HomeStats from "@/components/home/home-stats";
import RecentNotesSection from "@/components/home/recent-notes-section";
import ExpandableAction from "@/components/layout/expandable-action";
import Screen from "@/components/layout/screen";
import NoteSearchTrigger from "@/components/notes/note-search-trigger";
import { useHomeStats } from "@/hooks/use-home-stats";
import { ScrollView } from "react-native";
import { XStack } from "tamagui";

export default function HomeScreen() {
  const { data: stats, isLoading: isStatsLoading } = useHomeStats();
  const hasAnyNotes = !isStatsLoading && (stats?.notesCount ?? 0) > 0;

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <HomeGreeting />
        <NoteSearchTrigger />
        <HomeQuickActions />

        {isStatsLoading ? null : hasAnyNotes ? (
          <>
            <HomeStats />
            <RecentNotesSection />
          </>
        ) : (
          <EmptyHomeState />
        )}
      </ScrollView>

      <XStack position="absolute" bottom="$xl" right="$xl">
        <ExpandableAction />
      </XStack>
    </Screen>
  );
}
