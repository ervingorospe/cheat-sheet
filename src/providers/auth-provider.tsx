import { signInWithOAuth, signInWithPassword, signOut } from "@/lib/auth";
import { fetchProfile } from "@/lib/profile";
import { supabase } from "@/lib/supabase";
import { useLoadingOverlay } from "@/providers/loading-overlay-provider";
import { LoginRequest, LoginResponse } from "@/types/auth/login.type";
import { Profile } from "@/types/auth/profile.type";
import { Session } from "@supabase/supabase-js";
import * as WebBrowser from "expo-web-browser";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

WebBrowser.maybeCompleteAuthSession();

type OAuthProvider = "google" | "facebook";

type AuthContextValue = {
  isAuthenticated: boolean;
  session: Session | null;
  profile: Profile | null;
  login: (data: LoginRequest) => Promise<LoginResponse>;
  loginWithOAuth: (provider: OAuthProvider) => Promise<LoginResponse>;
  logout: () => Promise<{ error: string | null }>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const LOGOUT_OVERLAY_MIN_MS = 150;

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { show: showLoading, hide: hideLoading } = useLoadingOverlay();

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);

      if (data.session?.user.id) {
        setProfile(await fetchProfile(data.session.user.id));
      }

      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);

        if (newSession?.user.id) {
          fetchProfile(newSession.user.id).then(setProfile);
        } else {
          setProfile(null);
        }

        setTimeout(() => {
          hideLoading();
        }, LOGOUT_OVERLAY_MIN_MS);
      },
    );

    return () => listener.subscription.unsubscribe();
  }, [hideLoading]);

  const login = useCallback(
    async (data: LoginRequest): Promise<LoginResponse> => {
      setIsLoading(true);
      showLoading({ message: "Logging in..." });

      try {
        return await signInWithPassword(data);
      } finally {
        setIsLoading(false);
        hideLoading();
      }
    },
    [showLoading, hideLoading],
  );

  const loginWithOAuth = useCallback(
    async (provider: OAuthProvider): Promise<LoginResponse> => {
      setIsLoading(true);

      try {
        return await signInWithOAuth(provider);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    showLoading({ message: "Logging out..." });

    const result = await signOut();

    if (result.error) {
      hideLoading();
    }

    return result;
  }, [showLoading, hideLoading]);

  const contextValue = useMemo(
    () => ({
      isAuthenticated: !!session,
      session,
      profile,
      login,
      loginWithOAuth,
      logout,
      isLoading,
    }),
    [session, profile, login, loginWithOAuth, logout, isLoading],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
