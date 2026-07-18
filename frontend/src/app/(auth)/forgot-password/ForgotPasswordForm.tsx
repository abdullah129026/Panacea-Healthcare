"use client";

import { useActionState } from "react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { forgotPassword } from "@/app/(auth)/actions";
import type { FormState } from "@/lib/forms";

const initialState: FormState = {};

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    forgotPassword,
    initialState
  );

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg bg-success px-4 py-6 text-center">
        <CheckCircle2 className="w-6 h-6 text-success-foreground" />
        <p className="text-sm text-success-foreground">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state.error && (
        <p className="rounded-lg bg-error px-3 py-2 text-sm text-error-foreground">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-[13px] font-medium tracking-wide text-[#3c4a42] pl-1"
        >
          Email Address
        </label>
        <div className="relative flex items-center">
          <Mail className="absolute left-3 w-5 h-5 text-[#6c7a71]" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="e.g. doctor.smith@hospital.com"
            className="w-full rounded-lg bg-[#f1f5f9] py-3.5 pl-10 pr-4 text-base text-[#0b1c30] placeholder:text-[#bbcabf] focus:outline-none focus:ring-2 focus:ring-[#10b981]/30"
          />
        </div>
        {state.fieldErrors?.email && (
          <p className="text-xs text-destructive pl-1">
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-center gap-2 rounded-lg bg-[#10b981] py-3.5 text-lg font-semibold font-[Manrope] text-[#00422b] shadow-md hover:bg-[#0ea271] transition-colors disabled:opacity-70"
      >
        {pending ? "Sending…" : "Send Reset Link"}
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}
