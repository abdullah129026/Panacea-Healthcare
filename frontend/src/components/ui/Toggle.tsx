"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface ToggleProps {
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
}

export function Toggle({
  defaultChecked = false,
  checked: controlled,
  onChange,
  label,
  description,
}: ToggleProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const checked = controlled ?? internal;

  const toggle = () => {
    const next = !checked;
    if (controlled === undefined) setInternal(next);
    onChange?.(next);
  };

  const control = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={toggle}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
        checked ? "bg-primary" : "bg-input"
      )}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-[22px]" : "translate-x-0.5"
        )}
      />
    </button>
  );

  if (!label && !description) return control;

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        {label && <p className="text-sm font-medium text-foreground">{label}</p>}
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {control}
    </div>
  );
}
