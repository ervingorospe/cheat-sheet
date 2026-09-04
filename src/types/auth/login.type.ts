import { Mail } from "@tamagui/lucide-icons-2";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  status: "success" | "failed";
  message: string;
};

export type LoginFormField = {
  name: "email" | "password";
  label: string;
  placeholder: string;
  keyboardType: "default" | "email-address";
  icon: typeof Mail;
  autoCapitalize: "none" | "sentences" | "words" | "characters";
  secureTextEntry: boolean;
};
