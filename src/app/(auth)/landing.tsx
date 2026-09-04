import Logo from "@/assets/icons/logo.svg";
import GradientLinear from "@/components/common/gradient-linear";
import {
  AppButtonGroup,
  AppSection,
  AppTextStack,
  Button,
  H1,
  Paragraph,
} from "@/components/theme";
import { Link } from "expo-router";
import Screen from "./components/screen";

export default function LandingScreen() {
  return (
    <Screen>
      <AppSection f={1} justifyContent="center" alignItems="center">
        <AppTextStack alignItems="center">
          <GradientLinear>
            <H1 fontWeight="700">Smart Sheet</H1>
          </GradientLinear>

          <Paragraph>Ultimate references guides at your fingertipss</Paragraph>

          <Logo width={45} height={45} />
        </AppTextStack>

        <AppButtonGroup width={250} alignItems="center">
          <Button width="100%">Create An Account</Button>
          <Link href="/(auth)/login" asChild>
            <Button width="100%" variant="outline">
              Login
            </Button>
          </Link>
        </AppButtonGroup>
      </AppSection>
    </Screen>
  );
}
