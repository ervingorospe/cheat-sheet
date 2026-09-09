import { fetchProfile } from "@/lib/profile";
import { supabase } from "@/lib/supabase";
import { LoginRequest, LoginResponse } from "@/types/auth/login.type";
import { SignUpRequest } from "@/types/auth/signup.type";
import { User } from "@supabase/supabase-js";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as WebBrowser from "expo-web-browser";
import { setRememberMe } from "./remember-me";

const redirectTo = "cheatlibrary://auth/callback";

export type OAuthProvider = "google" | "facebook";

export async function signInWithPassword(data: LoginRequest): Promise<LoginResponse> {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return { status: "failed", message: error.message };
    }

    const userProfile = await fetchProfile(authData.user.id);

    if (userProfile && !userProfile.is_active) {
      await supabase.auth.signOut();
      return { status: "failed", message: "This account has been deactivated." };
    }

    await setRememberMe(data.rememberMe ?? true);

    return { status: "success", message: "" };
  } catch (error) {
    console.error("Unexpected error during sign-in:", error);
    return { status: "failed", message: "Something went wrong. Please try again." };
  }
}

export async function signInWithOAuth(provider: OAuthProvider): Promise<LoginResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        skipBrowserRedirect: true,
        queryParams: getOAuthQueryParams(provider),
      },
    });

    if (error || !data?.url) {
      return { status: "failed", message: error?.message ?? "Failed to start sign-in." };
    }

    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

    if (result.type !== "success" || !result.url) {
      return { status: "failed", message: "Sign-in was cancelled." };
    }

    const { params, errorCode } = QueryParams.getQueryParams(result.url);

    if (errorCode) {
      return { status: "failed", message: errorCode };
    }

    const { access_token, refresh_token } = params;

    if (!access_token || !refresh_token) {
      return { status: "failed", message: "Missing tokens from provider." };
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });

    if (sessionError || !sessionData.session) {
      return { status: "failed", message: sessionError?.message ?? "Failed to establish session." };
    }

    const userProfile = await fetchProfile(sessionData.session.user.id);

    if (userProfile && !userProfile.is_active) {
      await supabase.auth.signOut();
      return { status: "failed", message: "This account has been deactivated." };
    }

    return { status: "success", message: "" };
  } catch (error) {
    console.error("Unexpected error during OAuth sign-in:", error);
    return { status: "failed", message: "Something went wrong. Please try again." };
  }
}

function getOAuthQueryParams(provider: OAuthProvider) {
  switch (provider) {
    case "google":
      return {
        prompt: "select_account",
      };

    case "facebook":
      return undefined;
  }
}


export async function signOut(): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error("Unexpected error during sign-out:", error);
    return { error: "Something went wrong. Please try again." };
  }
}


export async function signUpWithPassword(data: SignUpRequest): Promise<LoginResponse> {
  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
        },
      },
    });

    if (error) {
      return { status: "failed", message: error.message };
    }

    if (!authData.session) {
      return {
        status: "success",
        message: "Check your email to confirm your account before logging in.",
      };
    }

    await setRememberMe(true);

    return { status: "success", message: "" };
  } catch (error) {
    console.error("Unexpected error during sign-up:", error);
    return { status: "failed", message: "Something went wrong. Please try again." };
  }
}

export function hasPasswordAuth(user: User | null): boolean {
  return user?.app_metadata?.provider === "email";
}

export async function updatePassword(newPassword: string): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error("Unexpected error updating password:", error);
    return { error: "Something went wrong. Please try again." };
  }
}