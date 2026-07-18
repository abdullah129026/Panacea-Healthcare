import { Header } from "@/components/layout/Header";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
} from "@/components/ui";
import { ExportAnalyticsModal } from "@/components/modals/ExportAnalyticsModal";
import {
  Users,
  DollarSign,
  Clock,
  Star,
  Sparkles,
  AlertCircle,
  Eye,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import { getReport } from "@/lib/reports";
import { OutcomesViewer } from "./OutcomesViewer";

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatSatisfaction(score: number): string {
  return score.toFixed(2);
}

function getStatusVariant(
  status: string
): "success" | "warning" | "error" | "info" | "outline" {
  switch (status) {
    case "OPTIMAL":
      return "success";
    case "STABLE":
      return "info";
    case "ATTENTION":
      return "warning";
    case "CRITICAL":
      return "error";
    default:
      return "outline";
  }
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  await requireRole(["admin", "clinician"]);

  const { period = "Last 30 Days" } = await searchParams;
  const result = await getReport({ period });

  const report = result.success
    ? result.data
    : {
        metrics: {
          totalPatients: 0,
          totalRevenue: 0,
          averageStay: 0,
          satisfactionScore: 0,
          operationalEfficiency: 0,
          patientsChange: 0,
          revenueChange: 0,
          stayChange: 0,
          satisfactionChange: 0,
        },
        outcomes: [],
        performanceMetrics: [],
        departments: [],
      };

  return (
    <>
      <Header
        breadcrumbs={[
          { label: "Analytics", href: "#" },
          { label: "Reports & Analytics" },
        ]}
      />

      <div className="p-6 space-y-6">
        {/* Title Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold font-mono text-foreground">
              Clinical Intelligence
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Comprehensive real-time analysis of clinical performance and
              operational metrics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-foreground">
              {period}
            </span>
            <ExportAnalyticsModal />
          </div>
        </div>

        {/* Stat Cards */}
        {!result.success ? (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 text-destructive">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">
              We couldn&apos;t load reports right now. Please refresh to try again.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold font-mono">
                    {report.metrics.totalPatients.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Patients</p>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-success-foreground" />
                </div>
                <div>
                  <p className="text-lg font-bold font-mono">
                    {formatCurrency(report.metrics.totalRevenue)}
                  </p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-info-foreground" />
                </div>
                <div>
                  <p className="text-lg font-bold font-mono">
                    {Math.round(report.metrics.averageStay)}m
                  </p>
                  <p className="text-xs text-muted-foreground">Avg Stay</p>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-warning-foreground" />
                </div>
                <div>
                  <p className="text-lg font-bold font-mono">
                    {formatSatisfaction(report.metrics.satisfactionScore)}
                  </p>
                  <p className="text-xs text-muted-foreground">Satisfaction</p>
                </div>
              </div>
            </div>

            {/* Middle Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Clinical Outcomes Comparison */}
              <OutcomesViewer data={report.outcomes} />

              {/* AI Strategic Summary */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <CardTitle>AI Strategic Summary</CardTitle>
                  </div>
                </CardHeader>

                <div className="space-y-5">
                  {report.performanceMetrics.map((metric) => (
                    <div key={metric.label} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-foreground">
                          {metric.label}
                        </span>
                        <span className="text-sm font-mono font-semibold text-foreground">
                          {metric.value}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${metric.value}%`,
                            backgroundColor: metric.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-3 rounded-xl bg-accent">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Overall operational efficiency is at{" "}
                    <span className="font-semibold text-foreground">
                      {report.metrics.operationalEfficiency}%
                    </span>
                    , which is above the industry average. Focus areas: improve
                    patient throughput in outpatient departments.
                  </p>
                </div>

                <Button variant="outline" size="sm" className="w-full mt-4">
                  <Eye className="w-3.5 h-3.5" />
                  View Prediction Model
                </Button>
              </Card>
            </div>

            {/* Performance Matrix */}
            <Card>
              <CardHeader>
                <div>
                  <CardTitle className="text-base">
                    Operational Performance Matrix
                  </CardTitle>
                  <CardDescription>
                    Department-level performance indicators and revenue yield
                  </CardDescription>
                </div>
              </CardHeader>

              {report.departments.length === 0 ? (
                <div className="flex flex-col items-center gap-3 py-16 text-center p-6">
                  <AlertCircle className="w-6 h-6 text-destructive" />
                  <p className="text-sm text-muted-foreground">
                    No department data available for this period.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                          Department
                        </th>
                        <th className="text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                          Patient Throughput
                        </th>
                        <th className="text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                          Success Rate
                        </th>
                        <th className="text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                          Revenue Yield
                        </th>
                        <th className="text-left text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-4 py-3">
                          Status
                        </th>
                        <th className="text-right text-[11px] font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.departments.map((dept) => (
                        <tr
                          key={dept.name}
                          className="border-b border-border/50 hover:bg-accent/50 transition-colors"
                        >
                          <td className="px-6 py-3.5">
                            <span className="font-medium text-foreground">
                              {dept.name}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-mono text-foreground">
                              {dept.patients}
                            </span>
                            <span className="text-xs text-muted-foreground ml-1">
                              patients
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-mono text-foreground">
                              {dept.successRate}%
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-mono font-medium text-foreground">
                              {formatCurrency(dept.revenue)}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
                            <Badge
                              variant={
                                getStatusVariant(
                                  dept.status
                                ) as
                                  | "success"
                                  | "warning"
                                  | "error"
                                  | "info"
                                  | "outline"
                              }
                            >
                              {dept.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-3.5 h-3.5" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </>
  );
}
