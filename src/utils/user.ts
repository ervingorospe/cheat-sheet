import { User } from "@supabase/supabase-js";

export function getUserName(user: User | null): string { const name = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "there"; return name .split(" ") .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)) .join(" "); }

export function getUserAvatar(user: User | null): string | null {
  return user?.user_metadata?.avatar_url ?? null;
}

export function getUserInitials(name: string): string {
  return name
    .split(" ")
    .map((word: string) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}