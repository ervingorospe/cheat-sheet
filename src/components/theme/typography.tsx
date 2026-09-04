import {
  H1 as TamaguiH1,
  H2 as TamaguiH2,
  H3 as TamaguiH3,
  H4 as TamaguiH4,
  Paragraph as TamaguiParagraph,
  styled,
} from "tamagui";

const headingStyles = {
  color: "$textHeader",
};

export const H1 = styled(TamaguiH1, {
  name: "H1",
  ...headingStyles,
  fontSize: 32,
  fontWeight: "$7",
});

export const H2 = styled(TamaguiH2, {
  name: "H2",
  ...headingStyles,
  fontSize: 28,
  fontWeight: "$7",
});

export const H3 = styled(TamaguiH3, {
  name: "H3",
  ...headingStyles,
  fontSize: 24,
  fontWeight: "$7",
});

export const H4 = styled(TamaguiH4, {
  name: "H4",
  ...headingStyles,
  fontSize: 20,
  fontWeight: "$6",
});

export const H5 = styled(TamaguiH4, {
  name: "H5",
  ...headingStyles,
  fontSize: 16,
  fontWeight: "$6",
});

export const H6 = styled(TamaguiH4, {
  name: "H6",
  ...headingStyles,
  fontSize: 14,
  fontWeight: "$5",
});

export const Paragraph = styled(TamaguiParagraph, {
  name: "Paragraph",
  color: "$textBody",
});

export const SizableText = styled(TamaguiParagraph, {
  name: "SizableText",
  color: "$textBody",
});
