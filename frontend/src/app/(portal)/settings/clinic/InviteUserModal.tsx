"use client";

import React, { useActionState, useEffect } from "react";
import { inviteClinicUser } from "../actions";
import { Button, Input, Select, Modal } from "@/components/ui";
import { Mail } from "lucide-react";
import type { FormState } from "@/lib/forms";

interface InviteUserModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const roleOptions = [
  { value: "clinician", label: "Clinician" },
  { value: "admin", label: "Admin" },
  { value: "support", label: "Support" },
  { value: "billing", label: "Billing" },
];

const initialState: FormState = {};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-[11px] text-destructive">{messages[0]}</p>;
}

export function InviteUserModal({ open, onClose, onSuccess }: InviteUserModalProps) {
  const [state, formAction, pending] = useActionState(inviteClinicUser, initialState);

  const handleClose = () => {
    // Reset state and close modal
    onClose();
  };

  // Auto-close modal on success
  React.useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        handleClose();
        onSuccess?.();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [state.success, onClose, onSuccess]);

  return (
    <Modal open={open} onClose={handleClose} size="md">
      <form id="invite-form" action={formAction} className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold font-mono text-foreground">Invite Team Member</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Send an invitation to join your clinic. They'll receive an email with a registration link.
            </p>
          </div>
        </div>

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
            label="Email Address"
            name="email"
            type="email"
            placeholder="colleague@hospital.com"
            disabled={pending}
            required
            autoFocus
          />
          <FieldError messages={state.fieldErrors?.email} />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Role</label>
          <select
            name="role"
            disabled={pending}
            required
            defaultValue="clinician"
            className="w-full h-10 rounded-xl border border-input bg-card px-3 text-sm"
          >
            {roleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <FieldError messages={state.fieldErrors?.role} />
          <p className="text-[11px] text-muted-foreground mt-1">
            Select the role this person will have in the clinic.
          </p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button type="submit" variant="primary" size="sm" disabled={pending} className="flex-1">
            {pending ? "Sending..." : "Send Invite"}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleClose} disabled={pending}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
