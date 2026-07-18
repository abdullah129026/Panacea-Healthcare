"use client";

import { useActionState, useState } from "react";
import { User, Building2, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { register } from "@/app/(auth)/actions";
import type { FormState } from "@/lib/forms";

const initialState: FormState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(register, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-5 pt-2">
      {state.error && (
        <p className="rounded-lg bg-error px-3 py-2 text-sm text-error-foreground">
          {state.error}
        </p>
      )}

      <Field
        label="Full Name"
        name="name"
        icon={User}
        placeholder="Dr. Julian Moore"
        error={state.fieldErrors?.name?.[0]}
      />
      <Field
        label="Hospital/Clinic Name"
        name="clinicName"
        icon={Building2}
        placeholder="Metropolitan General Hospital"
        error={state.fieldErrors?.clinicName?.[0]}
      />
      <Field
        label="Professional Email"
        name="email"
        icon={Mail}
        type="email"
        placeholder="j.moore@medical-inst.org"
        error={state.fieldErrors?.email?.[0]}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-base text-[#3c4a42]">
          Password
        </label>
        <div className="relative flex items-center">
          <Lock className="absolute left-3 w-4 h-4 text-[#6c7a71]" />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••••••"
            className="w-full rounded-lg bg-[#f1f5f9] py-3.5 pl-10 pr-12 text-base text-[#0b1c30] placeholder:text-[#bbcabf] focus:outline-none focus:ring-2 focus:ring-[#10b981]/30"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-4 text-[#bbcabf]"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {state.fieldErrors?.password ? (
          <p className="text-xs text-destructive">
            {state.fieldErrors.password[0]}
          </p>
        ) : (
          <p className="text-xs text-[#3c4a42]">
            Must be at least 12 characters with 1 symbol.
          </p>
        )}
      </div>

      <label className="flex items-start gap-3 py-2 cursor-pointer">
        <input
          type="checkbox"
          name="agree"
          className="mt-1 w-4 h-4 rounded border-[#bbcabf] accent-[#10b981]"
        />
        <span className="text-base leading-[1.5] text-[#3c4a42]">
          I agree to the Terms of Service and Privacy Policy, including
          HIPAA-compliant data processing.
        </span>
      </label>
      {state.fieldErrors?.agree && (
        <p className="text-xs text-destructive">{state.fieldErrors.agree[0]}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex items-center justify-center gap-2 rounded-lg bg-[#10b981] py-3.5 text-base font-semibold font-[Manrope] text-white shadow-md hover:bg-[#0ea271] transition-colors disabled:opacity-70"
      >
        {pending ? "Creating account…" : "Create Account"}
        <ArrowRight className="w-3 h-3" />
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  icon: Icon,
  placeholder,
  type = "text",
  error,
}: {
  label: string;
  name: string;
  icon: LucideIcon;
  placeholder: string;
  type?: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="text-base text-[#3c4a42]">
        {label}
      </label>
      <div className="relative flex items-center">
        <Icon className="absolute left-3 w-4 h-4 text-[#6c7a71]" />
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          className="w-full rounded-lg bg-[#f1f5f9] py-3.5 pl-10 pr-4 text-base text-[#0b1c30] placeholder:text-[#bbcabf] focus:outline-none focus:ring-2 focus:ring-[#10b981]/30"
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
