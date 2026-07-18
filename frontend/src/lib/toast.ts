import { toast } from "sonner";

export type ToastType = "success" | "error" | "info" | "loading";

export interface ToastOptions {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function showToast(
  message: string,
  type: ToastType = "info",
  options?: ToastOptions
): string | number {
  switch (type) {
    case "success":
      return toast.success(message, {
        duration: options?.duration ?? 3000,
        action: options?.action,
      });
    case "error":
      return toast.error(message, {
        duration: options?.duration ?? 4000,
        action: options?.action,
      });
    case "loading":
      return toast.loading(message, {
        duration: Infinity,
      });
    default:
      return toast.info(message, {
        duration: options?.duration ?? 3000,
        action: options?.action,
      });
  }
}

export function showSuccess(
  message: string,
  options?: ToastOptions
): string | number {
  return showToast(message, "success", options);
}

export function showError(
  message: string,
  options?: ToastOptions
): string | number {
  return showToast(message, "error", options);
}

export function showInfo(
  message: string,
  options?: ToastOptions
): string | number {
  return showToast(message, "info", options);
}

export function showLoading(message: string): string | number {
  return showToast(message, "loading");
}

export function dismissToast(toastId: string | number): void {
  toast.dismiss(toastId);
}

export function dismissAll(): void {
  toast.dismiss();
}
