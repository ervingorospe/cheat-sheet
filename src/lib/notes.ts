import { TABLES } from "@/lib/constants/tables";
import { Database } from "@/lib/database.types";
import { supabase } from "@/lib/supabase";
import { GeneratedNotes } from "@/types/media/note-generation.type";

export type Note = Database["public"]["Tables"]["notes"]["Row"];

export type CreateNoteResult = {
  data: Note | null;
  error: string | null;
};


export async function createNote(generatedNotes: GeneratedNotes): Promise<CreateNoteResult> {
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

  // folderId === undefined  → no filter at all (every note, any folder — Library page)
  // folderId === null       → only notes with NO folder (folder_id IS NULL)
  // folderId === "some-id"  → only notes inside that specific folder
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