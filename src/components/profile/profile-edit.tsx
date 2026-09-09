import Avatar from "@/components/common/avatar";
import { useMediaPicker } from "@/hooks/use-media-picker";
import { useUpdateProfile } from "@/hooks/use-update-profile";
import { Profile } from "@/lib/profile";
import { useToast } from "@/providers/toast-provider";
import {
  ProfileEditFormValues,
  profileEditSchema,
} from "@/schema/auth/profile-edit.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@supabase/supabase-js";
import { Camera, Check, X } from "@tamagui/lucide-icons-2";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Spinner, XStack, YStack } from "tamagui";
import Form from "../common/form";
import { AppFormInputs, Button, Paragraph } from "../theme";

type ProfileEditProps = {
  user: User;
  profile: Profile;
  onDone: () => void;
};

export default function ProfileEdit({
  user,
  profile,
  onDone,
}: ProfileEditProps) {
  const { pickFromLibrary } = useMediaPicker({ selectionLimit: 1 });
  const { mutateAsync, isPending } = useUpdateProfile();
  const { showToast } = useToast();
  const [localAvatarUri, setLocalAvatarUri] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<ProfileEditFormValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      firstName: profile.first_name ?? "",
      lastName: profile.last_name ?? "",
    },
    mode: "onChange",
  });

  const handlePickAvatar = async () => {
    const result = await pickFromLibrary();
    if (result.cancelled || !result.data || result.data.length === 0) return;
    setLocalAvatarUri(result.data[0].uri);
  };

  const onSubmit = async (values: ProfileEditFormValues) => {
    const result = await mutateAsync({
      userId: user.id,
      firstName: values.firstName,
      lastName: values.lastName,
      newAvatarUri: localAvatarUri ?? undefined,
    });

    if (result.error) {
      showToast(result.error);
      return;
    }

    showToast("Profile updated.");
    onDone();
  };

  return (
    <YStack
      flex={1}
      paddingHorizontal="$xl"
      paddingTop="$xxl"
      paddingBottom="$xl"
    >
      <YStack alignItems="center" marginBottom="$lg">
        <XStack position="relative" onPress={handlePickAvatar}>
          <Avatar
            user={user}
            avatarUrl={localAvatarUri ?? profile.avatar_url}
            size={96}
          />

          <XStack
            position="absolute"
            bottom={0}
            right={0}
            width={28}
            height={28}
            borderRadius={14}
            backgroundColor="$primary"
            alignItems="center"
            justifyContent="center"
            borderWidth={2}
            borderColor="$background"
          >
            <Camera size={14} color="$textHeader" />
          </XStack>
        </XStack>
      </YStack>

      <YStack>
        <Form
          actions={
            <XStack justifyContent="flex-end" gap="$lg" marginTop="$xl">
              <Button
                variant="text"
                icon={<X size={16} />}
                onPress={onDone}
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
          <AppFormInputs>
            <XStack>
              <Form.Input
                name="firstName"
                control={control}
                label="First Name"
                placeholder="Jane"
              />
            </XStack>

            <XStack>
              <Form.Input
                name="lastName"
                control={control}
                label="Last Name"
                placeholder="Doe"
              />
            </XStack>

            <YStack gap="$xs">
              <Paragraph fontSize="$3" color="$secondary">
                Email
              </Paragraph>
              <Input value={profile.email} disabled={true} opacity={0.5} />
            </YStack>
          </AppFormInputs>
        </Form>
      </YStack>
      {/* <YStack flex={1}>
        <Form
          actions={
            <XStack justifyContent="flex-end" gap="$lg">
              <Button
                variant="text"
                icon={<X size={16} />}
                onPress={onDone}
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
          <AppFormInputs>
            <Form.Input
              name="firstName"
              control={control}
              label="First Name"
              placeholder="Jane"
            />
            <Form.Input
              name="lastName"
              control={control}
              label="Last Name"
              placeholder="Doe"
            />

            <YStack gap="$xs">
            <Paragraph fontSize="$3" color="$secondary">
              Email
            </Paragraph>
            <Input value={profile.email} disabled={true} opacity={0.5} />
          </YStack>
          </AppFormInputs>
        </Form>
      </YStack> */}
    </YStack>
  );
}
