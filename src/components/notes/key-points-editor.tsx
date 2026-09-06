import Form from "@/components/common/form";
import { Button } from "@/components/theme";
import { Plus, X } from "@tamagui/lucide-icons-2";
import { Control, FieldValues, Path, useFieldArray } from "react-hook-form";
import { XStack, YStack } from "tamagui";

type KeyPointsEditorProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
};

type KeyPointField = {
  id: string;
  value: string;
};

export default function KeyPointsEditor<T extends FieldValues>({
  control,
  name,
}: KeyPointsEditorProps<T>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as never,
  });

  return (
    <YStack gap="$md">
      {(fields as unknown as KeyPointField[]).map((field, index) => (
        <XStack key={field.id} gap="$sm" alignItems="center">
          <Form.TextArea
            name={`${name}.${index}.value` as Path<T>}
            control={control}
            placeholder="Key point"
            minHeight={80}
            flex={1}
          />

          <Button
            size="$3"
            variant="text"
            icon={<X size={16} color="$error" />}
            onPress={() => remove(index)}
          />
        </XStack>
      ))}

      <Button
        size="$3"
        variant="text"
        color="$primary"
        icon={<Plus size={16} />}
        onPress={() => append({ value: "" } as never)}
      >
        Add key point
      </Button>
    </YStack>
  );
}
