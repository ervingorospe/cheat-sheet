import Logo from "@/assets/icons/logo.svg";
import BackButton from "@/components/common/back-button";
import GradientLinear from "@/components/common/gradient-linear";
import { AppSection, AppTextStack, H1, Paragraph } from "@/components/theme";
import Screen from "./components/screen";

export default function ForgotPassword() {
  return (
    <Screen>
      <BackButton />
      <AppSection f={1} justifyContent="center" alignItems="center">
        <AppTextStack alignItems="center">
          <GradientLinear>
            <H1 fontWeight="700">Forgot Password</H1>
          </GradientLinear>

          <Paragraph>Ultimate references guides at your fingertipss</Paragraph>

          <Logo width={45} height={45} />
        </AppTextStack>
      </AppSection>
    </Screen>
  );
}
