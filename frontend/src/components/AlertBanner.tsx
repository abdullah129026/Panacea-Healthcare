"use client";

import { X, Clock } from "lucide-react";
import { useAlerts } from "@/hooks/useAlerts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { AlertSeverity } from "@/types/events";

interface AlertBannerProps {
  maxVisible?: number;
}

const severityConfig: Record<AlertSeverity, { bg: string; text: string; label: string }> = {
  critical: { bg: "bg-error/10", text: "text-error-foreground", label: "Critical" },
  high: { bg: "bg-warning/10", text: "text-warning-foreground", label: "High" },
  medium: { bg: "bg-info/10", text: "text-info-foreground", label: "Medium" },
  low: { bg: "bg-muted", text: "text-muted-foreground", label: "Low" },
};

export function AlertBanner({ maxVisible = 2 }: AlertBannerProps) {
  const { alerts, dismissAlert, snoozeAlert } = useAlerts({
    maxAlerts: 50,
  });

  const visibleAlerts = alerts.slice(0, maxVisible);

  if (visibleAlerts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-16 left-0 right-0 z-40 pointer-events-none">
      <div className="flex flex-col gap-2 p-4 mx-auto max-w-screen-2xl pointer-events-auto">
        {visibleAlerts.map((alert) => {
          const config = severityConfig[alert.severity];
          return (
            <div
              key={alert.id}
              className={cn(
                "flex items-start gap-3 p-4 rounded-2xl border border-border",
                config.bg,
                "animate-in slide-in-from-top-2 fade-in duration-300 transition-all"
              )}
            >
              {/* Badge */}
              <Badge
                variant={alert.severity === "critical" ? "error" : alert.severity === "high" ? "warning" : "info"}
                className="mt-0.5 shrink-0"
              >
                {config.label}
              </Badge>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className={cn("font-semibold text-sm", config.text)}>{alert.title}</h3>
                <p className={cn("text-xs mt-1", config.text, "opacity-90")}>{alert.message}</p>
                {alert.patientName && (
                  <p className={cn("text-xs mt-1", config.text, "opacity-75")}>
                    Patient: {alert.patientName}
                  </p>
                )}
              </div>

              {/* Action button (if URL provided) */}
              {alert.actionUrl && (
                <a
                  href={alert.actionUrl}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium shrink-0",
                    "bg-card border border-border hover:bg-accent transition-colors"
                  )}
                >
                  View
                </a>
              )}

              {/* Snooze dropdown */}
              <div className="flex items-center gap-1 shrink-0">
                <div className="group relative">
                  <button
                    className={cn(
                      "p-1 rounded-lg hover:bg-card transition-colors",
                      config.text
                    )}
                    title="Snooze alert"
                  >
                    <Clock className="w-4 h-4" />
                  </button>
                  {/* Dropdown menu */}
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

                {/* Dismiss button */}
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className={cn("p-1 rounded-lg hover:bg-card transition-colors", config.text)}
                  title="Dismiss alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
