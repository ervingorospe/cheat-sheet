import { PickedMedia } from "@/hooks/use-media-picker";
import { supabase } from "@/lib/supabase";
import { useLoadingOverlay } from "@/providers/loading-overlay-provider";
import { GeneratedNotes, NoteGenerationResult } from "@/types/media/note-generation.type";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { File } from "expo-file-system";
import { useCallback, useRef, useState } from "react";

export function useNoteGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { hide: hideLoading } = useLoadingOverlay();

  const cancelGeneration = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const generateNotes = useCallback(
    async (mediaItems: PickedMedia[], message = "Generating your notes..."): Promise<NoteGenerationResult> => {
      if (mediaItems.length === 0) {
        hideLoading();
        return { data: null, error: "No media selected.", cancelled: false };
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      setIsGenerating(true);

      try {
        const items = mediaItems.map((media) => {
          const file = new File(media.uri);
          return { mediaBase64: file.base64Sync(), mimeType: getMimeType(media) };
        });

        const { data, error } = await supabase.functions.invoke("generate-notes", {
          body: { items },
          signal: controller.signal,
        });

        if (error) {
          if (controller.signal.aborted) {
            hideLoading();
            return { data: null, error: null, cancelled: true };
          }

          if (error instanceof FunctionsHttpError) {
            const errorBody = await error.context.json().catch(() => null);
            console.error("Edge function returned an error:", errorBody ?? error.message);

            hideLoading();
            
            return {
              data: null,
              error: typeof errorBody?.error === "string" ? errorBody.error : "Failed to generate notes. Please try again.",
              cancelled: false,
            };
          }

          console.error("Failed to invoke edge function:", error);
          hideLoading();
          return { data: null, error: error.message || "Failed to generate notes. Please try again.", cancelled: false };
        }

        // Deliberately not hiding the overlay here — generation succeeded,
        // and the caller likely has a follow-up step (e.g. saving the note)
        // that should reuse the same overlay with a new message instead of
        // a flicker of hide-then-show.
        return { data: data as GeneratedNotes, error: null, cancelled: false };
      } catch (error) {
        if (controller.signal.aborted || (error instanceof Error && error.name === "AbortError")) {
          hideLoading();
          return { data: null, error: null, cancelled: true };
        }

        console.error("Failed to generate notes:", error);
        hideLoading();
        return { data: null, error: error instanceof Error ? error.message : "Failed to generate notes. Please try again.", cancelled: false };
      } finally {
        setIsGenerating(false);
        abortControllerRef.current = null;
      }
    },
    [hideLoading, cancelGeneration],
  );

  return { generateNotes, isGenerating, cancelGeneration };
}

function getMimeType(media: PickedMedia): string {
  const extension = media.fileName?.split(".").pop()?.toLowerCase() ?? media.uri.split(".").pop()?.toLowerCase();

  if (media.type === "video") {
    return extension === "mov" ? "video/quicktime" : "video/mp4";
  }

  if (extension === "png") return "image/png";
  if (extension === "webp") return "image/webp";
  return "image/jpeg";
}