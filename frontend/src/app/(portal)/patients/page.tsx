import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Header } from "@/components/layout/Header";
import { Card, Badge, Button } from "@/components/ui";
import { NewPatientModal } from "@/components/modals/NewPatientModal";
import { PatientsToolbar } from "./PatientsToolbar";
import { requireRole } from "@/lib/auth";
import { listPatients } from "@/lib/patients";
import { pageWindow } from "@/lib/pagination";
import { cn } from "@/lib/utils";
import type { Patient, PatientStatus } from "@/types";
import {
  Filter,
  MoreHorizontal,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Users,
  UserPlus,
  Activity,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";

const PAGE_SIZE = 20;

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
    case "Discharged":
      return "outline";
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

function formatVisit(value: Patient["lastVisit"]): string {
  if (!value) return "—";
  try {
    return format(parseISO(value), "MMM dd, yyyy");
  } catch {
    return "—";
  }
}

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  await requireRole(["clinician", "admin"]);

  const { search = "", status = "", page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const result = await listPatients({
    search: search || undefined,
    status: status || undefined,
    page,
    pageSize: PAGE_SIZE,
  });

  function pageHref(target: number): string {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status) params.set("status", status);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return qs ? `/patients?${qs}` : "/patients";
  }

  const patients = result.success ? result.data.items : [];
  const total = result.success ? result.data.total : 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="flex flex-col">
      <Header breadcrumbs={[{ label: "Patient Directory" }]} />

      <div className="p-6 space-y-6">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold font-mono text-foreground">
              Patient Directory
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and view all registered patient records
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <NewPatientModal />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono">
                {total.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Total Patients</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success flex items-center justify-center">
              <Activity className="w-5 h-5 text-success-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono">348</p>
              <p className="text-xs text-muted-foreground">Active Cases</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-warning flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-warning-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono">24</p>
              <p className="text-xs text-muted-foreground">New This Week</p>
            </div>
          </div>
          <div className="bg-card rounded-2xl border border-border p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-error flex items-center justify-center">
              <Activity className="w-5 h-5 text-error-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold font-mono">12</p>
              <p className="text-xs text-muted-foreground">Critical Cases</p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <PatientsToolbar search={search} status={status} />

        {/* Patients Table */}
        <Card className="p-0 overflow-hidden">
          {!result.success ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
              <p className="text-sm text-muted-foreground">
                We couldn&apos;t load patients right now. Please refresh to try
                again.
              </p>
            </div>
          ) : patients.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                {search || status
                  ? "No patients match your search."
                  : "No patients registered yet."}
              </p>
              <NewPatientModal />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-accent/30">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Patient Name
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Age / Gender
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Condition
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Department
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Last Visit
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr
                      key={patient.id}
                      className="border-b border-border/50 last:border-0 hover:bg-accent/30 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <Link
                          href={`/patients/${patient.id}`}
                          className="flex items-center gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                            {initials(patient)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {patient.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {patient.email}
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                        {patient.id}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {patient.age} / {patient.gender}
                      </td>
                      <td className="py-3 px-4 text-foreground text-xs">
                        {patient.condition}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-xs">
                        {patient.department}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusVariant(patient.status)}>
                          {patient.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {formatVisit(patient.lastVisit)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <a
                            href={`tel:${patient.phone}`}
                            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                            aria-label={`Call ${patient.name}`}
                          >
                            <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                          </a>
                          <a
                            href={`mailto:${patient.email}`}
                            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                            aria-label={`Email ${patient.name}`}
                          >
                            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                          </a>
                          <Link
                            href={`/patients/${patient.id}`}
                            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                            aria-label={`Open ${patient.name}`}
                          >
                            <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
                          </Link>
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
                  patients
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
