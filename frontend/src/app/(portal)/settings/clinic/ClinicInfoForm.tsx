"use client";

import { useActionState } from "react";
import { updateClinicInfo } from "../actions";
import { Card, CardTitle, Button, Input } from "@/components/ui";
import { Building2, Phone } from "lucide-react";
import type { ClinicInfo } from "@/types";
import type { FormState } from "@/lib/forms";

interface ClinicInfoFormProps {
  clinic: ClinicInfo;
}

const initialState: FormState = {};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-[11px] text-destructive">{messages[0]}</p>;
}

export function ClinicInfoForm({ clinic }: ClinicInfoFormProps) {
  const [state, formAction, pending] = useActionState(updateClinicInfo, initialState);

  return (
    <>
      {state.error && (
        <div className="bg-error/10 border border-error p-4 rounded-xl text-error text-sm">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="bg-success/10 border border-success p-4 rounded-xl text-success-foreground text-sm">
          {state.message || "Clinic information updated successfully."}
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <Card className="space-y-4">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary" /> Basic Identification
            </CardTitle>

            <div>
              <Input
                label="Clinic Name"
                name="name"
                defaultValue={clinic.name}
                placeholder="Hospital or clinic legal name"
                disabled={pending}
              />
              <FieldError messages={state.fieldErrors?.name} />
            </div>

            <div>
              <Input
                label="Internal Facility ID"
                name="facilityId"
                defaultValue={clinic.facilityId}
                placeholder="e.g., PAN-BAY-441029"
                disabled={pending}
              />
              <FieldError messages={state.fieldErrors?.facilityId} />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1.5">Registered Address</label>
              <textarea
                name="address"
                className="w-full min-h-[72px] rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                defaultValue={clinic.address}
                placeholder="Street, city, state, postal code, country"
                disabled={pending}
              />
              <FieldError messages={state.fieldErrors?.address} />
            </div>
          </Card>

          <Card className="space-y-4">
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" /> Contact Channels
            </CardTitle>

            <div>
              <Input
                label="Primary Phone"
                name="phone"
                type="tel"
                defaultValue={clinic.phone}
                placeholder="+1 (555) 123-4567"
                disabled={pending}
              />
              <FieldError messages={state.fieldErrors?.phone} />
            </div>

            <div>
              <Input
                label="Emergency Line"
                name="emergencyLine"
                type="tel"
                defaultValue={clinic.emergencyLine}
                placeholder="+1 (555) 123-4568"
                disabled={pending}
              />
              <FieldError messages={state.fieldErrors?.emergencyLine} />
            </div>

            <div>
              <Input
                label="Admin Email"
                name="adminEmail"
                type="email"
                defaultValue={clinic.adminEmail}
                placeholder="admin@clinic.com"
                disabled={pending}
              />
              <FieldError messages={state.fieldErrors?.adminEmail} />
            </div>
          </Card>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button type="reset" variant="ghost" size="sm" disabled={pending}>
            Discard Changes
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={pending}>
            {pending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </>
  );
}
