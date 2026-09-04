import { Input, styled } from "tamagui";

const InputStyle = styled(Input, {
  name: "AppInput",

  height: 48,
  borderRadius: "$md",
  borderWidth: 1,

  backgroundColor: "$paper",
  borderColor: "$border",

  color: "$textBody",

  paddingHorizontal: "$4",

  placeholderTextColor: "$muted",

  focusStyle: {
    borderColor: "$primary",
  },

  hoverStyle: {
    borderColor: "$primaryLight",
  },
});

export default InputStyle;
