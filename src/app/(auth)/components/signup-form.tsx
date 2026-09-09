import Form from "@/components/common/form";
import LoadingOverlay from "@/components/common/loading-overlay";
import { AppFormInputs, Button, Paragraph } from "@/components/theme";
import { signupFormFields } from "@/constants/auth/signup-constant";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";
import { SignUpFormValues, signupSchema } from "@/schema/auth/signup.schema";
import { LoginResponse } from "@/types/auth/login.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlert } from "@tamagui/lucide-icons-2";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { XStack } from "tamagui";

export default function SignUpForm() {
  const { signUp, isLoading } = useAuth();
  const { showToast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<SignUpFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: SignUpFormValues) => {
    setError(null);
    const result: LoginResponse = await signUp(data);

    if (result.status === "failed") {
      setError(result.message);
      return;
    }

    // Success — either signed in immediately, or Supabase requires email
    // confirmation first. Either way, a message worth telling the user.
    if (result.message) {
      showToast(result.message);
    }
  };

  return (
    <>
      <LoadingOverlay visible={isLoading} message="Creating your account..." />
      <Form
        actions={
          <Button marginTop="$xl" onPress={handleSubmit(onSubmit)}>
            Sign Up
          </Button>
        }
      >
        <AppFormInputs>
          {signupFormFields.map((field) => (
            <Form.Input
              name={field.name}
              control={control}
              label={field.label}
              placeholder={field.placeholder}
              keyboardType={field.keyboardType}
              autoCapitalize={field.autoCapitalize}
              secureTextEntry={field.secureTextEntry}
              icon={field.icon}
              key={field.name}
            />
          ))}

          {error && (
            <XStack gap="$2" alignItems="center">
              <TriangleAlert color="$error" size="$1" />
              <Paragraph color="$error">{error}</Paragraph>
            </XStack>
          )}
        </AppFormInputs>
      </Form>
    </>
  );
}
