import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";
import { LoginForm } from "./LoginForm";

function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-[#006c49] flex items-center justify-center shadow-lg shadow-[#006c49]/30">
        <span className="text-white text-lg font-bold font-[Manrope]">P</span>
      </div>
      <div>
        <p className="text-2xl font-semibold font-[Manrope] tracking-tight text-[#0b1c30]">
          Panacea
        </p>
        <p className="text-[13px] font-bold tracking-[0.13em] text-[#006c49] font-[Inter]">
          CLINICAL PORTAL
        </p>
      </div>
    </div>
  );
}

const features = [
  {
    icon: ShieldCheck,
    color: "#006c49",
    title: "HIPAA Compliant",
    body: "Enterprise-grade data security protocols.",
  },
  {
    icon: Sparkles,
    color: "#0058be",
    title: "AI Diagnostics",
    body: "Real-time clinical decision support.",
  },
];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9ff] font-[Inter] text-[#0b1c30] relative overflow-hidden">
      {/* Ambient gradients */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full bg-[#10b981]/5 blur-[105px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[640px] h-[640px] rounded-full bg-[#2170e4]/5 blur-[105px]" />

      <main className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-[1100px] grid lg:grid-cols-[526px_448px] gap-12 lg:gap-[87px] justify-center items-center">
          {/* Left: Branding */}
          <div className="hidden lg:flex flex-col gap-8">
            <BrandMark />
            <div className="flex flex-col gap-4">
              <h1 className="text-[32px] leading-[1.25] font-bold font-[Manrope] tracking-tight text-[#0b1c30]">
                Precision Healthcare
                <br />
                Powered by Intelligence.
              </h1>
              <p className="text-base leading-[1.625] text-[#3c4a42] max-w-md">
                Access the clinical operating system designed for the future of
                medicine. Securely manage patients, diagnostics, and AI-driven
                insights in one unified dashboard.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-4">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl bg-[#eff4ff] border border-[#bbcabf]/30 p-4"
                >
                  <f.icon className="w-5 h-5" style={{ color: f.color }} />
                  <p className="text-[13px] font-bold text-[#0b1c30] mt-2">
                    {f.title}
                  </p>
                  <p className="text-xs text-[#3c4a42] mt-1">{f.body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Login card */}
          <div className="flex flex-col gap-8 w-full">
            <div className="rounded-3xl bg-white/80 backdrop-blur-md border border-white p-10 shadow-xl shadow-[#0b1c30]/5">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold font-[Manrope] tracking-tight text-[#0b1c30]">
                  Account Sign In
                </h2>
                <p className="text-base text-[#3c4a42] mt-1">
                  Enter your credentials to access the portal
                </p>
              </div>

              {/* Social logins */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {["Google", "Microsoft"].map((provider) => (
                  <button
                    key={provider}
                    className="flex items-center justify-center gap-2 rounded-lg border border-[#bbcabf] py-2.5 text-base text-[#0b1c30] hover:bg-[#f1f5f9] transition-colors"
                  >
                    <span className="w-[18px] h-[18px] rounded-full bg-[#bbcabf]/40" />
                    {provider}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center mb-8">
                <span className="absolute inset-x-0 h-px bg-[#bbcabf]/50" />
                <span className="relative bg-white px-2 text-xs text-[#3c4a42]">
                  OR CONTINUE WITH EMAIL
                </span>
              </div>

              {/* Form */}
              <LoginForm redirectTo={from} />

              <p className="text-center text-base text-[#3c4a42] mt-8">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-[#006c49] hover:underline">
                  Request access
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#bbcabf]/10 py-6 flex flex-col items-center gap-2">
        <div className="flex items-center gap-8 text-base text-[#3c4a42]/60">
          {["Privacy Policy", "Terms of Service", "Security Center", "Support Portal"].map(
            (l) => (
              <span key={l} className="hover:text-[#3c4a42] cursor-pointer">
                {l}
              </span>
            )
          )}
        </div>
        <p className="text-base text-[#3c4a42]/60">
          © 2024 Panacea Healthcare Solutions. All rights reserved. Version
          4.2.0-stable
        </p>
      </footer>
    </div>
  );
}
