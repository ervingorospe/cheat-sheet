import { TABLES } from "@/lib/constants/tables";
import { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabase";

export type Folder = Database["public"]["Tables"]["folders"]["Row"];

export async function fetchFolders(parentFolderId: string | null): Promise<Folder[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  let query = supabase
    .from(TABLES.FOLDERS)
    .select("*")
    .eq("user_id", user.id)
    .order("name");

  query = parentFolderId === null ? query.is("parent_folder_id", null) : query.eq("parent_folder_id", parentFolderId);

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch folders:", error);
    return [];
  }

  return data;
}

export async function createFolder(name: string, parentFolderId: string | null): Promise<{ data: Folder | null; error: string | null }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { data: null, error: "No authenticated user." };

    const { data, error } = await supabase
      .from(TABLES.FOLDERS)
      .insert({ name, parent_folder_id: parentFolderId, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error("Failed to create folder:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error creating folder:", error);
    return { data: null, error: "Something went wrong. Please try again." };
  }
}

export async function fetchFolderById(id: string): Promise<Folder | null> {
  const { data, error } = await supabase.from(TABLES.FOLDERS).select("*").eq("id", id).single();

  if (error) {
    console.error("Failed to fetch folder:", error);
    return null;
  }

  return data;
}

export async function updateFolder(id: string, name: string): Promise<{ data: Folder | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from(TABLES.FOLDERS)
      .update({ name })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update folder:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error updating folder:", error);
    return { data: null, error: "Something went wrong. Please try again." };
  }
}