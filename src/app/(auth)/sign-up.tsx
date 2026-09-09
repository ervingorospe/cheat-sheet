import BackButton from "@/components/common/back-button";
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
import SignUpForm from "./components/signup-form";

export default function SignUp() {
  return (
    <Screen>
      <XStack marginLeft="$lg" marginTop="$lg">
        <BackButton />
      </XStack>

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
          <AppSection flex={1} marginHorizontal={20} paddingVertical="$xl">
            <AppTextStack>
              <H2>Create Account</H2>

              <Paragraph>
                Signup and start creating your study vaults.
              </Paragraph>
            </AppTextStack>

            <AppList>
              <SignUpForm />
            </AppList>
          </AppSection>

          <XStack marginTop="auto" alignItems="center" justifyContent="center">
            <Paragraph marginRight={4}>Already have an account?</Paragraph>
            <Link href="/(auth)/login" asChild>
              <Button variant="text">
                <Strong color="$primary">Login</Strong>
              </Button>
            </Link>
          </XStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
