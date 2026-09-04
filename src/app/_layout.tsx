import LoadingOverlay from "@/components/common/loading-overlay";
import useAppFonts from "@/hooks/use-app-fonts";
import { AuthProvider, useAuth } from "@/providers/auth-provider";
import { LoadingOverlayProvider } from "@/providers/loading-overlay-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TamaguiProvider, Theme } from "tamagui";
import tamaguiConfig from "../../tamagui.config";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingOverlay visible />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false, animation: "none" }}>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(main)" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useAppFonts();

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
        <Theme name="dark">
          <QueryClientProvider client={queryClient}>
            <LoadingOverlayProvider>
              <AuthProvider>
                <AppNavigator />
              </AuthProvider>
            </LoadingOverlayProvider>
          </QueryClientProvider>
        </Theme>
      </TamaguiProvider>
    </SafeAreaProvider>
  );
}
