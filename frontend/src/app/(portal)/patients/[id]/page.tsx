import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Card, CardTitle, Button, Badge } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { getPatient } from "@/lib/patients";
import type { Patient, PatientStatus } from "@/types";
import {
  Printer, Sparkles, Activity, HeartPulse, Droplets, Wind,
  AlertOctagon, Pill, FileText, Receipt, Phone, Mail, ShieldCheck, CheckCircle2,
} from "lucide-react";

function statusVariant(
  status: PatientStatus
): "success" | "error" | "warning" | "info" | "outline" {
  switch (status) {
    case "Critical":
      return "error";
    case "Active":
    case "Recovering":
      return "success";
    case "Admitted":
      return "info";
    default:
      return "outline";
  }
}

function initials(patient: Patient): string {
  if (patient.avatar) return patient.avatar;
  return patient.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

const vitals = [
  { label: "Blood Pressure", value: "138/84", unit: "mmHg", icon: Activity, status: "Elevated", tone: "warning" as const },
  { label: "Heart Rate", value: "72", unit: "bpm", icon: HeartPulse, status: "Normal", tone: "success" as const },
  { label: "SpO₂", value: "98", unit: "%", icon: Wind, status: "Normal", tone: "success" as const },
  { label: "Glucose", value: "102", unit: "mg/dL", icon: Droplets, status: "Normal", tone: "success" as const },
];

const encounters = [
  { title: "Quarterly Wellness Exam", by: "Conducted by Dr. Sarah Jenkins · General checkup, cardiovascular assessment.", date: "Aug 14, 2024" },
  { title: "Cardiology Follow-up", by: "Reviewed ECG results, adjusted Lisinopril dosage.", date: "Jun 02, 2024" },
  { title: "Lab Panel — Lipids", by: "Comprehensive metabolic panel and lipid profile ordered.", date: "May 18, 2024" },
];

const meds = [
  { name: "Lisinopril 20mg", dose: "Once daily · Hypertension" },
  { name: "Atorvastatin 40mg", dose: "Once daily · Cholesterol" },
  { name: "Metformin 500mg", dose: "Twice daily · Diabetes" },
];

export default async function PatientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["clinician", "admin"]);
  const { id } = await params;
  const result = await getPatient(id);
  if (!result.success) {
    notFound();
  }
  const patient = result.data;

  return (
    <div className="flex flex-col">
      <Header breadcrumbs={[{ label: "Patient Directory", href: "/patients" }, { label: "Detailed Patient Record" }]} />
      <div className="p-6 space-y-6">
        {/* Identity header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl font-semibold font-mono">{initials(patient)}</div>
            <div>
              <h1 className="text-2xl font-bold font-mono text-foreground">{patient.name}</h1>
              <p className="text-sm text-muted-foreground">ID: {patient.id} · {patient.age} y/o · {patient.gender}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={statusVariant(patient.status)}>{patient.status}</Badge>
                <Badge variant="outline">{patient.condition}</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm"><Printer className="w-4 h-4" /> Print Record</Button>
            <Button variant="primary" size="sm"><Sparkles className="w-4 h-4" /> Run Detailed Analysis</Button>
          </div>
        </div>

        {/* AI risk summary */}
        <Card className="bg-primary/5 border-primary/20 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle>AI Clinical Risk Summary</CardTitle>
              <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
                Analysis of recent vitals and lab results suggests a 15% increase in hypertensive markers compared to last quarter. Recommendation: reviewing current dosage of Lisinopril and scheduling a follow-up cardiology consult within 30 days.
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">Run Detailed Analysis</Button>
        </Card>

        {/* Vitals + allergies */}
        <div className="grid grid-cols-4 gap-4">
          {vitals.map((v) => (
            <Card key={v.label} className="p-4">
              <div className="flex items-center justify-between">
                <v.icon className="w-4 h-4 text-primary" />
                <Badge variant={v.tone}>{v.status}</Badge>
              </div>
              <p className="text-2xl font-bold font-mono text-foreground mt-2">{v.value}<span className="text-xs text-muted-foreground ml-1">{v.unit}</span></p>
              <p className="text-xs text-muted-foreground mt-1">{v.label}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left column */}
          <div className="col-span-2 space-y-6">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <CardTitle>Recent Clinical Encounters</CardTitle>
                <button className="text-xs text-primary hover:underline">View Full History</button>
              </div>
              <div className="space-y-4">
                {encounters.map((e, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      {i < encounters.length - 1 && <span className="w-px flex-1 bg-border mt-1" />}
                    </div>
                    <div className="pb-4">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{e.title}</p>
                        <span className="text-[10px] text-muted-foreground">{e.date}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{e.by}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-6">
              <Card className="space-y-3">
                <CardTitle className="flex items-center gap-2"><FileText className="w-4 h-4 text-primary" /> Key Documents</CardTitle>
                {["Cardiac Stress Test Results", "2023 Annual Wellness Report", "X-ray (Right Knee) — 2022"].map((d) => (
                  <div key={d} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4" /> {d}
                  </div>
                ))}
              </Card>
              <Card className="space-y-3">
                <CardTitle className="flex items-center gap-2"><Receipt className="w-4 h-4 text-primary" /> Recent Billing</CardTitle>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Co-pay · Oct 12 visit</span>
                  <span className="text-foreground font-medium">$40.00</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Insurance Claim · North Gate</span>
                  <Badge variant="success">Paid</Badge>
                </div>
                <button className="text-xs text-primary hover:underline">Access Financial Ledger</button>
              </Card>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <Card className="space-y-3">
              <CardTitle className="flex items-center gap-2"><AlertOctagon className="w-4 h-4 text-error-foreground" /> Known Allergies</CardTitle>
              <div className="flex flex-wrap gap-2">
                {["Penicillin", "Sulfa Drugs", "Latex"].map((a) => (
                  <Badge key={a} variant="error">{a}</Badge>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-3">
                <CardTitle className="flex items-center gap-2"><Pill className="w-4 h-4 text-primary" /> Active Medications</CardTitle>
                <Badge variant="info">3 Active</Badge>
              </div>
              <div className="space-y-3">
                {meds.map((m) => (
                  <div key={m.name} className="p-3 rounded-xl border border-border">
                    <p className="text-sm font-medium text-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.dose}</p>
                  </div>
                ))}
              </div>
              <Button variant="primary" size="sm" className="w-full mt-4">Manage Prescriptions</Button>
            </Card>

            <Card className="space-y-3">
              <CardTitle>Patient Information</CardTitle>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground"><Phone className="w-4 h-4" /> {patient.phone}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><Mail className="w-4 h-4" /> {patient.email}</div>
                <div className="flex items-center gap-2 text-muted-foreground"><ShieldCheck className="w-4 h-4" /> {patient.department} · {patient.doctor}</div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
