import {
  AppSection,
  AppTextStack,
  FormSection,
  InputStyle,
  SizableText,
} from "@/components/theme";
import { Eye, EyeOff } from "@tamagui/lucide-icons-2";
import { PropsWithChildren, ReactNode, useState } from "react";
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
} from "react-hook-form";
import { Button, XStack } from "tamagui";

type FormProps = PropsWithChildren<{ actions?: ReactNode }>;

function Form({ children, actions }: FormProps) {
  return (
    <FormSection gap="$lg">
      {children}

      {actions && <AppSection>{actions}</AppSection>}
    </FormSection>
  );
}

type FormInputProps<T extends FieldValues> = React.ComponentProps<
  typeof InputStyle
> & {
  name: FieldPath<T>;
  control: Control<T>;
  label?: string;
  helperText?: string;
  icon?: React.ComponentType<{ size?: any; color?: any }>;
  onInputFocus?: (name: FieldPath<T>) => void;
};

function Input<T extends FieldValues>({
  name,
  control,
  label,
  helperText,
  icon: Icon,
  secureTextEntry,
  ...props
}: FormInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const hasError = Boolean(error);
  const isPassword = secureTextEntry === true;

  const iconColor = hasError ? "$error" : isFocused ? "$primary" : "$muted";

  return (
    <AppTextStack gap="$2">
      {label && (
        <SizableText fontSize="$2" fontWeight="$5" color="$textHeader">
          {label}
        </SizableText>
      )}

      <XStack gap="$1" position="relative" width="100%">
        {Icon && (
          <XStack
            position="absolute"
            left="$lg"
            top={0}
            bottom={0}
            justifyContent="center"
            alignItems="center"
            pointerEvents="none"
            zIndex={1}
          >
            <Icon size="$1" color={iconColor} />
          </XStack>
        )}

        <InputStyle
          {...props}
          flex={1}
          value={field.value ?? ""}
          onChangeText={field.onChange}
          secureTextEntry={isPassword && !showPassword}
          borderColor={hasError ? "$error" : "$border"}
          focusStyle={{
            borderColor: hasError ? "$error" : "$primary",
          }}
          paddingLeft={Icon ? 40 : undefined}
          paddingRight={isPassword ? "$xl" : undefined}
          onFocus={(event) => {
            setIsFocused(true);
            props.onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            field.onBlur();
            props.onBlur?.(event);
          }}
        />

        {isPassword && (
          <Button
            position="absolute"
            right="$sm"
            top={1}
            bottom={0}
            width="$lg"
            padding={0}
            chromeless
            circular
            backgroundColor="transparent"
            hoverStyle={{
              backgroundColor: "transparent",
            }}
            pressStyle={{
              backgroundColor: "transparent",
            }}
            onPress={() => setShowPassword((previous) => !previous)}
          >
            {showPassword ? (
              <EyeOff size="$1" color={iconColor} />
            ) : (
              <Eye size="$1" color={iconColor} />
            )}
          </Button>
        )}
      </XStack>

      {hasError ? (
        <SizableText fontSize="$2" color="$error">
          {error?.message}
        </SizableText>
      ) : (
        helperText && (
          <SizableText fontSize="$2" color="$muted">
            {helperText}
          </SizableText>
        )
      )}
    </AppTextStack>
  );
}

Form.Input = Input;

export default Form;
