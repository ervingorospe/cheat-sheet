import { z } from "zod";

export const noteEditSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string(),
  key_points: z.array(
    z.object({
      value: z.string(),
    }),
  ),
  doc_links: z.array(
    z.object({
      label: z.string(),
      url: z.union([
        z.literal(""),
        z.url("Please enter a valid URL"),
      ]),
    }),
  ),
});

export type NoteEditFormValues = z.infer<typeof noteEditSchema>;