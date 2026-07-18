"use client";

import { useActionState } from "react";
import { deactivateAccount } from "./actions";
import { Button, Input, Modal } from "@/components/ui";
import { AlertTriangle } from "lucide-react";
import type { FormState } from "@/lib/forms";

interface AccountDeactivationModalProps {
  open: boolean;
  onClose: () => void;
}

const initialState: FormState = {};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-[11px] text-destructive">{messages[0]}</p>;
}

export function AccountDeactivationModal({ open, onClose }: AccountDeactivationModalProps) {
  const [state, formAction, pending] = useActionState(deactivateAccount, initialState);

  const handleSubmit = async (formData: FormData) => {
    await formAction(formData);
    // After successful deactivation, the server will redirect to home page
    // No need to close modal here
  };

  return (
    <Modal open={open} onClose={onClose} size="md">
      <form action={handleSubmit} className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-error-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold font-mono text-foreground">Deactivate Account</h2>
            <p className="text-sm text-muted-foreground mt-1">
              This action cannot be undone. Your account and all associated data will be permanently
              deactivated.
            </p>
          </div>
        </div>

        {state.error && (
          <div className="bg-error/10 border border-error p-3 rounded-lg text-error text-sm">
            {state.error}
          </div>
        )}

        <div className="bg-warning/10 border border-warning p-3 rounded-lg space-y-2">
          <p className="text-sm font-medium text-warning-foreground">Before you go:</p>
          <ul className="text-xs text-warning-foreground space-y-1 ml-4 list-disc">
            <li>You will lose access to all your clinical data</li>
            <li>Your pending appointments will be cancelled</li>
            <li>You can reactivate your account by contacting administrator</li>
            <li>This will log you out immediately</li>
          </ul>
        </div>

        <div>
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password to confirm"
            disabled={pending}
            required
          />
          <FieldError messages={state.fieldErrors?.password} />
          <p className="text-[11px] text-muted-foreground mt-1">
            We need your password to confirm this action.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button
            type="submit"
            variant="destructive"
            size="sm"
            disabled={pending}
            className="flex-1"
          >
            {pending ? "Deactivating..." : "Deactivate Account"}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={pending}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
