import Form from "@/components/common/form";
import LoadingOverlay from "@/components/common/loading-overlay";
import {
  AppFormInputs,
  Button,
  Paragraph,
  SizableText,
} from "@/components/theme";

import { loginFormFields } from "@/constants/auth/login.constant";
import { useAuth } from "@/providers/auth-provider";
import { LoginFormValues, loginSchema } from "@/schema/auth/login.schema";
import { LoginResponse } from "@/types/auth/login.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, TriangleAlert } from "@tamagui/lucide-icons-2";
import { Link } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Checkbox, XStack } from "tamagui";

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },

    mode: "onChange",
  });

  const onSubmit = async (data: LoginFormValues) => {
    const result: LoginResponse = await login({ ...data, rememberMe });
    if (result.status === "failed") {
      setError(result.message);
    }
  };

  return (
    <>
      <LoadingOverlay visible={isLoading} message="Logging in..." />
      <Form actions={<Button onPress={handleSubmit(onSubmit)}>Login</Button>}>
        <AppFormInputs>
          {loginFormFields.map((field) => (
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

          <XStack
            alignItems="center"
            gap="$sm"
            onPress={() => setRememberMe((prev) => !prev)}
          >
            <Checkbox
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(!!checked)}
              size="$4"
            >
              <Checkbox.Indicator>
                <Check size={14} />
              </Checkbox.Indicator>
            </Checkbox>
            <SizableText fontSize="$3">Remember Me</SizableText>
          </XStack>
          <XStack alignItems="center" justifyContent="flex-end">
            <Link href="/(auth)/forgot-password" asChild>
              <Button chromeless color="$secondary" variant="text">
                <SizableText color="$secondary">Forgot Password?</SizableText>
              </Button>
            </Link>
          </XStack>

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
