"use client";

import { useActionState, useState } from "react";
import { Modal, Button, Input, Select } from "@/components/ui";
import { CalendarPlus } from "lucide-react";
import { createAppointment } from "@/app/(portal)/appointments/actions";
import type { FormState } from "@/lib/forms";

const FORM_ID = "add-appointment-form";
const initialState: FormState = {};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-[11px] text-destructive">{messages[0]}</p>;
}

export function AddAppointmentModal() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createAppointment,
    initialState
  );
  const [seenState, setSeenState] = useState(state);
  const [formKey, setFormKey] = useState(0);

  if (state !== seenState) {
    setSeenState(state);
    if (state.success) {
      setOpen(false);
      setFormKey((k) => k + 1);
    }
  }

  return (
    <>
      <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
        <CalendarPlus className="w-4 h-4" /> New Appointment
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add New Appointment"
        description="Schedule a new patient visit and assign a practitioner."
        size="md"
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              form={FORM_ID}
              type="submit"
              disabled={pending}
            >
              {pending ? "Scheduling..." : "Confirm Booking"}
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

          <div>
            <Input
              label="Patient ID"
              name="patientId"
              placeholder="Enter patient ID..."
              required
            />
            <FieldError messages={state.fieldErrors?.patientId} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select
                label="Department"
                name="department"
                options={[
                  { value: "Cardiology", label: "Cardiology" },
                  { value: "Neurology", label: "Neurology" },
                  { value: "Orthopedics", label: "Orthopedics" },
                  { value: "OB/GYN", label: "OB/GYN" },
                  { value: "Pediatrics", label: "Pediatrics" },
                ]}
                required
              />
              <FieldError messages={state.fieldErrors?.department} />
            </div>
            <div>
              <Select
                label="Practitioner"
                name="doctor"
                options={[
                  { value: "Dr. Sarah Jenkins", label: "Dr. Sarah Jenkins" },
                  { value: "Dr. Aria Thorne", label: "Dr. Aria Thorne" },
                  { value: "Dr. Wilson", label: "Dr. Wilson" },
                  { value: "Dr. Lee", label: "Dr. Lee" },
                ]}
                required
              />
              <FieldError messages={state.fieldErrors?.doctor} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Date & Time"
                name="startsAt"
                type="datetime-local"
                required
              />
              <FieldError messages={state.fieldErrors?.startsAt} />
            </div>
            <div>
              <Input
                label="Duration (minutes)"
                name="durationMinutes"
                type="number"
                min="5"
                max="480"
                placeholder="30"
                required
              />
              <FieldError messages={state.fieldErrors?.durationMinutes} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select
                label="Appointment Type"
                name="type"
                options={[
                  { value: "Initial Consultation", label: "Initial Consultation" },
                  { value: "Follow-up", label: "Follow-up Visit" },
                  { value: "Lab Work", label: "Laboratory / Diagnostics" },
                ]}
                required
              />
              <FieldError messages={state.fieldErrors?.type} />
            </div>
            <div>
              <Select
                label="Mode"
                name="mode"
                options={[
                  { value: "In-Person", label: "In-Person" },
                  { value: "Virtual", label: "Virtual" },
                ]}
                defaultValue="In-Person"
              />
              <FieldError messages={state.fieldErrors?.mode} />
            </div>
          </div>

          <Input type="hidden" name="status" value="Pending" />
        </form>
      </Modal>
    </>
  );
}
