import { Paper } from "@/components/theme";
import { useHomeStats } from "@/hooks/use-home-stats";
import { FileText, Folder } from "@tamagui/lucide-icons-2";
import { SizableText, XStack } from "tamagui";

export default function HomeStats() {
  const { data } = useHomeStats();

  return (
    <XStack gap="$sm" marginBottom="$xl">
      <StatCard icon={FileText} count={data?.notesCount ?? 0} label="Notes" />
      <StatCard icon={Folder} count={data?.foldersCount ?? 0} label="Folders" />
    </XStack>
  );
}

function StatCard({
  icon: Icon,
  count,
  label,
}: {
  icon: typeof FileText;
  count: number;
  label: string;
}) {
  return (
    <Paper flex={1} paddingVertical="$md" alignItems="center" gap="$xs">
      <Icon size={20} color="$primary" />
      <SizableText fontSize="$7" fontWeight="700">
        {count}
      </SizableText>
      <SizableText fontSize="$2" color="$secondary">
        {label}
      </SizableText>
    </Paper>
  );
}
