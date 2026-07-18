import Link from "next/link";
import {
  Sparkles, ShieldCheck, Users, ArrowRight, Play,
  Stethoscope, LineChart, Lock, CheckCircle2,
} from "lucide-react";

const navLinks = ["Platform", "Solutions", "Security", "Pricing"];

const features = [
  { icon: Sparkles, title: "AI Clinical Decision Support", body: "Real-time, evidence-based recommendations surfaced directly in your clinical workflow." },
  { icon: Users, title: "Unified Patient Records", body: "Every encounter, lab, and document in one longitudinal, searchable record." },
  { icon: LineChart, title: "Operational Analytics", body: "Track throughput, revenue, and capacity across departments in real time." },
  { icon: Lock, title: "Enterprise Security", body: "HIPAA-compliant, AES-256 encryption, and granular role-based access control." },
];

const stats = [
  { value: "500+", label: "Clinics" },
  { value: "12K+", label: "Practitioners" },
  { value: "99.99%", label: "Uptime" },
  { value: "40%", label: "Less Admin" },
];

const testimonials = [
  { quote: "Panacea has reduced our administrative overhead by 40%, letting our team focus entirely on patient care.", name: "Dr. Sarah Jenkins", role: "Chief of Medicine, Northview Health" },
  { quote: "The AI decision support has become an indispensable second opinion for our residents.", name: "Dr. Marcus Lee", role: "Director of Cardiology, St. Jude MC" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f9ff] font-[Inter] text-[#0b1c30]">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#f8f9ff]/80 border-b border-[#bbcabf]/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#006c49] flex items-center justify-center">
              <span className="text-white text-sm font-bold font-[Manrope]">P</span>
            </div>
            <span className="text-lg font-semibold font-[Manrope] tracking-tight">Panacea Health</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-[#3c4a42]">
            {navLinks.map((l) => (
              <span key={l} className="hover:text-[#0b1c30] cursor-pointer">{l}</span>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-[#3c4a42] hover:text-[#0b1c30]">Sign In</Link>
            <Link href="/register" className="rounded-lg bg-[#006c49] px-4 py-2 text-sm font-semibold text-white hover:bg-[#005a3d] transition-colors">
              Request Demo
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-0 w-[500px] h-[500px] rounded-full bg-[#10b981]/10 blur-[120px]" />
          <div className="absolute top-40 -left-24 w-[400px] h-[400px] rounded-full bg-[#2170e4]/10 blur-[120px]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 text-center flex flex-col items-center gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#006c49]/20 bg-[#006c49]/5 px-3 py-1 text-xs font-medium text-[#006c49]">
            <ShieldCheck className="w-3.5 h-3.5" /> Trusted by 500+ clinics worldwide
          </span>
          <h1 className="text-5xl md:text-6xl font-bold font-[Manrope] tracking-tight leading-[1.1] max-w-3xl">
            Precision Healthcare,
            <br />
            <span className="text-[#006c49]">Engineered for Scale.</span>
          </h1>
          <p className="text-lg text-[#3c4a42] max-w-xl">
            The clinical operating system that unifies patient records, AI decision
            support, and operations into one intelligent platform.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/register" className="flex items-center gap-2 rounded-xl bg-[#006c49] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#006c49]/30 hover:bg-[#005a3d] transition-colors">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <button className="flex items-center gap-2 rounded-xl border border-[#bbcabf] bg-white px-6 py-3 text-sm font-semibold text-[#0b1c30] hover:bg-[#f1f5f9] transition-colors">
              <Play className="w-4 h-4" /> Watch Demo
            </button>
          </div>

          {/* Hero mockup */}
          <div className="mt-10 w-full max-w-4xl rounded-2xl border border-[#bbcabf]/40 bg-white shadow-2xl overflow-hidden">
            <div className="h-8 bg-[#eff4ff] flex items-center gap-1.5 px-4">
              {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <div className="aspect-[16/9] bg-gradient-to-br from-[#eff4ff] to-white flex items-center justify-center">
              <Stethoscope className="w-16 h-16 text-[#006c49]/30" />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 w-full max-w-3xl">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-bold font-[Manrope] text-[#006c49]">{s.value}</p>
                <p className="text-sm text-[#3c4a42] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-[#006c49] uppercase tracking-wider">Clinical Precision, Reimagined</p>
          <h2 className="text-3xl md:text-4xl font-bold font-[Manrope] tracking-tight mt-2">
            Everything your clinic needs, unified.
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-[#bbcabf]/30 bg-white p-6 flex gap-4 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#006c49]/10 flex items-center justify-center shrink-0">
                <f.icon className="w-6 h-6 text-[#006c49]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold font-[Manrope]">{f.title}</h3>
                <p className="text-sm text-[#3c4a42] mt-1">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-2xl border border-[#bbcabf]/30 bg-white p-8 flex flex-col gap-6">
              <p className="text-lg text-[#0b1c30] leading-relaxed">&quot;{t.quote}&quot;</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-11 h-11 rounded-full bg-[#dce9ff] flex items-center justify-center text-[#0b1c30] text-sm font-semibold font-[Manrope]">
                  {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0b1c30]">{t.name}</p>
                  <p className="text-xs text-[#3c4a42]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="rounded-3xl bg-[#006c49] p-12 text-center text-white flex flex-col items-center gap-6 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-[#10b981] blur-3xl" />
          </div>
          <h2 className="relative text-3xl md:text-4xl font-bold font-[Manrope] tracking-tight">
            Ready to modernize your clinic?
          </h2>
          <p className="relative text-white/80 max-w-md">
            Join thousands of healthcare professionals delivering better care with Panacea.
          </p>
          <div className="relative flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#006c49] hover:bg-white/90 transition-colors">
              Start Free Trial
            </Link>
            <Link href="/login" className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              Talk to Sales
            </Link>
          </div>
          <div className="relative flex items-center gap-6 text-xs text-white/70 mt-2">
            {["No credit card required", "14-day trial", "Cancel anytime"].map((t) => (
              <span key={t} className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> {t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#bbcabf]/20 bg-[#eff4ff]">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#006c49] flex items-center justify-center">
              <span className="text-white text-xs font-bold font-[Manrope]">P</span>
            </div>
            <span className="text-sm font-semibold font-[Manrope]">Panacea Health</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-[#3c4a42]">
            {["Privacy", "Terms", "Security", "Contact"].map((l) => (
              <span key={l} className="hover:text-[#0b1c30] cursor-pointer">{l}</span>
            ))}
          </div>
          <p className="text-xs text-[#3c4a42]/70">© 2024 Panacea Healthcare Solutions.</p>
        </div>
      </footer>
    </div>
  );
}
