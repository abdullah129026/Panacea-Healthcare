import Link from "next/link";
import { ArrowRight, LifeBuoy, ShieldCheck } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff] font-[Inter] text-[#0b1c30] px-6 relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-24 w-[512px] h-[410px] rounded-full bg-[#10b981]/10 blur-[105px]" />
        <div className="absolute left-[896px] top-[712px] w-[512px] h-[410px] rounded-full bg-[#2170e4]/10 blur-[105px]" />
      </div>

      <div className="relative w-full max-w-[480px] flex flex-col gap-8">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-[#006c49] flex items-center justify-center shadow-lg shadow-[#006c49]/20">
            <span className="text-white text-lg font-bold font-[Manrope]">P</span>
          </div>
          <p className="text-base font-semibold font-[Manrope] tracking-tight text-[#0b1c30] mt-2">
            Panacea
          </p>
          <p className="text-base tracking-[0.16em] text-[#3c4a42] mt-2">
            CLINICAL PORTAL
          </p>
        </div>

        {/* Verification card */}
        <div className="rounded-xl bg-white/80 backdrop-blur-md border border-[#bbcabf]/30 shadow-xl p-10 flex flex-col gap-8">
          <div className="flex flex-col items-center gap-1 text-center">
            <h2 className="text-base font-semibold font-[Manrope] text-[#0b1c30]">
              Verify your email
            </h2>
            <p className="text-base text-[#3c4a42]">
              Enter the 6-digit code we sent to your email
            </p>
            <p className="text-base font-bold text-[#006c49]">
              dr.smith@panacea-health.com
            </p>
          </div>

          <form className="flex flex-col gap-4">
            <div className="flex justify-between gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  inputMode="numeric"
                  maxLength={1}
                  className="w-14 h-16 rounded-lg bg-[#eff4ff] text-center text-2xl font-semibold text-[#0b1c30] focus:outline-none focus:ring-2 focus:ring-[#10b981]/40"
                />
              ))}
            </div>

            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 rounded-lg bg-[#10b981] py-4 text-base font-bold text-[#00422b] shadow-sm hover:bg-[#0ea271] transition-colors"
            >
              Verify
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <p className="text-center text-base text-[#3c4a42] opacity-50">
              Didn&apos;t receive the code?{" "}
              <span className="font-bold text-[#006c49]">Resend Code</span>{" "}
              <span className="text-[#6c7a71]">(00:57)</span>
            </p>
          </form>
        </div>

        {/* Footer links */}
        <div className="flex justify-center gap-6 text-base text-[#3c4a42]">
          <span className="flex items-center gap-1.5 cursor-pointer hover:text-[#0b1c30]">
            <LifeBuoy className="w-3 h-3" />
            Support
          </span>
          <span className="flex items-center gap-1.5 cursor-pointer hover:text-[#0b1c30]">
            <ShieldCheck className="w-3 h-3" />
            Security Privacy
          </span>
        </div>
      </div>
    </div>
  );
}
