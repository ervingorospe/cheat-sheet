import { Folder } from "@/lib/folders";
import { ChevronRight, Folder as FolderIcon } from "@tamagui/lucide-icons-2";
import { Link } from "expo-router";
import { forwardRef, memo } from "react";
import { GetProps, SizableText, XStack } from "tamagui";

type FolderCardProps = {
  folder: Folder;
};

function FolderCard({ folder }: FolderCardProps) {
  return (
    <Link
      href={{
        pathname: "/folders/[id]",
        params: { id: folder.id },
      }}
      asChild
    >
      <FolderCardContent folder={folder} />
    </Link>
  );
}

export default memo(FolderCard);

type FolderCardContentProps = {
  folder: Folder;
} & GetProps<typeof XStack>;

const FolderCardContent = forwardRef<any, FolderCardContentProps>(
  ({ folder, ...props }, ref) => {
    return (
      <XStack
        ref={ref}
        alignItems="center"
        justifyContent="space-between"
        paddingVertical="$md"
        pressStyle={{
          opacity: 0.6,
        }}
        {...props}
      >
        <XStack alignItems="center" gap="$md" flex={1}>
          <FolderIcon size="$1.5" color="$brand" />

          <SizableText
            flex={1}
            color="$textBody"
            fontSize="$3"
            fontWeight="400"
            numberOfLines={1}
          >
            {folder.name}
          </SizableText>
        </XStack>

        <ChevronRight size="$1" color="$secondary" />
      </XStack>
    );
  },
);

FolderCardContent.displayName = "FolderCardContent";
