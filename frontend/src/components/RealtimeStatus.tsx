"use client";

import { useRealtime } from "@/components/providers/RealtimeProvider";
import { WifiOff, Wifi, AlertCircle, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface RealtimeStatusProps {
  className?: string;
  showLabel?: boolean;
  position?: "fixed" | "inline";
}

/**
 * Connection status indicator component.
 * Shows visual feedback on real-time event connection state.
 *
 * States:
 * - connecting: spinner (yellow)
 * - connected: green dot
 * - disconnected: gray dot
 * - error: red exclamation
 */
export function RealtimeStatus({
  className,
  showLabel = true,
  position = "inline",
}: RealtimeStatusProps) {
  const { status, error } = useRealtime();

  const isFixed = position === "fixed";
  const baseClasses = cn(
    "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all",
    isFixed && "fixed bottom-4 right-4 shadow-lg z-50",
    className
  );

  const statusConfig = {
    connecting: {
      icon: Loader,
      label: "Connecting...",
      color: "bg-warning/20 text-warning-foreground border border-warning",
      dotColor: "text-warning",
    },
    connected: {
      icon: Wifi,
      label: "Live",
      color: "bg-success/20 text-success-foreground border border-success",
      dotColor: "text-success",
    },
    disconnected: {
      icon: WifiOff,
      label: "Offline",
      color: "bg-muted text-muted-foreground border border-border",
      dotColor: "text-muted-foreground",
    },
    error: {
      icon: AlertCircle,
      label: "Connection Error",
      color: "bg-error/20 text-error-foreground border border-error",
      dotColor: "text-error",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn(baseClasses, config.color)}>
      {status === "connecting" ? (
        <Icon className="w-4 h-4 animate-spin" />
      ) : (
        <Icon className={cn("w-4 h-4", config.dotColor)} />
      )}
      {showLabel && (
        <span>
          {config.label}
          {error && status === "error" && (
            <span className="ml-1 text-[10px]" title={error}>
              ({error})
            </span>
          )}
        </span>
      )}
    </div>
  );
}

/**
 * Compact version (icon only) for header/sidebar.
 */
export function RealtimeStatusDot({
  className,
  tooltipPosition = "top",
}: {
  className?: string;
  tooltipPosition?: "top" | "bottom";
}) {
  const { status } = useRealtime();

  const dotConfig = {
    connecting: "animate-pulse bg-warning",
    connected: "bg-success",
    disconnected: "bg-muted-foreground",
    error: "bg-error",
  };

  const tooltipConfig = {
    connecting: "Connecting...",
    connected: "Live",
    disconnected: "Offline",
    error: "Connection error",
  };

  return (
    <div
      className={cn(
        "relative group",
        className
      )}
      title={tooltipConfig[status]}
    >
      <div
        className={cn(
          "w-2 h-2 rounded-full",
          dotConfig[status]
        )}
      />
      {/* Tooltip */}
      <div
        className={cn(
          "absolute hidden group-hover:block z-50 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap",
          tooltipPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"
        )}
      >
        {tooltipConfig[status]}
      </div>
    </div>
  );
}
