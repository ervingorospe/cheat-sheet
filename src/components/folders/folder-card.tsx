import { Paper } from "@/components/theme";
import { Folder } from "@/lib/folders";
import { Folder as FolderIcon } from "@tamagui/lucide-icons-2";
import { Link } from "expo-router";
import { forwardRef, memo } from "react";
import { GetProps, SizableText, XStack } from "tamagui";

function FolderCard({ folder }: { folder: Folder }) {
  return (
    <Link
      href={{ pathname: "/folders/[id]", params: { id: folder.id } }}
      asChild
    >
      <FolderCardContent folder={folder} />
    </Link>
  );
}

export default memo(FolderCard);

type FolderCardContentProps = { folder: Folder } & GetProps<typeof Paper>;

const FolderCardContent = forwardRef<any, FolderCardContentProps>(
  ({ folder, ...props }, ref) => {
    return (
      <Paper
        ref={ref}
        marginBottom="$sm"
        pressStyle={{ scale: 0.98, opacity: 0.85 }}
        {...props}
      >
        <XStack alignItems="center" gap="$md" paddingVertical="$sm">
          <FolderIcon size="$1.5" color="$primary" />
          <SizableText fontSize="$4" fontWeight="400" numberOfLines={1}>
            {folder.name}
          </SizableText>
        </XStack>
      </Paper>
    );
  },
);

FolderCardContent.displayName = "FolderCardContent";
