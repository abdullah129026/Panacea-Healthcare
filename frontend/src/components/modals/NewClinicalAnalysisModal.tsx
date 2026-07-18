"use client";

import { useActionState, useState } from "react";
import { Modal, Button, Input, Textarea } from "@/components/ui";
import { Sparkles } from "lucide-react";
import { createAnalysis } from "@/app/(portal)/ai-cds/actions";
import type { FormState } from "@/lib/forms";

const FORM_ID = "new-analysis-form";
const initialState: FormState = {};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-[11px] text-destructive">{messages[0]}</p>;
}

export function NewClinicalAnalysisModal() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createAnalysis,
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
        <Sparkles className="w-4 h-4" /> New Analysis
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New Clinical Analysis"
        description="Run an AI-assisted decision support analysis on a patient record."
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
              <Sparkles className="w-4 h-4" />
              {pending ? "Running..." : "Run Analysis"}
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
              placeholder="Enter or search patient ID..."
              required
            />
            <FieldError messages={state.fieldErrors?.patientId} />
          </div>

          <div>
            <Textarea
              label="Presenting Symptoms"
              name="symptoms"
              placeholder="Describe the patient's symptoms and chief complaint..."
              required
            />
            <FieldError messages={state.fieldErrors?.symptoms} />
          </div>

          <div>
            <Textarea
              label="Recent Vitals"
              name="vitals"
              placeholder="BP, HR, RR, Temp, O2 sat, etc. (optional)"
            />
            <FieldError messages={state.fieldErrors?.vitals} />
          </div>

          <div>
            <Textarea
              label="Medical History"
              name="history"
              placeholder="Relevant past medical history, medications, allergies (optional)"
            />
            <FieldError messages={state.fieldErrors?.history} />
          </div>

          <div>
            <Textarea
              label="Clinical Notes"
              name="notes"
              placeholder="Additional notes or context (max 1000 chars)"
            />
            <FieldError messages={state.fieldErrors?.notes} />
          </div>

          <div className="p-3 rounded-xl bg-info/10 border border-info/20 text-xs text-muted-foreground">
            <p className="font-medium text-info-foreground mb-1">
              Panacea AI will process this data and return a risk assessment within seconds.
            </p>
            <p>Results are advisory and require clinician review before clinical decision-making.</p>
          </div>
        </form>
      </Modal>
    </>
  );
}
