import Link from "next/link";
import { parseISO } from "date-fns";
import { Header } from "@/components/layout/Header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  StatCard,
} from "@/components/ui";
import { NewClinicalAnalysisModal } from "@/components/modals/NewClinicalAnalysisModal";
import { requireRole } from "@/lib/auth";
import { listRiskScores } from "@/lib/riskScores";
import { cn } from "@/lib/utils";
import {
  Users,
  Activity,
  Target,
  AlertTriangle,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { RiskDistributionChart, RiskTrendChart } from "@/components/CDSCharts";

const trendData = [
  { month: "Jan", riskScore: 68, recoveryRate: 74 },
  { month: "Feb", riskScore: 72, recoveryRate: 78 },
  { month: "Mar", riskScore: 65, recoveryRate: 82 },
  { month: "Apr", riskScore: 78, recoveryRate: 76 },
  { month: "May", riskScore: 62, recoveryRate: 85 },
  { month: "Jun", riskScore: 55, recoveryRate: 89 },
];

function levelVariant(
  level: string
): "error" | "warning" | "info" | "outline" | "success" {
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

function levelInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function formatCreated(iso: string): string {
  try {
    const date = parseISO(iso);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "just now";
    if (hours === 1) return "1h ago";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  } catch {
    return "—";
  }
}

export default async function AICDSPage() {
  await requireRole(["clinician", "admin"]);

  const result = await listRiskScores({ pageSize: 10 });
  const analyses = result.success ? result.data.items : [];

  const riskLevels = ["Critical", "High", "Moderate", "Low"];
  const levelCounts = riskLevels.map((level) => ({
    name: level,
    value: analyses.filter((a) => a.level === level).length,
    color:
      level === "Critical"
        ? "#D93C15"
        : level === "High"
          ? "#006c49"
          : level === "Moderate"
            ? "#eff4ff"
            : "#004D1A",
  }));

  const totalAnalyses = levelCounts.reduce((sum, c) => sum + c.value, 0);

  return (
    <>
      <Header
        breadcrumbs={[
          { label: "AI Clinical Decision", href: "#" },
          { label: "Dashboard" },
        ]}
      />

      <div className="p-6 space-y-6">
        {/* ---- Title Row ---- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold font-mono text-foreground">
              Clinical Intelligence
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              AI-powered clinical predictions and decision support for proactive
              healthcare
            </p>
          </div>

          <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1">
            {["Risk Alerts", "Diagnosis Aids", "Predictions"].map((tab, i) => (
              <button
                key={tab}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  i === 0
                    ? "bg-primary text-white"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <NewClinicalAnalysisModal />
        </div>

        {/* ---- Stat Cards ---- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Patients"
            value="14 Patients"
            subtitle="Currently monitored"
            icon={Users}
            iconColor="text-primary"
            change="+3 this week"
            changeType="up"
          />
          <StatCard
            label="Conditions Monitored"
            value="28 Active"
            subtitle="Across all patients"
            icon={Activity}
            iconColor="text-primary"
            change="+5 new"
            changeType="up"
          />
          <StatCard
            label="Diagnostic Accuracy"
            value="94.8%"
            subtitle="AI prediction accuracy"
            icon={Target}
            iconColor="text-success-foreground"
          />
          <StatCard
            label="Alerts Generated"
            value="7"
            subtitle="Requiring attention"
            icon={AlertTriangle}
            iconColor="text-warning-foreground"
          />
        </div>

        {/* ---- Main Grid ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left column (3/5) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Risk Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Predictive Risk Distribution</CardTitle>
                <Badge variant="outline">
                  {totalAnalyses || "0"} Total
                </Badge>
              </CardHeader>

              <div className="flex flex-col sm:flex-row items-center gap-8">
                {/* Donut chart */}
                <div className="relative w-[200px] h-[200px]">
                  <RiskDistributionChart data={levelCounts} />
                  {/* Center label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold font-mono text-foreground">
                      {totalAnalyses || "0"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Analyses
                    </span>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-4 flex-1">
                  {levelCounts.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-3">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: entry.color }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">
                            {entry.value} {entry.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {Math.round(
                              ((entry.value / (totalAnalyses || 1)) * 100) || 0
                            )}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full mt-1.5">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${
                                ((entry.value / (totalAnalyses || 1)) * 100) || 0
                              }%`,
                              backgroundColor: entry.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* AI Insight */}
            <Card className="bg-info border-info">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-info-foreground/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-info-foreground" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-info-foreground mb-1">
                    AI-Based Insight
                  </h4>
                  <p className="text-xs text-info-foreground/80 leading-relaxed">
                    Based on current patient data analysis, there is a{" "}
                    <span className="font-semibold">23% increase</span> in
                    cardiovascular risk factors among patients aged 45-65.
                    Recommended: Increase monitoring frequency for this
                    demographic group.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right column (2/5) – Recent Analyses */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Recent Analyses</CardTitle>
                <Badge variant="outline">{analyses.length} Latest</Badge>
              </CardHeader>

              <div className="space-y-4">
                {analyses.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">
                    No analyses yet. Run one to get started.
                  </p>
                ) : (
                  analyses.map((analysis) => (
                    <Link
                      key={analysis.id}
                      href={`/ai-cds/result/${analysis.id}`}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-accent transition-colors"
                    >
                      <div
                        className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0",
                          analysis.level === "Critical"
                            ? "bg-error text-error-foreground"
                            : analysis.level === "High"
                              ? "bg-warning text-warning-foreground"
                              : analysis.level === "Moderate"
                                ? "bg-info text-info-foreground"
                                : "bg-success text-success-foreground"
                        )}
                      >
                        {levelInitials(analysis.patientName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-sm font-medium text-foreground truncate">
                            {analysis.patientName}
                          </span>
                          <span className="text-[10px] text-muted-foreground ml-2 shrink-0">
                            {formatCreated(analysis.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          Risk: {analysis.overall.toFixed(0)}%
                        </p>
                        <Badge
                          variant={levelVariant(analysis.level)}
                          className="mt-1.5"
                        >
                          {analysis.level}
                        </Badge>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              <Link
                href="/ai-cds"
                className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 mt-4 mx-auto transition-colors"
              >
                View All
                <ChevronRight className="w-3 h-3" />
              </Link>
            </Card>
          </div>
        </div>

        {/* ---- Monitoring Trends ---- */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Aggregated Patient Monitoring Trends</CardTitle>
              <CardDescription>
                Risk scores and recovery rates across all monitored patients
              </CardDescription>
            </div>
            <Badge variant="outline">Last 6 Months</Badge>
          </CardHeader>

          <RiskTrendChart data={trendData} />
        </Card>

        {/* ---- Footer ---- */}
        <div className="text-center text-[11px] text-muted-foreground py-2">
          AI Clinical Decision Support System • Last updated: 2 minutes ago •
          Model: PanaceaAI v3.2
        </div>
      </div>
    </>
  );
}
