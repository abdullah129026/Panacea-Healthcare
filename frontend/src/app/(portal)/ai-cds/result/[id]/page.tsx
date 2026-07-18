import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Card, CardTitle, Button, Badge } from "@/components/ui";
import { requireRole } from "@/lib/auth";
import { getRiskScore } from "@/lib/riskScores";
import { Save, Download, Sparkles, Activity, HeartPulse, FlaskConical } from "lucide-react";
import { RiskFactorChart } from "@/components/RiskFactorChart";

const recommendations = [
  {
    icon: Activity,
    title: "Optimize Primary Treatment",
    body: "Review current treatment regimen and consider dosage adjustments based on current risk levels.",
  },
  {
    icon: HeartPulse,
    title: "Schedule Diagnostic Review",
    body: "Due to the identified risk factors, schedule appropriate diagnostic testing within 14 days.",
  },
  {
    icon: FlaskConical,
    title: "Specialist Referral",
    body: "Consider referral to specialist for comprehensive evaluation and management plan.",
  },
];

export default async function AIAnalysisResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole(["clinician", "admin"]);

  const { id } = await params;
  const result = await getRiskScore(id);

  if (!result.success) {
    notFound();
  }

  const analysis = result.data;

  function levelColor(level: string): string {
    switch (level) {
      case "Critical":
        return "#D93C15";
      case "High":
        return "#FF9F1C";
      case "Moderate":
        return "#FFD60A";
      case "Low":
        return "#06D6A0";
      default:
        return "#666";
    }
  }

  function levelBgVariant(
    level: string
  ): "error" | "warning" | "info" | "success" | "outline" {
    switch (level) {
      case "Critical":
        return "error";
      case "High":
        return "warning";
      case "Moderate":
        return "info";
      case "Low":
        return "success";
      default:
        return "outline";
    }
  }

  return (
    <div className="flex flex-col">
      <Header
        breadcrumbs={[
          { label: "AI CDS", href: "/ai-cds" },
          { label: "Analysis Results" },
        ]}
      />
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold font-mono text-foreground">
              Clinical Risk Assessment
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Patient: {analysis.patientName} • ID: {analysis.patientId}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4" /> Save
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" /> Export
            </Button>
            <Button variant="primary" size="sm">
              <Sparkles className="w-4 h-4" /> Create Plan
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Risk */}
          <Card className="flex flex-col items-center text-center gap-3">
            <div
              className="relative w-40 h-40 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(${levelColor(analysis.level)} 0% ${analysis.overall}%, #E5DCDA ${analysis.overall}% 100%)`,
              }}
            >
              <div className="w-32 h-32 rounded-full bg-card flex flex-col items-center justify-center">
                <span className="text-4xl font-bold font-mono">
                  {Math.round(analysis.overall)}%
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {analysis.level} Risk
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {analysis.recommendation}
            </p>
            <Badge variant={levelBgVariant(analysis.level)}>
              {analysis.level}
            </Badge>
          </Card>

          {/* Risk Factors Radar */}
          <Card className="lg:col-span-2">
            <CardTitle className="mb-4">Risk Factor Profile</CardTitle>
            <RiskFactorChart data={analysis.factors} />
          </Card>
        </div>

        {/* Risk Drivers Detailed */}
        <Card className="space-y-4">
          <CardTitle>Risk Factor Breakdown</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysis.factors.map((factor) => (
              <div key={factor.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {factor.label}
                  </span>
                  <span className="text-sm font-bold font-mono">
                    {factor.score.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${factor.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Clinical Recommendations */}
        <Card className="space-y-4">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Clinical Recommendations
          </CardTitle>
          <div className="space-y-3">
            {recommendations.map((r) => (
              <div key={r.title} className="flex gap-3 p-3 rounded-xl border border-border">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <r.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{r.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
