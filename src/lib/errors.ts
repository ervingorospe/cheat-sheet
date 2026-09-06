import { MediaPickerError } from "@/hooks/use-media-picker";

type NoteGenerationErrorKey = "resource_limit" | "network" | "permission" | "unknown";

const NOTE_GENERATION_ERROR_MESSAGES: Record<NoteGenerationErrorKey, string> = {
  resource_limit:
    "That upload was too large to process. Try fewer photos, or smaller ones.",
  network: "Couldn't connect. Check your internet connection and try again.",
  permission: "Permission needed. Please allow access in your device settings.",
  unknown: "Something went wrong. Please try again.",
};

// Substrings (from the raw error) that map to each key, checked in order.
type MatchableErrorKey = Exclude<NoteGenerationErrorKey, "unknown">;

const NOTE_GENERATION_ERROR_PATTERNS: Record<MatchableErrorKey, string[]> = {
  resource_limit: ["worker_resource_limit", "resource"],
  network: ["network", "fetch"],
  permission: ["permission", "not granted"],
};

const MATCHABLE_ERROR_KEYS = Object.keys(
  NOTE_GENERATION_ERROR_PATTERNS
) as MatchableErrorKey[];

export function getNoteGenerationErrorMessage(rawError: string | null): string {
  if (!rawError) {
    return NOTE_GENERATION_ERROR_MESSAGES.unknown;
  }

  const message = rawError.toLowerCase();

  const matchedKey = MATCHABLE_ERROR_KEYS.find((key) =>
    NOTE_GENERATION_ERROR_PATTERNS[key].some((pattern) =>
      message.includes(pattern)
    )
  );

  return NOTE_GENERATION_ERROR_MESSAGES[matchedKey ?? "unknown"];
}

export const MEDIA_PICKER_ERROR_MESSAGES: Record<MediaPickerError, string> = {
  permission_denied:
    "We need access to your photos to continue. You can enable this in Settings.",
  picker_failed: "Something went wrong opening your photos. Please try again.",
};