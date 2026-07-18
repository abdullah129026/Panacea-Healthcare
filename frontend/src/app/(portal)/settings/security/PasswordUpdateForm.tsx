"use client";

import { useActionState } from "react";
import { updatePassword } from "../actions";
import { Card, CardTitle, Button, Input } from "@/components/ui";
import type { FormState } from "@/lib/forms";

const initialState: FormState = {};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-[11px] text-destructive">{messages[0]}</p>;
}

export function PasswordUpdateForm() {
  const [state, formAction, pending] = useActionState(updatePassword, initialState);

  return (
    <Card className="space-y-4">
      {state.error && (
        <div className="bg-error/10 border border-error p-3 rounded-lg text-error text-sm">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="bg-success/10 border border-success p-3 rounded-lg text-success-foreground text-sm">
          {state.message || "Password updated successfully."}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <CardTitle>Update Password</CardTitle>

        <div>
          <Input
            label="Current Password"
            name="currentPassword"
            type="password"
            placeholder="••••••••"
            disabled={pending}
          />
          <FieldError messages={state.fieldErrors?.currentPassword} />
        </div>

        <div>
          <Input
            label="New Password"
            name="newPassword"
            type="password"
            placeholder="••••••••"
            disabled={pending}
            hint="Minimum 12 characters with uppercase, lowercase, number, and special character"
          />
          <FieldError messages={state.fieldErrors?.newPassword} />
        </div>

        <div>
          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            disabled={pending}
          />
          <FieldError messages={state.fieldErrors?.confirmPassword} />
        </div>

        <Button type="submit" variant="primary" size="sm" className="w-full" disabled={pending}>
          {pending ? "Updating..." : "Update Password"}
        </Button>
      </form>
    </Card>
  );
}
