import { z } from "zod";

const documentCategory = z.enum([
  "Clinical",
  "Lab Reports",
  "Imaging & Scans",
  "Prescriptions",
  "Admin Documents",
  "Archived",
]);

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

/**
 * Validates the upload form's metadata. The binary itself is a `File` carried
 * in the `FormData` and streamed to the API's file endpoint (see architecture).
 */
export const uploadDocumentSchema = z.object({
  name: z.string().min(1, "Document name is required."),
  type: z.string().min(1, "Document type is required."),
  category: documentCategory,
  patientId: z.string().optional(),
  sizeBytes: z.coerce
    .number()
    .int()
    .max(MAX_UPLOAD_BYTES, "File exceeds the 25 MB limit."),
});

export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>;
