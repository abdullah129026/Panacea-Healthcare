import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff] font-[Inter] text-[#0b1c30] px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-[320px] top-[256px] w-96 h-96 rounded-full bg-[#4edea3] blur-[56px]" />
        <div className="absolute left-[576px] top-[370px] w-96 h-96 rounded-full bg-[#adc6ff] blur-[56px]" />
      </div>

      <div className="relative w-full max-w-[448px] flex flex-col gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-[#10b981] flex items-center justify-center shadow-sm mb-4">
            <span className="text-[#00422b] text-lg font-bold font-[Manrope]">P</span>
          </div>
          <p className="text-2xl font-semibold font-[Manrope] tracking-tight text-[#0b1c30]">
            Panacea
          </p>
          <p className="text-[13px] font-medium tracking-[0.13em] text-[#3c4a42] mt-1">
            CLINICAL PORTAL
          </p>
        </div>

        {/* Recovery card */}
        <div className="rounded-xl bg-white border border-[#bbcabf]/30 shadow-lg px-8 pt-10 pb-8 flex flex-col gap-8 relative overflow-hidden">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-semibold font-[Manrope] text-[#0b1c30]">
              Password Recovery
            </h2>
            <p className="text-sm leading-[1.43] text-[#3c4a42]">
              Enter your registered email address below and we&apos;ll send you a
              secure link to reset your password.
            </p>
          </div>

          <ForgotPasswordForm />

          <div className="pt-6 border-t border-[#bbcabf]/20 flex justify-center">
            <Link
              href="/login"
              className="flex items-center gap-2 text-[13px] font-medium text-[#3c4a42] hover:text-[#0b1c30]"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to Login
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-[#3c4a42]">
          Having trouble? Contact Panacea Support
        </p>
      </div>
    </div>
  );
}
