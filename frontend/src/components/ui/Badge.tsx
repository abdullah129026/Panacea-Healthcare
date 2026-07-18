import { cn } from "@/lib/utils";
import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium",
        {
          "bg-primary/10 text-primary": variant === "default",
          "bg-success text-success-foreground": variant === "success",
          "bg-warning text-warning-foreground": variant === "warning",
          "bg-error text-error-foreground": variant === "error",
          "bg-info text-info-foreground": variant === "info",
          "border border-border text-muted-foreground": variant === "outline",
        },
        className
      )}
      {...props}
    />
  );
}
