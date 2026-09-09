import { updatePassword } from "@/lib/auth";
import { useMutation } from "@tanstack/react-query";

export function useUpdatePassword() {
  return useMutation({
    mutationFn: (newPassword: string) => updatePassword(newPassword),
  });
}