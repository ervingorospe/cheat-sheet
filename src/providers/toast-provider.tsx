import { X } from "@tamagui/lucide-icons-2";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, SizableText, XStack, YStack } from "tamagui";

type ToastType = "success" | "error";

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
  closeToast: () => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const TOAST_DURATION_MS = 5000;

export function ToastProvider({ children }: PropsWithChildren) {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<ToastType>("error");

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setMessage(null);
  }, []);

  const showToast = useCallback(
    (newMessage: string, newType: ToastType = "error") => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setMessage(newMessage);
      setType(newType);

      timeoutRef.current = setTimeout(() => {
        setMessage(null);
        timeoutRef.current = null;
      }, TOAST_DURATION_MS);
    },
    [],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      showToast,
      closeToast,
    }),
    [showToast, closeToast],
  );

  const backgroundColor = type === "success" ? "$success" : "$error";

  return (
    <ToastContext.Provider value={contextValue}>
      <YStack flex={1}>
        {children}

        {message && (
          <YStack
            position="absolute"
            left={0}
            right={0}
            bottom={0}
            marginBottom="100"
            alignItems="center"
            pointerEvents="box-none"
          >
            <XStack
              transition="quick"
              enterStyle={{
                opacity: 0,
                y: 80,
              }}
              exitStyle={{
                opacity: 0,
                y: 80,
              }}
              backgroundColor={backgroundColor}
              paddingLeft="$lg"
              paddingRight="$sm"
              paddingVertical="$md"
              borderRadius={22}
              maxWidth="90%"
              alignItems="center"
              gap="$sm"
              pointerEvents="auto"
            >
              <SizableText
                color={
                  backgroundColor === "$success" ? "$background" : "$textHeader"
                }
                fontWeight="600"
                textAlign="center"
                flex={1}
              >
                {message}
              </SizableText>

              <Button
                unstyled
                size="$2"
                width="$2"
                height="$2"
                padding={0}
                alignItems="center"
                justifyContent="center"
                onPress={closeToast}
                pressStyle={{
                  opacity: 0.6,
                }}
              >
                <X
                  size={16}
                  color={
                    backgroundColor === "$success"
                      ? "$background"
                      : "$textHeader"
                  }
                />
              </Button>
            </XStack>
          </YStack>
        )}
      </YStack>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}
