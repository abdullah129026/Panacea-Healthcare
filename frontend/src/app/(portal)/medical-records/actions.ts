"use server";

import { revalidatePath } from "next/cache";
import type { Document } from "@/types";
import { serverApi } from "@/lib/api";
import { requireRole } from "@/lib/auth";
import { uploadDocumentSchema } from "@/lib/schemas";
import { fieldErrorsFromZod, type FormState } from "@/lib/forms";

/** Roles permitted to upload documents. */
const DOCUMENT_WRITE_ROLES = ["clinician", "admin"] as const;

export async function uploadDocument(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireRole(DOCUMENT_WRITE_ROLES);

  const file = formData.get("file") as File | null;

  if (!file) {
    return { error: "No file selected." };
  }

  const parsed = uploadDocumentSchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    category: formData.get("category"),
    patientId: formData.get("patientId"),
    sizeBytes: file.size,
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const uploadData = new FormData();
  uploadData.append("file", file);
  uploadData.append("name", parsed.data.name);
  uploadData.append("type", parsed.data.type);
  uploadData.append("category", parsed.data.category);
  if (parsed.data.patientId) {
    uploadData.append("patientId", parsed.data.patientId);
  }

  const result = await serverApi.post<Document>("/documents/upload", {
    body: uploadData,
  });

  if (!result.success) {
    return { error: result.error };
  }

  revalidatePath("/medical-records");
  return { success: true, message: "Document uploaded successfully." };
}
