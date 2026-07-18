"use server";

import { revalidatePath } from "next/cache";
import type { Message } from "@/types";
import { serverApi } from "@/lib/api";
import { requireRole } from "@/lib/auth";
import type { FormState } from "@/lib/forms";

const COMMUNICATIONS_WRITE_ROLES = ["admin", "clinician"] as const;

export async function sendMessage(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await requireRole(COMMUNICATIONS_WRITE_ROLES);

  const conversationId = formData.get("conversationId") as string;
  const text = formData.get("text") as string;

  if (!conversationId || !text.trim()) {
    return { error: "Conversation ID and message text are required" };
  }

  const result = await serverApi.post<Message>(
    `/conversations/${encodeURIComponent(conversationId)}/messages`,
    {
      body: {
        text: text.trim(),
      },
    }
  );

  if (!result.success) {
    return { error: result.error };
  }

  revalidatePath(`/communications`);
  return { success: true, message: "Message sent successfully." };
}
