import { TABLES } from "@/lib/constants/tables";
import { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabase";
import { deleteNoteImage, toImageLinks } from "./notes";

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

export async function getFolderDeleteImpact(id: string): Promise<{ folderCount: number; noteCount: number }> {
  const { data: folderIds, error: idsError } = await supabase.rpc("get_descendant_folder_ids", { folder_id: id });

  if (idsError || !folderIds) {
    console.error("Failed to get descendant folders:", idsError);
    return { folderCount: 0, noteCount: 0 };
  }

  const ids = folderIds.map((row: { id: string }) => row.id);

  const { count, error: countError } = await supabase
    .from(TABLES.NOTES)
    .select("id", { count: "exact", head: true })
    .in("folder_id", ids);

  if (countError) {
    console.error("Failed to count notes:", countError);
  }

  return { folderCount: ids.length - 1, noteCount: count ?? 0 };
}

export async function deleteFolder(id: string): Promise<{ error: string | null }> {
  try {
    const { data: folderIds, error: idsError } = await supabase.rpc("get_descendant_folder_ids", { folder_id: id });

    if (idsError || !folderIds) {
      console.error("Failed to get descendant folders:", idsError);
      return { error: "Something went wrong. Please try again." };
    }

    const ids = folderIds.map((row: { id: string }) => row.id);

    const { data: notesToDelete, error: fetchNotesError } = await supabase
      .from(TABLES.NOTES)
      .select("id, image_links")
      .in("folder_id", ids);

    if (fetchNotesError) {
      console.error("Failed to fetch notes for cleanup:", fetchNotesError);
    }

    const allImageUrls = (notesToDelete ?? []).flatMap((note) => toImageLinks(note.image_links));

    if (allImageUrls.length > 0) {
      const results = await Promise.all(allImageUrls.map((url) => deleteNoteImage(url)));
      console.log("Deleted images for folder cleanup:", results);
    }

    if (notesToDelete && notesToDelete.length > 0) {
      const { error: deleteNotesError } = await supabase.from(TABLES.NOTES).delete().in("folder_id", ids);

      if (deleteNotesError) {
        console.error("Failed to delete notes:", deleteNotesError);
        return { error: deleteNotesError.message };
      }
    }

    const { error: deleteFolderError } = await supabase.from(TABLES.FOLDERS).delete().eq("id", id);

    if (deleteFolderError) {
      console.error("Failed to delete folder:", deleteFolderError);
      return { error: deleteFolderError.message };
    }

    return { error: null };
  } catch (error) {
    console.error("Unexpected error deleting folder:", error);
    return { error: "Something went wrong. Please try again." };
  }
}