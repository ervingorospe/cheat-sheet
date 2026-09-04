import LoginForm from "@/app/(auth)/components/login-form";
import BackButton from "@/components/common/back-button";
import { DividerWithText } from "@/components/common/divider-with-text";
import {
  AppList,
  AppSection,
  AppTextStack,
  Button,
  H2,
  Paragraph,
} from "@/components/theme";
import { Link } from "expo-router";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Strong, XStack } from "tamagui";
import Screen from "./components/screen";
import SocialMediaLogin from "./components/social-media-login";

export default function LoginScreen() {
  return (
    <Screen>
      <BackButton />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 20,
            paddingTop: 50,
          }}
        >
          <AppSection flex={1} marginHorizontal={50} paddingVertical="$xl">
            <AppTextStack>
              <H2>Welcome Back!</H2>

              <Paragraph>
                Log in to access your customized study vaults.
              </Paragraph>
            </AppTextStack>

            <AppList>
              <LoginForm />

              <DividerWithText>or continue with</DividerWithText>

              <SocialMediaLogin />
            </AppList>
          </AppSection>

          <XStack marginTop="auto" alignItems="center" justifyContent="center">
            <Paragraph marginRight={4}>Don't have an account?</Paragraph>
            <Link href="/(auth)/sign-up" asChild>
              <Button variant="text">
                <Strong color="$primary">Sign Up</Strong>
              </Button>
            </Link>
          </XStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
