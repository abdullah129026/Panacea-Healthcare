"use client";

import { useActionState, useState, useEffect } from "react";
import { Modal, Button, Input, Select } from "@/components/ui";
import { UserPlus } from "lucide-react";
import { createPatient } from "@/app/(portal)/patients/actions";
import { PATIENT_STATUSES } from "@/types";
import type { FormState } from "@/lib/forms";
import { showSuccess, showError } from "@/lib/toast";

const FORM_ID = "new-patient-form";
const initialState: FormState = {};

const genderOptions = [
  { value: "Female", label: "Female" },
  { value: "Male", label: "Male" },
  { value: "Other", label: "Other" },
];

const statusOptions = PATIENT_STATUSES.map((s) => ({ value: s, label: s }));

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-[11px] text-destructive">{messages[0]}</p>;
}

export function NewPatientModal() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createPatient,
    initialState
  );
  // Close + reset (via remount key) the first render after a successful submit,
  // using React's "adjust state while rendering" pattern — no effect needed.
  const [seenState, setSeenState] = useState(state);
  const [formKey, setFormKey] = useState(0);

  if (state !== seenState) {
    setSeenState(state);
    if (state.success) {
      showSuccess("Patient registered successfully");
      setOpen(false);
      setFormKey((k) => k + 1);
    } else if (state.error) {
      showError(state.error);
    }
  }

  return (
    <>
      <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
        <UserPlus className="w-4 h-4" /> Register Patient
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New Patient Registration"
        description="Create a new clinical record. All fields marked required must be completed."
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              type="submit"
              form={FORM_ID}
              disabled={pending}
            >
              {pending ? "Creating…" : "Create Record"}
            </Button>
          </>
        }
      >
        <form
          key={formKey}
          id={FORM_ID}
          action={formAction}
          className="space-y-4"
        >
          {state.error && (
            <p className="rounded-lg bg-error px-3 py-2 text-sm text-error-foreground">
              {state.error}
            </p>
          )}

          <Input label="Full Name" name="name" placeholder="Eleanor Vance" />
          <FieldError messages={state.fieldErrors?.name} />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Input label="Age" name="age" type="number" min={0} placeholder="58" />
              <FieldError messages={state.fieldErrors?.age} />
            </div>
            <div>
              <Select label="Gender" name="gender" options={genderOptions} />
              <FieldError messages={state.fieldErrors?.gender} />
            </div>
            <div>
              <Select
                label="Status"
                name="status"
                defaultValue="Active"
                options={statusOptions}
              />
              <FieldError messages={state.fieldErrors?.status} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input label="Phone" name="phone" placeholder="+1 (415) 555-0182" />
              <FieldError messages={state.fieldErrors?.phone} />
            </div>
            <div>
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="patient@email.com"
              />
              <FieldError messages={state.fieldErrors?.email} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Primary Condition"
                name="condition"
                placeholder="Cardiac Arrhythmia"
              />
              <FieldError messages={state.fieldErrors?.condition} />
            </div>
            <div>
              <Input
                label="Department"
                name="department"
                placeholder="Cardiology"
              />
              <FieldError messages={state.fieldErrors?.department} />
            </div>
          </div>

          <Input
            label="Attending Doctor"
            name="doctor"
            placeholder="Dr. Wilson"
          />
          <FieldError messages={state.fieldErrors?.doctor} />
        </form>
      </Modal>
    </>
  );
}
