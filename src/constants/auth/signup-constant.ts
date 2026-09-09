import { Lock, Mail, User } from "@tamagui/lucide-icons-2";

export const signupFormFields = [
  {
    name: "firstName" as const,
    label: "First Name",
    placeholder: "Jane",
    keyboardType: "default" as const,
    autoCapitalize: "words" as const,
    secureTextEntry: false,
    icon: User,
  },
  {
    name: "lastName" as const,
    label: "Last Name",
    placeholder: "Doe",
    keyboardType: "default" as const,
    autoCapitalize: "words" as const,
    secureTextEntry: false,
    icon: User,
  },
  {
    name: "email" as const,
    label: "Email",
    placeholder: "you@example.com",
    keyboardType: "email-address" as const,
    autoCapitalize: "none" as const,
    secureTextEntry: false,
    icon: Mail,
  },
  {
    name: "password" as const,
    label: "Password",
    placeholder: "Create a password",
    keyboardType: "default" as const,
    autoCapitalize: "none" as const,
    secureTextEntry: true,
    icon: Lock,
  },
  {
    name: "confirmPassword" as const,
    label: "Confirm Password",
    placeholder: "Re-enter your password",
    keyboardType: "default" as const,
    autoCapitalize: "none" as const,
    secureTextEntry: true,
    icon: Lock,
  },
];