"use client";

import { useActionState, useState } from "react";
import { Modal, Button, Badge, Input } from "@/components/ui";
import { FileText, Plus, Send, Trash2, X } from "lucide-react";
import { createInvoice } from "@/app/(portal)/billing/actions";
import type { FormState } from "@/lib/forms";

const FORM_ID = "create-invoice-form";
const initialState: FormState = {};

type LineItem = {
  description: string;
  quantity: number;
  unitAmount: number;
};

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-[11px] text-destructive">{messages[0]}</p>;
}

export function CreateInvoiceModal() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createInvoice,
    initialState
  );
  const [seenState, setSeenState] = useState(state);
  const [formKey, setFormKey] = useState(0);
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "Service", quantity: 1, unitAmount: 10000 },
  ]);

  if (state !== seenState) {
    setSeenState(state);
    if (state.success) {
      setOpen(false);
      setFormKey((k) => k + 1);
      setLineItems([{ description: "Service", quantity: 1, unitAmount: 10000 }]);
    }
  }

  function addLineItem() {
    setLineItems([
      ...lineItems,
      { description: "", quantity: 1, unitAmount: 0 },
    ]);
  }

  function removeLineItem(index: number) {
    setLineItems(lineItems.filter((_, i) => i !== index));
  }

  function updateLineItem(
    index: number,
    field: keyof LineItem,
    value: unknown
  ) {
    const updated = [...lineItems];
    if (field === "quantity" || field === "unitAmount") {
      updated[index] = { ...updated[index], [field]: Number(value) };
    } else {
      updated[index] = { ...updated[index], [field]: String(value) };
    }
    setLineItems(updated);
  }

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitAmount,
    0
  );

  return (
    <>
      <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
        <FileText className="w-4 h-4" /> Create Invoice
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create New Invoice"
        description="Create and send invoice to patient"
        size="lg"
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
              disabled={pending || lineItems.length === 0}
            >
              <Send className="w-4 h-4" />
              {pending ? "Creating..." : "Create Invoice"}
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
              <Input
                label="Payer / Insurance"
                name="payer"
                placeholder="e.g., BlueCross BlueShield"
                required
              />
              <FieldError messages={state.fieldErrors?.payer} />
            </div>
            <div>
              <Input
                label="Currency"
                name="currency"
                placeholder="USD"
                maxLength={3}
                defaultValue="USD"
              />
              <FieldError messages={state.fieldErrors?.currency} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Issued Date"
                name="issuedAt"
                type="datetime-local"
                required
              />
              <FieldError messages={state.fieldErrors?.issuedAt} />
            </div>
            <div>
              <Input
                label="Due Date"
                name="dueAt"
                type="datetime-local"
                required
              />
              <FieldError messages={state.fieldErrors?.dueAt} />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground mb-2 block">
              Line Items
            </label>
            <div className="space-y-3 mb-3">
              {lineItems.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-3 items-end p-3 rounded-xl border border-border"
                >
                  <div className="flex-1">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) =>
                        updateLineItem(index, "description", e.target.value)
                      }
                      placeholder="Description"
                      className="w-full h-10 px-3 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="w-20">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateLineItem(index, "quantity", e.target.value)
                      }
                      placeholder="Qty"
                      min="1"
                      className="w-full h-10 px-2 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      value={item.unitAmount}
                      onChange={(e) =>
                        updateLineItem(index, "unitAmount", e.target.value)
                      }
                      placeholder="Amount"
                      min="0"
                      className="w-full h-10 px-2 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="w-24 text-right text-sm font-medium text-foreground">
                    ${((item.quantity * item.unitAmount) / 100).toFixed(2)}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLineItem(index)}
                    className="p-2 rounded-lg hover:bg-error/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-error" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addLineItem}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <Plus className="w-3 h-3" /> Add Line Item
            </button>
            <FieldError messages={state.fieldErrors?.lineItems} />
          </div>

          <div className="p-4 rounded-xl bg-info/5 border border-info/20">
            <div className="text-right space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-mono font-medium">
                  ${(subtotal / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold pt-2 border-t border-info/20">
                <span>Total:</span>
                <span className="font-mono">
                  ${(subtotal / 100).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <input type="hidden" name="lineItems" value={JSON.stringify(lineItems)} />
          <Input type="hidden" name="status" value="Draft" />
        </form>
      </Modal>
    </>
  );
}
