import { LoginFormField } from "@/types/auth/login.type";
import { Lock, Mail } from "@tamagui/lucide-icons-2";

export const loginFormFields: LoginFormField[] = [
  {
    name: "email",
    label: "Email Address",
    placeholder: "Enter your email",
    keyboardType: "email-address",
    icon: Mail,
    autoCapitalize: "none",
    secureTextEntry: false,
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    keyboardType: "default",
    icon: Lock,
    autoCapitalize: "none",
    secureTextEntry: true,
  },
] as const;
