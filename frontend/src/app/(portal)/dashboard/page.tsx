import { Header } from "@/components/layout/Header";
import { Card, CardHeader, CardTitle, Badge, Button } from "@/components/ui";
import {
  Users,
  CalendarDays,
  Bed,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";
import { DashboardCharts } from "./DashboardCharts";
import { requireRole } from "@/lib/auth";
import { getDashboard } from "@/lib/dashboard";
import { getCurrentUser } from "@/lib/auth";

function getStatusColor(
  status: string
): "success" | "error" | "warning" | "info" | "outline" {
  switch (status) {
    case "Critical":
      return "error";
    case "Stable":
    case "Recovering":
      return "success";
    case "Admitted":
      return "info";
    case "Observation":
      return "warning";
    default:
      return "outline";
  }
}

export default async function DashboardPage() {
  await requireRole(["clinician", "admin"]);
  const user = await getCurrentUser();
  const result = await getDashboard();

  const dashboard = result.success
    ? result.data
    : {
        metrics: {
          totalPatients: 0,
          totalPatientsChange: 0,
          todayAppointments: 0,
          todayAppointmentsRemaining: 0,
          activeAdmissions: 0,
          activeAdmissionsChange: 0,
          avgWaitTime: 0,
          avgWaitTimeChange: 0,
        },
        patientFlow: [],
        alerts: [],
        recentPatients: [],
        upcomingAppointments: [],
        departmentMetrics: [],
        userName: user?.name || "User",
      };

  const userName =
    user?.name?.split(" ")[0] || dashboard.userName.split(" ")[0] || "User";

  return (
    <div className="flex flex-col">
      <Header breadcrumbs={[{ label: "Dashboard" }]} />

      <div className="p-6 space-y-6">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-mono text-foreground">
              Welcome back, {userName}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Here&apos;s an overview of your clinical portal today.
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        {!result.success ? (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-destructive/10 text-destructive">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">
              We couldn&apos;t load the dashboard. Please refresh to try again.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold font-mono">
                    {dashboard.metrics.totalPatients.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Total Patients
                  </p>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-info-foreground" />
                </div>
                <div>
                  <p className="text-lg font-bold font-mono">
                    {dashboard.metrics.todayAppointments}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Today&apos;s Appointments
                  </p>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                  <Bed className="w-5 h-5 text-success-foreground" />
                </div>
                <div>
                  <p className="text-lg font-bold font-mono">
                    {dashboard.metrics.activeAdmissions}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Active Admissions
                  </p>
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning-foreground" />
                </div>
                <div>
                  <p className="text-lg font-bold font-mono">
                    {dashboard.metrics.avgWaitTime} min
                  </p>
                  <p className="text-xs text-muted-foreground">Avg Wait Time</p>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-3 gap-6">
              {/* Charts */}
              {dashboard.patientFlow.length > 0 ? (
                <DashboardCharts
                  patientFlow={dashboard.patientFlow}
                  departmentMetrics={dashboard.departmentMetrics}
                />
              ) : (
                <Card className="col-span-2 p-6 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-muted-foreground mr-2" />
                  <p className="text-sm text-muted-foreground">
                    No patient flow data available
                  </p>
                </Card>
              )}

              {/* Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning-foreground" />
                    Active Alerts
                  </CardTitle>
                  {dashboard.alerts.length > 0 && (
                    <Badge variant="error">{dashboard.alerts.length} New</Badge>
                  )}
                </CardHeader>
                {dashboard.alerts.length === 0 ? (
                  <p className="text-xs text-muted-foreground p-3">
                    No active alerts
                  </p>
                ) : (
                  <div className="space-y-3">
                    {dashboard.alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-3 rounded-xl text-xs ${
                          alert.type === "error"
                            ? "bg-error text-error-foreground"
                            : alert.type === "warning"
                              ? "bg-warning text-warning-foreground"
                              : "bg-info text-info-foreground"
                        }`}
                      >
                        <p className="font-medium">{alert.message}</p>
                        <p className="mt-1 opacity-70">{alert.time}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-3 gap-6">
              {/* Recent Patients */}
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Recent Patients</CardTitle>
                  <Button variant="ghost" size="sm">
                    View All <ArrowUpRight className="w-3 h-3" />
                  </Button>
                </CardHeader>
                {dashboard.recentPatients.length === 0 ? (
                  <p className="text-xs text-muted-foreground p-3">
                    No recent patients
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">
                            Patient
                          </th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">
                            ID
                          </th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">
                            Department
                          </th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">
                            Status
                          </th>
                          <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">
                            Time
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboard.recentPatients.map((patient) => (
                          <tr
                            key={patient.id}
                            className="border-b border-border/50 last:border-0 hover:bg-accent/50 transition-colors"
                          >
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">
                                  {patient.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <span className="font-medium text-foreground">
                                  {patient.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-3 text-muted-foreground font-mono text-xs">
                              {patient.id}
                            </td>
                            <td className="py-3 px-3 text-muted-foreground">
                              {patient.department}
                            </td>
                            <td className="py-3 px-3">
                              <Badge
                                variant={
                                  getStatusColor(
                                    patient.status
                                  ) as
                                    | "success"
                                    | "error"
                                    | "warning"
                                    | "info"
                                    | "outline"
                                }
                              >
                                {patient.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-3 text-muted-foreground text-xs">
                              {patient.time}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>

              {/* Upcoming Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Appointments</CardTitle>
                  <Button variant="ghost" size="sm">
                    See All <ArrowUpRight className="w-3 h-3" />
                  </Button>
                </CardHeader>
                {dashboard.upcomingAppointments.length === 0 ? (
                  <p className="text-xs text-muted-foreground p-3">
                    No upcoming appointments
                  </p>
                ) : (
                  <div className="space-y-3">
                    {dashboard.upcomingAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-accent/50 hover:bg-accent transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-semibold text-primary">
                            {apt.patient
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <p className="text-xs font-medium text-foreground">
                              {apt.patient}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {apt.type} · {apt.doctor}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">
                          {apt.time}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

          </>
        )}
      </div>
    </div>
  );
}
