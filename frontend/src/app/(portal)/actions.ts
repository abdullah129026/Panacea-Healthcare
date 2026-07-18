"use server";

import { redirect } from "next/navigation";
import { serverApi } from "@/lib/api";
import { destroySession } from "@/lib/auth";

export async function logout(): Promise<void> {
  const result = await serverApi.post<void>("/auth/logout");
  if (!result.success) {
    console.error("[auth/logout] backend logout failed", result.error);
  }

  try {
    await destroySession();
  } catch (error) {
    console.error("[auth/logout] failed to clear session cookies", error);
  }

  redirect("/login");
}
