"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      theme="light"
      closeButton
      expand
      visibleToasts={3}
      style={{
        "--sonner-text-color": "var(--foreground)",
        "--sonner-border-radius": "16px",
        "--sonner-background": "var(--card)",
        "--sonner-border": "1px solid var(--border)",
        "--sonner-success-border": "1px solid var(--color-success)",
        "--sonner-error-border": "1px solid var(--color-error)",
        "--sonner-info-border": "1px solid var(--color-info)",
        "--sonner-warning-border": "1px solid var(--color-warning)",
      } as React.CSSProperties}
    />
  );
}
