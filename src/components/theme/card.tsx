import { Card, styled } from "tamagui";

const AppCardBase = styled(Card, {
  name: "AppCard",
  paddingHorizontal: 20,
  paddingVertical: 15,
  borderRadius: 22,

  variants: {
    variant: {
      elevated: {
        backgroundColor: "$paper",
      },

      outlined: {
        backgroundColor: "$transparent",
        borderWidth: 1,
        borderColor: "$borderColor",
      },

      filled: {
        borderWidth: 1,
        backgroundColor: "$paper",
      },
    },
  },

  defaultVariants: {
    variant: "elevated",
  },
});

const AppCardHeader = styled(Card.Header, {
  name: "AppCardHeader",
});

const AppCardFooter = styled(Card.Footer, {
  name: "AppCardFooter",

  padding: "$4",
});

type AppCardComponent = typeof AppCardBase & {
  Header: typeof AppCardHeader;
  Footer: typeof AppCardFooter;
};

const AppCard = AppCardBase as AppCardComponent;

AppCard.Header = AppCardHeader;
AppCard.Footer = AppCardFooter;

export default AppCard;
