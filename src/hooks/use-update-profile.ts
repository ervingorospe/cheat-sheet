import { updateProfile, UpdateProfileInput, uploadAvatar } from "@/lib/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UpdateProfileArgs = UpdateProfileInput & { userId: string; newAvatarUri?: string };

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, newAvatarUri, ...updates }: UpdateProfileArgs) => {
      let avatarUrl = updates.avatarUrl;

      if (newAvatarUri) {
        const uploadResult = await uploadAvatar(userId, newAvatarUri);
        if (uploadResult.error) {
          return { data: null, error: uploadResult.error };
        }
        avatarUrl = uploadResult.url;
      }

      return updateProfile(userId, { ...updates, avatarUrl });
    },
    onSuccess: (result) => {
      if (result.data) {
        queryClient.setQueryData(["profile", result.data.id], result.data);
      }
    },
  });
}