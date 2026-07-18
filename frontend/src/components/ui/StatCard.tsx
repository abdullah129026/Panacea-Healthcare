import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon?: LucideIcon;
  iconColor?: string;
  subtitle?: string;
}

export function StatCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor = "text-primary",
  subtitle,
}: StatCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        {Icon && (
          <div
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center",
              iconColor === "text-primary" && "bg-primary/10",
              iconColor === "text-success-foreground" && "bg-success",
              iconColor === "text-warning-foreground" && "bg-warning",
              iconColor === "text-error-foreground" && "bg-error",
              iconColor === "text-info-foreground" && "bg-info"
            )}
          >
            <Icon className={cn("w-4 h-4", iconColor)} />
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold font-mono text-foreground">{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {change && (
        <div className="flex items-center gap-1">
          {changeType === "up" && (
            <TrendingUp className="w-3 h-3 text-success-foreground" />
          )}
          {changeType === "down" && (
            <TrendingDown className="w-3 h-3 text-error-foreground" />
          )}
          <span
            className={cn(
              "text-xs font-medium",
              changeType === "up" && "text-success-foreground",
              changeType === "down" && "text-error-foreground",
              changeType === "neutral" && "text-muted-foreground"
            )}
          >
            {change}
          </span>
        </div>
      )}
    </div>
  );
}
