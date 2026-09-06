import { TABLES } from "@/lib/constants/tables";
import { Database } from "@/lib/database.types";
import { compressImage } from "@/lib/image";
import { supabase } from "@/lib/supabase";
import { GeneratedNotes } from "@/types/media/note-generation.type";
import { decode } from "base64-arraybuffer";
import { File } from "expo-file-system";

export type Note = Database["public"]["Tables"]["notes"]["Row"];

export type CreateNoteResult = {
  data: Note | null;
  error: string | null;
};

export async function createNote(
  generatedNotes: GeneratedNotes,
  imageLinks: string[] = []
): Promise<CreateNoteResult> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { data: null, error: "No authenticated user." };
    }

    const { data, error } = await supabase
      .from(TABLES.NOTES)
      .insert({
        user_id: user.id,
        title: generatedNotes.title,
        content: generatedNotes.summary,
        key_points: generatedNotes.keyPoints,
        image_links: imageLinks.length > 0 ? imageLinks : null,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create note:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error creating note:", error);
    return { data: null, error: "Something went wrong. Please try again." };
  }
}

// =================================================================================
const NOTES_PAGE_SIZE = 10;

export type NoteListItem = Pick<Note, "id" | "title" | "content" | "created_at">;

export type NotesPage = {
  notes: NoteListItem[];
  nextCursor: string | null;
};

export async function fetchNotesPage(cursor: string | null, folderId?: string | null): Promise<NotesPage> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { notes: [], nextCursor: null };
  }

  let query = supabase
    .from(TABLES.NOTES)
    .select("id, title, content, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(NOTES_PAGE_SIZE);

  if (folderId !== undefined) {
    query = folderId === null ? query.is("folder_id", null) : query.eq("folder_id", folderId);
  }

  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch notes:", error);
    return { notes: [], nextCursor: null };
  }

  const notes = data ?? [];
  const nextCursor = notes.length === NOTES_PAGE_SIZE ? notes[notes.length - 1].created_at : null;

  return { notes, nextCursor };
}

export async function fetchNoteById(id: string): Promise<Note | null> {
  const { data, error } = await supabase.from(TABLES.NOTES).select("*").eq("id", id).single();

  if (error) {
    console.error("Failed to fetch note:", error);
    return null;
  }

  return data;
}

// =================================================================================

export type DeleteNoteResult = {
  error: string | null;
};

export async function deleteNote(id: string): Promise<DeleteNoteResult> {
  try {
    const { error } = await supabase.from(TABLES.NOTES).delete().eq("id", id);

    if (error) {
      console.error("Failed to delete note:", error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error("Unexpected error deleting note:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

// =================================================================================

export type DocLink = {
  label: string;
  url: string;
};

export type UpdateNoteInput = {
  title: string;
  content: string;
  key_points: string[];
  doc_links: DocLink[];
  image_links: string[];
};

export type UpdateNoteResult = {
  data: Note | null;
  error: string | null;
};

export async function updateNote(
  id: string,
  updates: UpdateNoteInput
): Promise<UpdateNoteResult> {
  try {
    const { data, error } = await supabase
      .from(TABLES.NOTES)
      .update({
        title: updates.title,
        content: updates.content,
        key_points: updates.key_points,
        doc_links: updates.doc_links,
        image_links: updates.image_links,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update note:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error updating note:", error);
    return { data: null, error: "Something went wrong. Please try again." };
  }
}

export function toKeyPoints(value: Note["key_points"]): string[] {
  return Array.isArray(value) ? (value as string[]) : [];
}

export function toDocLinks(value: Note["doc_links"]): DocLink[] {
  return Array.isArray(value) ? (value as DocLink[]) : [];
}

export function toImageLinks(value: Note["image_links"]): string[] {
  return Array.isArray(value) ? value : [];
}

// =================================================================================

const NOTE_IMAGES_BUCKET = "note-images";

export type UploadImageResult = {
  url: string | null;
  error: string | null;
};

export async function uploadNoteImage(localUri: string): Promise<UploadImageResult> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { url: null, error: "No authenticated user." };
    }

    const compressedUri = await compressImage(localUri, {
      maxDimension: 1920,
      quality: 0.7,
    });

    const file = new File(compressedUri);
    const base64 = file.base64Sync();
    const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;

    const { error: uploadError } = await supabase.storage
      .from(NOTE_IMAGES_BUCKET)
      .upload(path, decode(base64), {
        contentType: "image/jpeg",
      });

    if (uploadError) {
      console.error("Failed to upload image:", uploadError);
      return { url: null, error: "Failed to upload image. Please try again." };
    }

    const { data } = supabase.storage.from(NOTE_IMAGES_BUCKET).getPublicUrl(path);

    return { url: data.publicUrl, error: null };
  } catch (error) {
    console.error("Unexpected error uploading image:", error);
    return { url: null, error: "Something went wrong. Please try again." };
  }
}

export type DeleteImageResult = {
  error: string | null;
};

export async function deleteNoteImage(url: string): Promise<DeleteImageResult> {
  try {
    const marker = `/${NOTE_IMAGES_BUCKET}/`;
    const index = url.indexOf(marker);

    if (index === -1) {
      return { error: "Invalid image URL." };
    }

    const path = url.slice(index + marker.length);

    const { error } = await supabase.storage.from(NOTE_IMAGES_BUCKET).remove([path]);

    if (error) {
      console.error("Failed to delete image:", error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error("Unexpected error deleting image:", error);
    return { error: "Something went wrong. Please try again." };
  }
}