import { TABLES } from "@/lib/constants/tables";
import { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabase";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const PROFILE_COLUMNS = "id, email, first_name, last_name, avatar_url, is_active, created_at, updated_at";

export async function fetchProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .select(PROFILE_COLUMNS)
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Failed to fetch profile:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching profile:", error);
    return null;
  }
}