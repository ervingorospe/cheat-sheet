import Form from "@/components/common/form";
import { Button } from "@/components/theme";
import { Plus, X } from "@tamagui/lucide-icons-2";
import { Control, FieldValues, Path, useFieldArray } from "react-hook-form";
import { XStack, YStack } from "tamagui";

type DocLinksEditorProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
};

type DocLinkField = { id: string; label: string; url: string };

export default function DocLinksEditor<T extends FieldValues>({
  control,
  name,
}: DocLinksEditorProps<T>) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: name as never,
  });

  return (
    <YStack gap="$sm">
      {(fields as unknown as DocLinkField[]).map((field, index) => (
        <XStack key={field.id} gap="$sm" alignItems="center">
          <YStack flex={1} gap="$xs">
            <Form.Input
              name={`${name}.${index}.label` as Path<T>}
              control={control}
              placeholder="Label"
            />
            <Form.Input
              name={`${name}.${index}.url` as Path<T>}
              control={control}
              placeholder="https://..."
              autoCapitalize="none"
              keyboardType="url"
            />
          </YStack>
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
        onPress={() => append({ label: "", url: "" } as never)}
      >
        Add link
      </Button>
    </YStack>
  );
}
