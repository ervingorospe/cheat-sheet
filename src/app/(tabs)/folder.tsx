import IconAction from "@/components/common/icon-action";
import Screen from "@/components/layout/screen";
import { SizableText } from "@/components/theme";
import { FolderPlus } from "@tamagui/lucide-icons-2";
import { XStack } from "tamagui";

export default function FolderScreen() {
  return (
    <Screen>
      <XStack alignItems="center" justifyContent="flex-end">
        <IconAction
          key="add folder"
          size="$2"
          icon={FolderPlus}
          onPress={() => {}}
        />
      </XStack>

      <SizableText size="$6" fontWeight="600">
        Folders
      </SizableText>
    </Screen>
  );
}
