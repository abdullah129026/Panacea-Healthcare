import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { RegisterForm } from "./RegisterForm";

const trustMetrics = [
  { value: "HIPAA", label: "Fully Compliant" },
  { value: "AES-256", label: "End-to-End Encryption" },
];

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#f8f9ff] font-[Inter] text-[#0b1c30]">
      {/* Left: visual / trust column */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 bottom-[-40px] w-96 h-96 rounded-full bg-[#10b981]/10 blur-[56px]" />
          <div className="absolute left-[352px] -top-24 w-96 h-96 rounded-full bg-[#2170e4]/10 blur-[56px]" />
        </div>

        <div className="relative flex flex-col gap-6 max-w-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#10b981] flex items-center justify-center">
              <span className="text-white font-bold font-[Manrope]">P</span>
            </div>
            <span className="text-2xl font-semibold font-[Manrope] tracking-tight text-[#0b1c30]">
              Panacea
            </span>
          </div>

          <div className="flex flex-col gap-6 pt-2">
            <h1 className="text-[32px] leading-[1.25] font-bold font-[Manrope] tracking-tight text-[#0b1c30]">
              Empowering Clinical
              <br />
              Excellence.
            </h1>
            <p className="text-base leading-[1.5] text-[#3c4a42]">
              Join over 12,000 healthcare professionals using Panacea to
              streamline clinical operations and enhance patient outcomes with
              AI-assisted decision support.
            </p>
            <div className="flex gap-16 pt-2">
              {trustMetrics.map((m) => (
                <div key={m.value}>
                  <p className="text-2xl font-bold tracking-tight text-[#006c49]">
                    {m.value}
                  </p>
                  <p className="text-base text-[#3c4a42]">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonial card */}
        <div className="relative max-w-sm rounded-xl bg-white/80 backdrop-blur-md border border-white/30 shadow-lg p-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#dce9ff] flex items-center justify-center text-[#0b1c30] font-semibold font-[Manrope]">
              SJ
            </div>
            <div>
              <p className="text-lg font-semibold font-[Manrope] text-[#0b1c30]">
                Dr. Sarah Jenkins
              </p>
              <p className="text-base text-[#3c4a42] leading-tight">
                Chief of Medicine, Northview Health
              </p>
            </div>
          </div>
          <p className="text-base italic leading-[1.5] text-[#3c4a42]">
            &quot;Panacea has reduced our administrative overhead by 40%, allowing
            our team to focus entirely on patient care.&quot;
          </p>
        </div>
      </div>

      {/* Right: registration form */}
      <div className="flex items-center justify-center p-8 md:p-16 lg:p-24">
        <div className="w-full max-w-[448px] flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold font-[Manrope] tracking-tight text-[#0b1c30]">
              Create clinical account
            </h2>
            <p className="text-base text-[#3c4a42]">
              Start your 14-day premium trial today.
            </p>
          </div>

          <RegisterForm />

          {/* Divider */}
          <div className="relative flex items-center justify-center py-2">
            <span className="absolute inset-x-0 h-px bg-[#bbcabf]/30" />
            <span className="relative bg-[#f8f9ff] px-2 text-xs tracking-wider text-[#6c7a71]">
              AUTHORIZED SIGN-IN
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {["Google Workspace", "SSO / SAML"].map((label) => (
              <button
                key={label}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#bbcabf] bg-white py-3 text-base text-[#0b1c30] hover:bg-[#f1f5f9] transition-colors"
              >
                {label === "SSO / SAML" ? (
                  <ShieldCheck className="w-4 h-4 text-[#2563eb]" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-[#bbcabf]/40" />
                )}
                {label}
              </button>
            ))}
          </div>

          <p className="text-center text-base text-[#3c4a42]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#006c49] hover:underline">
              Log in to Portal
            </Link>
          </p>

          <div className="flex items-center justify-center gap-4 pt-2 text-xs text-[#6c7a71]">
            {["Help Center", "Security Architecture", "Global Contact"].map(
              (l, i) => (
                <span key={l} className="flex items-center gap-4">
                  {i > 0 && <span className="w-1 h-1 rounded-full bg-[#bbcabf]" />}
                  <span className="hover:text-[#3c4a42] cursor-pointer">{l}</span>
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
