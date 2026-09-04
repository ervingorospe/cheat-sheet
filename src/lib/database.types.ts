export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      folders: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          parent_folder_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          parent_folder_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          parent_folder_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notes: {
        Row: {
          id: string;
          user_id: string;
          folder_id: string | null;
          title: string | null;
          content: string | null;
          key_points: Json;
          doc_links: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          folder_id?: string | null;
          title?: string | null;
          content?: string | null;
          key_points?: Json;
          doc_links?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          folder_id?: string | null;
          title?: string | null;
          content?: string | null;
          key_points?: Json;
          doc_links?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: { /* empty — you don't have any */ };
    Functions: {
      // includes your trigger functions like handle_new_user,
      // prevent_folder_cycle, set_updated_at — these are internal
      // triggers, not something you'd call directly, so this
      // section is mostly irrelevant to your day-to-day code
    };
    Enums: { /* empty — you used check() constraints, not real Postgres enums */ };
  };
};