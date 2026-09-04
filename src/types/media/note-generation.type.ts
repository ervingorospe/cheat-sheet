export type GeneratedNotes = {
  title: string;
  summary: string;
  keyPoints: string[];
  suggestedTopic: string;
};

export type NoteGenerationResult = {
  data: GeneratedNotes | null;
  error: string | null;
  cancelled?: boolean;
};