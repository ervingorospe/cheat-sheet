import { TABLES } from "@/lib/constants/tables";
import { Database } from "@/lib/database.types";
import { compressImage } from "@/lib/image";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import { File } from "expo-file-system";

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

export type UpdateProfileInput = {
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
};

export async function updateProfile(
  userId: string,
  updates: UpdateProfileInput
): Promise<{ data: Profile | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(TABLES.PROFILES)
      .update({
        first_name: updates.firstName,
        last_name: updates.lastName,
        ...(updates.avatarUrl !== undefined ? { avatar_url: updates.avatarUrl } : {}),
      })
      .eq("id", userId)
      .select(PROFILE_COLUMNS)
      .single();

    if (error) {
      console.error("Failed to update profile:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error updating profile:", error);
    return { data: null, error: "Something went wrong. Please try again." };
  }
}

const AVATARS_BUCKET = "avatars";

export async function uploadAvatar(userId: string, localUri: string): Promise<{ url: string | null; error: string | null }> {
  try {
    const compressedUri = await compressImage(localUri, { maxDimension: 512, quality: 0.8 });
    const file = new File(compressedUri);
    const base64 = file.base64Sync();
    const path = `${userId}/${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from(AVATARS_BUCKET)
      .upload(path, decode(base64), { contentType: "image/jpeg", upsert: true });

    if (uploadError) {
      console.error("Failed to upload avatar:", uploadError);
      return { url: null, error: "Failed to upload photo. Please try again." };
    }

    const { data } = supabase.storage.from(AVATARS_BUCKET).getPublicUrl(path);
    return { url: data.publicUrl, error: null };
  } catch (error) {
    console.error("Unexpected error uploading avatar:", error);
    return { url: null, error: "Something went wrong. Please try again." };
  }
}