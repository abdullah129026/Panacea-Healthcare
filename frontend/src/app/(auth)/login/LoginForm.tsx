"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { login } from "@/app/(auth)/actions";
import type { FormState } from "@/lib/forms";

const initialState: FormState = {};

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction, pending] = useActionState(login, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {redirectTo && (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      )}
      {state.error && (
        <p className="rounded-lg bg-error px-3 py-2 text-sm text-error-foreground">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-base text-[#3c4a42] pl-1">
          Work Email
        </label>
        <div className="relative flex items-center">
          <Mail className="absolute left-3 w-5 h-5 text-[#6c7a71]" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@healthcare.org"
            className="w-full rounded-lg bg-[#f1f5f9] py-3.5 pl-10 pr-4 text-sm text-[#0b1c30] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#006c49]/30"
          />
        </div>
        {state.fieldErrors?.email && (
          <p className="text-xs text-destructive pl-1">
            {state.fieldErrors.email[0]}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between px-1">
          <label htmlFor="password" className="text-base text-[#3c4a42]">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-base text-[#006c49] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative flex items-center">
          <Lock className="absolute left-3 w-5 h-5 text-[#6c7a71]" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full rounded-lg bg-[#f1f5f9] py-3.5 pl-10 pr-12 text-sm text-[#0b1c30] placeholder:text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#006c49]/30"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-4 text-[#6c7a71]"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {state.fieldErrors?.password && (
          <p className="text-xs text-destructive pl-1">
            {state.fieldErrors.password[0]}
          </p>
        )}
      </div>

      <label className="flex items-center gap-2 px-1 cursor-pointer">
        <input
          type="checkbox"
          name="rememberMe"
          className="w-4 h-4 rounded border-[#bbcabf] accent-[#006c49]"
        />
        <span className="text-base text-[#3c4a42]">
          Stay signed in for 30 days
        </span>
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#006c49] py-3.5 text-center text-base font-bold text-white shadow-lg shadow-[#006c49]/30 hover:bg-[#005a3d] transition-colors disabled:opacity-70"
      >
        {pending ? "Signing in…" : "Sign In to Portal"}
      </button>
    </form>
  );
}
