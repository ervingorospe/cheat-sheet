import { styled, YStack } from "tamagui";

const Paper = styled(YStack, {
  name: "Paper",

  paddingHorizontal: 30,
  paddingVertical: 10,

  borderRadius: 22,

  backgroundColor: "$paper",
  elevation: 2,
});

export default Paper;
