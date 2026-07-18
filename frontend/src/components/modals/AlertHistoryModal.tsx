"use client";

import { useState, useMemo } from "react";
import { X, Clock, Trash2, ExternalLink } from "lucide-react";
import { useAlerts } from "@/hooks/useAlerts";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { AlertSeverity } from "@/types/events";
import { format, parseISO } from "date-fns";

interface AlertHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type AlertStatus = "active" | "dismissed" | "snoozed";

const severityConfig: Record<AlertSeverity, { variant: "error" | "warning" | "info" | "success"; label: string }> = {
  critical: { variant: "error", label: "Critical" },
  high: { variant: "warning", label: "High" },
  medium: { variant: "info", label: "Medium" },
  low: { variant: "success", label: "Low" },
};

export function AlertHistoryModal({ open, onOpenChange }: AlertHistoryModalProps) {
  const { allAlerts, dismissAlert, snoozeAlert, clearAlerts } = useAlerts({
    maxAlerts: 100,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | "all">("all");
  const [statusFilter, setStatusFilter] = useState<AlertStatus | "all">("all");
  const [snoozeDuration, setSnoozeDuration] = useState(5);

  // Determine status of each alert
  const getAlertStatus = (alert: any): AlertStatus => {
    if (alert.dismissedAt) return "dismissed";
    if (alert.snoozedUntil && new Date(alert.snoozedUntil) > new Date()) return "snoozed";
    return "active";
  };

  // Filter and sort
  const filteredAlerts = useMemo(() => {
    let result = allAlerts;

    // Text search
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(lower) ||
          a.message.toLowerCase().includes(lower) ||
          (a.patientName?.toLowerCase().includes(lower) ?? false)
      );
    }

    // Severity filter
    if (severityFilter !== "all") {
      result = result.filter((a) => a.severity === severityFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter((a) => getAlertStatus(a) === statusFilter);
    }

    // Sort: newest first
    return result.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [allAlerts, searchTerm, severityFilter, statusFilter]);

  const handleSnooze = (alertId: string) => {
    snoozeAlert(alertId, snoozeDuration);
  };

  return (
    <Modal
      open={open}
      onClose={() => onOpenChange(false)}
      size="md"
      title="Alert History"
      description={`${filteredAlerts.length} alert${filteredAlerts.length !== 1 ? "s" : ""}`}
    >
      {/* Filters */}
      <div className="px-6 py-4 border-b border-border flex flex-col gap-3">
        <div className="flex gap-2">
          <Input
            placeholder="Search by title, message, or patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>

        <div className="flex gap-2">
          <Select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as AlertSeverity | "all")}
            options={[
              { value: "all", label: "All Severities" },
              { value: "critical", label: "Critical" },
              { value: "high", label: "High" },
              { value: "medium", label: "Medium" },
              { value: "low", label: "Low" },
            ]}
          />

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AlertStatus | "all")}
            options={[
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "dismissed", label: "Dismissed" },
              { value: "snoozed", label: "Snoozed" },
            ]}
          />
        </div>
      </div>

      {/* Alert List */}
      <div className="max-h-[50vh] overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-8 text-muted-foreground">
            <p className="text-sm">No alerts found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredAlerts.map((alert) => {
              const status = getAlertStatus(alert);
              const config = severityConfig[alert.severity];

              return (
                <div key={alert.id} className="p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start gap-3">
                    {/* Severity badge */}
                    <Badge variant={config.variant} className="mt-0.5 shrink-0">
                      {config.label}
                    </Badge>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-foreground">{alert.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{alert.message}</p>

                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        {alert.patientName && <span>Patient: {alert.patientName}</span>}
                        <span>{format(parseISO(alert.timestamp), "MMM d, HH:mm")}</span>
                        {status === "dismissed" && <Badge variant="outline">Dismissed</Badge>}
                        {status === "snoozed" && (
                          <Badge variant="outline">
                            Snoozed until {format(parseISO(alert.snoozedUntil!), "HH:mm")}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-1 shrink-0">
                      {/* View link */}
                      {alert.actionUrl && (
                        <a
                          href={alert.actionUrl}
                          className={cn(
                            "p-1.5 rounded-lg hover:bg-card transition-colors",
                            "text-muted-foreground hover:text-foreground"
                          )}
                          title="View details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}

                      {/* Snooze dropdown */}
                      {status === "active" && (
                        <div className="group relative">
                          <button
                            className={cn(
                              "p-1.5 rounded-lg hover:bg-card transition-colors",
                              "text-muted-foreground hover:text-foreground"
                            )}
                            title="Snooze alert"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                          <div className="absolute right-0 top-full mt-1 hidden group-hover:block z-50 bg-card border border-border rounded-lg shadow-lg">
                            {[5, 15, 60].map((mins) => (
                              <button
                                key={mins}
                                onClick={() => snoozeAlert(alert.id, mins)}
                                className="block w-full px-3 py-2 text-xs text-left hover:bg-accent transition-colors first:rounded-t-lg last:rounded-b-lg"
                              >
                                Snooze {mins}m
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Dismiss button */}
                      {status === "active" && (
                        <button
                          onClick={() => dismissAlert(alert.id)}
                          className={cn(
                            "p-1.5 rounded-lg hover:bg-card transition-colors",
                            "text-muted-foreground hover:text-foreground"
                          )}
                          title="Dismiss alert"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer: Clear all button */}
      {allAlerts.length > 0 && (
        <div className="px-6 py-4 border-t border-border flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => clearAlerts()}
            className="text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="ml-auto"
          >
            Close
          </Button>
        </div>
      )}
    </Modal>
  );
}
