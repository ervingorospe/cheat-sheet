import IconAction from "@/components/common/icon-action";
import { IconActionProps } from "@/types/common/icon-action.type";
import { FolderInput, Pencil, Trash2 } from "@tamagui/lucide-icons-2";

type NoteActionButtonsProps = {
  onEdit: () => void;
  onDelete: () => void;
  size?: string | number;
};

export default function NoteActionButtons({
  onEdit,
  onDelete,
  size = 20,
}: NoteActionButtonsProps) {
  const handleMove = () => {
    console.log("move");
  };

  const actionButtons: IconActionProps[] = [
    {
      key: "edit",
      icon: Pencil,
      color: "$primary",
      onPress: () => onEdit(),
    },
    {
      key: "move",
      icon: FolderInput,
      color: "$secondary",
      onPress: () => handleMove(),
    },
    {
      key: "delete",
      icon: Trash2,
      color: "$error",
      onPress: () => onDelete(),
    },
  ];

  return (
    <>
      {actionButtons.map((action: IconActionProps) => (
        <IconAction
          key={action.key}
          icon={action.icon}
          onPress={action.onPress}
          color={action.color}
          size={size}
        />
      ))}
    </>
  );
}
