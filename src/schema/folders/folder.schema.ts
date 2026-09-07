import { z } from "zod";

export const folderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Folder name is required")
    .max(100, "Folder name must be 100 characters or less"),
});

export type FolderFormValues = z.infer<typeof folderSchema>;