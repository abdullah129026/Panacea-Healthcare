"use server";

import { redirect } from "next/navigation";
import type { AuthResponse } from "@/types";
import { serverApi } from "@/lib/api";
import { createSession } from "@/lib/auth";
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
} from "@/lib/schemas";
import { fieldErrorsFromZod, type FormState } from "@/lib/forms";
import { logLoginAttempt } from "@/lib/audit";

const GENERIC_ERROR = "Something went wrong. Please try again in a moment.";

export async function login(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    rememberMe: formData.get("rememberMe") === "on",
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const result = await serverApi.post<AuthResponse>("/auth/login", {
    body: {
      email: parsed.data.email,
      password: parsed.data.password,
    },
  });

  if (!result.success) {
    await logLoginAttempt(false, parsed.data.email);
    return { error: "Invalid email or password." };
  }

  try {
    await createSession({
      token: result.data.token,
      clinicId: result.data.user.clinicId,
      rememberMe: parsed.data.rememberMe ?? false,
    });
    await logLoginAttempt(true, parsed.data.email);
  } catch (error) {
    console.error("[auth/login] failed to persist session", error);
    return { error: GENERIC_ERROR };
  }

  redirect(safeRedirect(formData.get("redirectTo")));
}

/** Only allow same-origin absolute paths as post-login redirect targets. */
function safeRedirect(value: FormDataEntryValue | null): string {
  if (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//")
  ) {
    return value;
  }
  return "/dashboard";
}

export async function register(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    clinicName: formData.get("clinicName"),
    email: formData.get("email"),
    password: formData.get("password"),
    agree: formData.get("agree") === "on",
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const result = await serverApi.post<{ email: string }>("/auth/register", {
    body: {
      name: parsed.data.name,
      clinicName: parsed.data.clinicName,
      email: parsed.data.email,
      password: parsed.data.password,
      agree: parsed.data.agree,
    },
  });

  if (!result.success) {
    return { error: result.error };
  }

  redirect("/verify-email");
}

export async function forgotPassword(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFromZod(parsed.error) };
  }

  const result = await serverApi.post<void>("/auth/forgot-password", {
    body: { email: parsed.data.email },
  });

  if (!result.success) {
    return { error: result.error };
  }

  return {
    success: true,
    message:
      "If an account exists for that email, a reset link is on its way.",
  };
}
