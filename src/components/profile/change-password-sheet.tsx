import Form from "@/components/common/form";
import SheetModal from "@/components/common/sheet-modal";
import { Button } from "@/components/theme";
import { useUpdatePassword } from "@/hooks/use-update-password";
import { useToast } from "@/providers/toast-provider";
import {
  ChangePasswordFormValues,
  changePasswordSchema,
} from "@/schema/auth/profile-edit.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X } from "@tamagui/lucide-icons-2";
import { useForm } from "react-hook-form";
import { SizableText, Spinner, XStack, YStack } from "tamagui";

type ChangePasswordSheetProps = {
  open: boolean;
  onClose: () => void;
};

export default function ChangePasswordSheet({
  open,
  onClose,
}: ChangePasswordSheetProps) {
  const { mutateAsync, isPending } = useUpdatePassword();
  const { showToast } = useToast();

  const { control, handleSubmit, reset } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
    mode: "onChange",
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (values: ChangePasswordFormValues) => {
    const result = await mutateAsync(values.newPassword);

    if (result.error) {
      showToast(result.error);
      return;
    }

    showToast("Password updated.");
    handleClose();
  };

  return (
    <SheetModal open={open} onClose={handleClose}>
      <YStack gap="$lg" paddingHorizontal={15} marginTop={20}>
        <SizableText fontSize="$6" fontWeight="700">
          Change Password
        </SizableText>

        <Form
          actions={
            <XStack justifyContent="flex-end" gap="$lg">
              <Button
                variant="text"
                icon={<X size={16} />}
                onPress={handleClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                icon={
                  isPending ? <Spinner size="small" /> : <Check size={16} />
                }
                onPress={handleSubmit(onSubmit)}
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Save"}
              </Button>
            </XStack>
          }
        >
          <Form.Input
            name="newPassword"
            control={control}
            label="New Password"
            placeholder="At least 6 characters"
            secureTextEntry
          />
          <Form.Input
            name="confirmPassword"
            control={control}
            label="Confirm New Password"
            placeholder="Re-enter password"
            secureTextEntry
          />
        </Form>
      </YStack>
    </SheetModal>
  );
}
