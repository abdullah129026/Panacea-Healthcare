"use client";

import { useActionState, useState, useEffect } from "react";
import { enable2FA, confirmTwoFactor, disableTwoFactor } from "./actions";
import { Card, CardTitle, Button, Input, Modal } from "@/components/ui";
import { Copy, Check } from "lucide-react";
import type { FormState } from "@/lib/forms";

interface TwoFactorSetupModalProps {
  open: boolean;
  onClose: () => void;
  currentMethod?: "authenticator" | "sms";
  onSuccess?: () => void;
}

const initialState: FormState = {};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-[11px] text-destructive">{messages[0]}</p>;
}

export function TwoFactorSetupModal({
  open,
  onClose,
  currentMethod,
  onSuccess,
}: TwoFactorSetupModalProps) {
  const [step, setStep] = useState<"method" | "authenticator" | "sms" | "verify">("method");
  const [setupData, setSetupData] = useState<{ qrCode?: string; phoneNumber?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const [enableState, enableFormAction, enablePending] = useActionState(enable2FA, initialState);
  const [confirmState, confirmFormAction, confirmPending] = useActionState(
    confirmTwoFactor,
    initialState
  );

  const handleMethodSelect = (method: "authenticator" | "sms") => {
    const formData = new FormData();
    formData.append("method", method);
    enableFormAction(formData);
  };

  const handleCopySecret = () => {
    if (setupData?.qrCode) {
      navigator.clipboard.writeText(setupData.qrCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleConfirm = (code: string) => {
    const formData = new FormData();
    formData.append("code", code);
    confirmFormAction(formData);
  };

  // Auto-advance to QR display when 2FA is enabled
  useEffect(() => {
    if (enableState.success && enableState.data) {
      setSetupData(enableState.data as { qrCode?: string; phoneNumber?: string });
      setStep("authenticator");
    }
  }, [enableState.success, enableState.data]);

  // Auto-close on successful confirmation
  useEffect(() => {
    if (confirmState.success) {
      setTimeout(() => {
        onSuccess?.();
        onClose();
        setStep("method");
        setSetupData(null);
      }, 500);
    }
  }, [confirmState.success, onClose, onSuccess]);

  return (
    <Modal open={open} onClose={onClose} size="md">
      {step === "method" && (
        <div className="space-y-4">
          <CardTitle>Set Up Two-Factor Authentication</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose how you'd like to secure your account with an additional authentication method.
          </p>

          {currentMethod && (
            <div className="bg-info/10 border border-info p-3 rounded-lg text-sm text-info">
              Current method: {currentMethod === "authenticator" ? "Authenticator App" : "SMS"}
            </div>
          )}

          <div className="space-y-2">
            <button
              onClick={() => handleMethodSelect("authenticator")}
              disabled={enablePending}
              className="w-full flex items-start gap-3 p-4 rounded-xl border border-border hover:border-primary/40 transition-colors text-left"
            >
              <div className="flex-1">
                <p className="font-medium text-foreground">Authenticator App</p>
                <p className="text-xs text-muted-foreground">
                  Use an app like Google Authenticator or Authy for secure codes
                </p>
              </div>
            </button>

            <button
              onClick={() => handleMethodSelect("sms")}
              disabled={enablePending}
              className="w-full flex items-start gap-3 p-4 rounded-xl border border-border hover:border-primary/40 transition-colors text-left"
            >
              <div className="flex-1">
                <p className="font-medium text-foreground">SMS Verification</p>
                <p className="text-xs text-muted-foreground">
                  Receive a code via text message to your phone
                </p>
              </div>
            </button>
          </div>

          {enableState.error && (
            <div className="bg-error/10 border border-error p-3 rounded-lg text-error text-sm">
              {enableState.error}
            </div>
          )}

          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      )}

      {step === "authenticator" && setupData?.qrCode && (
        <div className="space-y-4">
          <CardTitle>Scan QR Code</CardTitle>
          <p className="text-sm text-muted-foreground">
            Use an authenticator app to scan this QR code, or enter the setup key manually.
          </p>

          <div className="bg-muted p-4 rounded-xl flex items-center justify-center h-48">
            {/* QR Code would be rendered here as an image */}
            <p className="text-xs text-muted-foreground">[QR Code Image]</p>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground block mb-2">Setup Key</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={setupData.qrCode}
                className="flex-1 h-10 rounded-xl border border-input bg-card px-3 text-sm font-mono"
              />
              <button
                onClick={handleCopySecret}
                className="h-10 w-10 rounded-xl border border-border bg-card hover:bg-accent flex items-center justify-center"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-success-foreground" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Save this key in a secure location. You'll need it if you lose access to your
            authenticator app.
          </p>

          <Button
            type="button"
            variant="primary"
            size="sm"
            className="w-full"
            onClick={() => setStep("verify")}
          >
            I've Scanned the Code
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      )}

      {step === "verify" && (
        <VerifyCodeForm
          onSubmit={handleConfirm}
          pending={confirmPending}
          state={confirmState}
          onCancel={onClose}
        />
      )}
    </Modal>
  );
}

function VerifyCodeForm({
  onSubmit,
  pending,
  state,
  onCancel,
}: {
  onSubmit: (code: string) => void;
  pending: boolean;
  state: FormState;
  onCancel: () => void;
}) {
  const [code, setCode] = useState("");

  return (
    <div className="space-y-4">
      <CardTitle>Enter Verification Code</CardTitle>
      <p className="text-sm text-muted-foreground">
        Enter the 6-digit code from your authenticator app.
      </p>

      {state.error && (
        <div className="bg-error/10 border border-error p-3 rounded-lg text-error text-sm">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="bg-success/10 border border-success p-3 rounded-lg text-success-foreground text-sm">
          {state.message}
        </div>
      )}

      <div>
        <Input
          label="Verification Code"
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          disabled={pending}
        />
        <FieldError messages={state.fieldErrors?.code} />
      </div>

      <Button
        type="button"
        variant="primary"
        size="sm"
        className="w-full"
        disabled={pending || code.length !== 6}
        onClick={() => onSubmit(code)}
      >
        {pending ? "Verifying..." : "Verify & Enable"}
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={pending}>
        Cancel
      </Button>
    </div>
  );
}
