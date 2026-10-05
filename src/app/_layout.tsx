import LoadingOverlay from "@/components/common/loading-overlay";
import useAppFonts from "@/hooks/use-app-fonts";
import { AuthProvider, useAuth } from "@/providers/auth-provider";
import { LoadingOverlayProvider } from "@/providers/loading-overlay-provider";
import { ToastProvider } from "@/providers/toast-provider";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TamaguiProvider, Theme, useTheme } from "tamagui";
import tamaguiConfig from "../../tamagui.config";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const { isAuthenticated, isLoading, session } = useAuth();
  const theme = useTheme();
  const queryClient = useQueryClient();
  const userId = session?.user.id ?? null;
  const previousUserId = useRef(userId);

  // Cached queries are not keyed by user, so drop them when the account changes.
  useEffect(() => {
    if (previousUserId.current !== userId) {
      previousUserId.current = userId;
      queryClient.clear();
    }
  }, [userId, queryClient]);

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
          contentStyle: {
            backgroundColor: theme.background.val,
          },
        }}
      >
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen
            name="(auth)"
            options={{ animation: "slide_from_right" }}
          />
        </Stack.Protected>

        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen
            name="(tabs)"
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="(main)"
            options={{ animation: "slide_from_right" }}
          />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useAppFonts();

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <KeyboardProvider>
        <SafeAreaProvider>
          <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
            <Theme name="dark">
              <ToastProvider>
                <QueryClientProvider client={queryClient}>
                  <LoadingOverlayProvider>
                    <AuthProvider>
                      <AppNavigator />
                    </AuthProvider>
                  </LoadingOverlayProvider>
                </QueryClientProvider>
              </ToastProvider>
            </Theme>
          </TamaguiProvider>
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}
