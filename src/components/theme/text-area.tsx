import { TextArea, styled } from "tamagui";

const TextAreaStyle = styled(TextArea, {
  name: "AppTextArea",

  minHeight: 120,

  borderRadius: "$md",

  borderWidth: 1,

  backgroundColor: "$paper",

  borderColor: "$border",

  color: "$textBody",

  paddingHorizontal: "$4",

  paddingVertical: "$3",

  placeholderTextColor: "$muted",

  textAlignVertical: "top",

  focusStyle: {
    borderColor: "$primary",
  },

  hoverStyle: {
    borderColor: "$primaryLight",
  },
});

export default TextAreaStyle;
