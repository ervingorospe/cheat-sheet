import { Button, styled } from "tamagui";

const AppButtonBase = styled(Button, {
  name: "AppButton",

  variants: {
    variant: {
      primary: {
        borderRadius: "$md",
        backgroundColor: "$primary",
        borderWidth: 1,
        borderColor: "$primary",
        color: "$textBody",

        hoverStyle: {
          backgroundColor: "$primaryLight",
          borderColor: "$textBody",
          color: "$textBody",
        },

        pressStyle: {
          backgroundColor: "$primaryLight",
          borderColor: "$textBody",
          color: "$textBody",
        },
      },

      secondary: {
        borderRadius: "$md",
        backgroundColor: "$secondary",
        borderWidth: 1,
        borderColor: "$secondary",
        color: "$textBody",

        hoverStyle: {
          backgroundColor: "$secondaryLight",
          color: "$textBody",
        },

        pressStyle: {
          backgroundColor: "$secondaryLight",
          color: "$textBody",
        },
      },

      outline: {
        borderRadius: "$md",
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "$primary",
        color: "$primary",

        hoverStyle: {
          backgroundColor: "transparent",
          borderColor: "$primaryDark",
          color: "$primaryDark",
        },

        pressStyle: {
          backgroundColor: "transparent",
          borderColor: "$primaryDark",
          color: "$primaryDark",
        },
      },

      ghost: {
        borderRadius: "$md",
        backgroundColor: "transparent",
        borderWidth: 0,
        color: "$textBody",

        hoverStyle: {
          backgroundColor: "$paper",
        },

        pressStyle: {
          backgroundColor: "$paper",
        },
      },

      danger: {
        borderRadius: "$md",
        backgroundColor: "$error",
        borderWidth: 1,
        borderColor: "$error",
        color: "$textBody",

        hoverStyle: {
          backgroundColor: "$errorVariant",
        },

        pressStyle: {
          backgroundColor: "$errorVariant",
        },
      },

      outlineDanger: {
        borderRadius: "$md",
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: "$error",
        color: "$error",

        hoverStyle: {
          backgroundColor: "transparent",
          borderColor: "$errorVariant",
          color: "$errorVariant",
        },

        pressStyle: {
          backgroundColor: "transparent",
          borderColor: "$errorVariant",
          color: "$errorVariant",
        },
      },

      text: {
        backgroundColor: "transparent",
        borderWidth: 0,
        color: "$textBody",
        padding: 0,
        margin: 0,

        hoverStyle: {
          backgroundColor: "transparent",
          opacity: 0.7,
        },

        pressStyle: {
          backgroundColor: "transparent",
          opacity: 0.7,
        },
      },
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

type AppButtonProps = React.ComponentProps<typeof AppButtonBase>;

function AppButton({ children, ...props }: AppButtonProps) {
  return (
    <AppButtonBase {...props}>
      <Button.Text>{children}</Button.Text>
    </AppButtonBase>
  );
}

export default AppButton;
