import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, Badge } from "@/components/ui";
import {
  Stethoscope,
  Users,
  Bed,
  Clock,
  AlertCircle,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import {
  listProcedures,
  listStaff,
  listBedOccupancy,
  getOperationsMetrics,
} from "@/lib/clinicalOperations";
import {
  BedOccupancyChart,
  ProcedureDistributionChart,
} from "@/components/ClinicalOperationsCharts";

function getStatusVariant(
  status: string
): "success" | "warning" | "error" | "info" | "outline" {
  if (
    status === "In Progress" ||
    status === "In Surgery" ||
    status === "Scheduled"
  ) {
    return "warning";
  }
  if (status === "Complete" || status === "On Duty" || status === "Available") {
    return "success";
  }
  return "outline";
}

function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
}

export default async function ClinicalOperationsPage() {
  await requireRole(["admin", "clinician"]);

  const [
    proceduresResult,
    staffResult,
    bedOccupancyResult,
    metricsResult,
  ] = await Promise.all([
    listProcedures({ pageSize: 100 }),
    listStaff({ pageSize: 20 }),
    listBedOccupancy(),
    getOperationsMetrics(),
  ]);

  const procedures = proceduresResult.success ? proceduresResult.data.items : [];
  const staff = staffResult.success ? staffResult.data.items : [];
  const bedOccupancy = bedOccupancyResult.success ? bedOccupancyResult.data : [];
  const metrics = metricsResult.success
    ? metricsResult.data
    : {
        activeProcedures: 0,
        staffOnDuty: 0,
        bedOccupancyRate: 0,
        averageTurnaroundTime: "—",
        proceduresToday: 0,
        surgeries: 0,
        diagnostics: 0,
        consultations: 0,
        followUps: 0,
      };

  const procedureData = [
    { name: "Surgeries", value: metrics.surgeries, color: "#006c49" },
    { name: "Diagnostics", value: metrics.diagnostics, color: "#10B981" },
    { name: "Consultations", value: metrics.consultations, color: "#3B82F6" },
    { name: "Follow-ups", value: metrics.followUps, color: "#8B5CF6" },
  ];

  return (
    <div className="flex flex-col">
      <Header breadcrumbs={[{ label: "Clinical Operations" }]} />

      <div className="p-6 space-y-6">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-mono text-foreground">
              Clinical Operations
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Real-time overview of hospital operations and resource management
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono">
                {metrics.activeProcedures}
              </p>
              <p className="text-xs text-muted-foreground">
                Active Procedures
              </p>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-info-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono">
                {metrics.staffOnDuty}
              </p>
              <p className="text-xs text-muted-foreground">Staff On Duty</p>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <Bed className="w-5 h-5 text-warning-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono">
                {Math.round(metrics.bedOccupancyRate)}%
              </p>
              <p className="text-xs text-muted-foreground">
                Bed Occupancy Rate
              </p>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-success-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono">
                {metrics.averageTurnaroundTime}
              </p>
              <p className="text-xs text-muted-foreground">
                Avg Turnaround Time
              </p>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-6">
          {/* Bed Occupancy */}
          {bedOccupancyResult.success && bedOccupancy.length > 0 ? (
            <Card className="col-span-2">
              <CardHeader>
                <div>
                  <CardTitle>Bed Occupancy by Department</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    Current bed utilization across all departments
                  </p>
                </div>
                {bedOccupancy.some((b) => b.occupancyRate > 90) && (
                  <Badge variant="warning">
                    {bedOccupancy.filter((b) => b.occupancyRate > 90).length}{" "}
                    Near Capacity
                  </Badge>
                )}
              </CardHeader>
              <BedOccupancyChart data={bedOccupancy} />
            </Card>
          ) : (
            <Card className="col-span-2 p-6 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-muted-foreground mr-2" />
              <p className="text-sm text-muted-foreground">
                Unable to load bed occupancy data
              </p>
            </Card>
          )}

          {/* Procedures Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Procedures Today</CardTitle>
              <span className="text-lg font-bold font-mono">
                {metrics.proceduresToday}
              </span>
            </CardHeader>
            {procedureData.some((p) => p.value > 0) ? (
              <>
                <div className="h-[200px] flex items-center justify-center">
                  <ProcedureDistributionChart data={procedureData} />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {procedureData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-muted-foreground">{item.name}</span>
                      <span className="font-mono font-medium ml-auto">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-[200px] flex items-center justify-center text-xs text-muted-foreground">
                No procedures scheduled
              </div>
            )}
          </Card>
        </div>

        {/* Active Procedures Table */}
        <Card className="p-0 overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-sm font-semibold">
              Active Procedures & Operations
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Real-time tracking of ongoing clinical activities
            </p>
          </div>

          {!proceduresResult.success ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center p-6">
              <AlertCircle className="w-6 h-6 text-destructive" />
              <p className="text-sm text-muted-foreground">
                We couldn&apos;t load procedures right now. Please refresh to try
                again.
              </p>
            </div>
          ) : procedures.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Stethoscope className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                No active procedures at this time.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-accent/30">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Procedure
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Patient
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Doctor
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Room
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Duration
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {procedures.map((proc) => (
                    <tr
                      key={proc.id}
                      className="border-b border-border/50 last:border-0 hover:bg-accent/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                        {proc.id}
                      </td>
                      <td className="py-3 px-4 font-medium text-foreground">
                        {proc.procedure}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {proc.patient}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {proc.doctor}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs bg-accent px-2 py-1 rounded-md">
                          {proc.room}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                        {proc.duration}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            getStatusVariant(proc.status) as
                              | "success"
                              | "warning"
                              | "error"
                              | "info"
                              | "outline"
                          }
                        >
                          {proc.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Staff On Duty */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Staff On Duty</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Current shift personnel
              </p>
            </div>
          </CardHeader>

          {!staffResult.success ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center p-6">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <p className="text-sm text-muted-foreground">
                We couldn&apos;t load staff data right now. Please refresh to try
                again.
              </p>
            </div>
          ) : staff.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center p-6">
              <Users className="w-6 h-6 text-primary" />
              <p className="text-sm text-muted-foreground">
                No staff members on duty at this time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {staff.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-accent/40 hover:bg-accent transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {member.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {member.role} · {member.department}
                    </p>
                  </div>
                  <Badge
                    variant={
                      getStatusVariant(member.status) as
                        | "success"
                        | "warning"
                        | "error"
                        | "info"
                    }
                    className="text-[10px]"
                  >
                    {member.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

