import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Header } from "@/components/layout/Header";
import { Card, Badge, Button } from "@/components/ui";
import { AddAppointmentModal } from "@/components/modals/AddAppointmentModal";
import { AppointmentsToolbar } from "./AppointmentsToolbar";
import { requireRole } from "@/lib/auth";
import { listAppointments } from "@/lib/appointments";
import { pageWindow } from "@/lib/pagination";
import { cn } from "@/lib/utils";
import type { AppointmentStatus } from "@/types";
import {
  Filter,
  Clock,
  CalendarDays,
  Video,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  AlertCircle,
} from "lucide-react";

const PAGE_SIZE = 20;

function statusVariant(
  status: AppointmentStatus
): "success" | "error" | "warning" | "info" | "outline" {
  switch (status) {
    case "Confirmed":
      return "success";
    case "Completed":
      return "success";
    case "Pending":
      return "info";
    case "Cancelled":
      return "error";
    default:
      return "outline";
  }
}

function formatTime(iso: string): string {
  try {
    return format(parseISO(iso), "h:mm a");
  } catch {
    return "—";
  }
}

function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), "MMM dd, yyyy");
  } catch {
    return "—";
  }
}

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    mode?: string;
    page?: string;
  }>;
}) {
  await requireRole(["clinician", "admin"]);

  const { search = "", status = "", mode = "", page: pageParam } =
    await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const result = await listAppointments({
    search: search || undefined,
    status: status || undefined,
    mode: mode || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  function pageHref(target: number): string {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (mode) params.set("mode", mode);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return qs ? `/appointments?${qs}` : "/appointments";
  }

  const appointments = result.success ? result.data.items : [];
  const total = result.success ? result.data.total : 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="flex flex-col">
      <Header breadcrumbs={[{ label: "Appointments Management" }]} />

      <div className="p-6 space-y-6">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-mono text-foreground">
              Appointments Management
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              View and manage all scheduled appointments
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <AddAppointmentModal />
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono">
                {total.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Total Appointments</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success flex items-center justify-center">
              <Clock className="w-5 h-5 text-success-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono">—</p>
              <p className="text-xs text-muted-foreground">Confirmed</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning flex items-center justify-center">
              <Clock className="w-5 h-5 text-warning-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono">—</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-error flex items-center justify-center">
              <Clock className="w-5 h-5 text-error-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono">—</p>
              <p className="text-xs text-muted-foreground">Cancelled</p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <AppointmentsToolbar search={search} status={status} mode={mode} />

        {/* Appointments Table */}
        <Card className="p-0 overflow-hidden">
          {!result.success ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
              <p className="text-sm text-muted-foreground">
                We couldn&apos;t load appointments right now. Please refresh to
                try again.
              </p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                {search || status || mode
                  ? "No appointments match your search."
                  : "No appointments scheduled yet."}
              </p>
              <AddAppointmentModal />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-accent/30">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Time
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Patient
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Department
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Doctor
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Mode
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((apt) => (
                    <tr
                      key={apt.id}
                      className="border-b border-border/50 last:border-0 hover:bg-accent/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="font-mono text-xs font-medium">
                            {formatTime(apt.startsAt)}
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground ml-5.5">
                          {apt.durationMinutes} min
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-foreground">
                          {apt.patientName}
                        </span>
                        <p className="text-[10px] text-muted-foreground">
                          ID: {apt.patientId}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {apt.type}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {apt.department}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {apt.doctor}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-xs">
                          {apt.mode === "Virtual" && (
                            <Video className="w-3 h-3 text-info-foreground" />
                          )}
                          <span
                            className={
                              apt.mode === "Virtual"
                                ? "text-info-foreground"
                                : "text-muted-foreground"
                            }
                          >
                            {apt.mode}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusVariant(apt.status)}>
                          {apt.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-lg hover:bg-accent transition-colors">
                            <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Showing {rangeStart}-{rangeEnd} of {total.toLocaleString()}{" "}
                  appointments
                </p>
                <div className="flex items-center gap-1">
                  <Link
                    href={pageHref(Math.max(1, page - 1))}
                    aria-disabled={page <= 1}
                    className={cn(
                      "p-1.5 rounded-lg hover:bg-accent transition-colors",
                      page <= 1 && "pointer-events-none opacity-40"
                    )}
                  >
                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                  </Link>
                  {pageWindow(page, totalPages).map((p, i) =>
                    p === "..." ? (
                      <span
                        key={`gap-${i}`}
                        className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground"
                      >
                        …
                      </span>
                    ) : (
                      <Link
                        key={p}
                        href={pageHref(p)}
                        className={cn(
                          "w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors",
                          p === page
                            ? "bg-foreground text-background"
                            : "text-muted-foreground hover:bg-accent"
                        )}
                      >
                        {p}
                      </Link>
                    )
                  )}
                  <Link
                    href={pageHref(Math.min(totalPages, page + 1))}
                    aria-disabled={page >= totalPages}
                    className={cn(
                      "p-1.5 rounded-lg hover:bg-accent transition-colors",
                      page >= totalPages && "pointer-events-none opacity-40"
                    )}
                  >
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
