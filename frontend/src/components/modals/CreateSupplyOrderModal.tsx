"use client";

import { useActionState, useState } from "react";
import { Modal, Button, Input, Select, Textarea } from "@/components/ui";
import { ShoppingCart } from "lucide-react";
import { createSupplyOrder } from "@/app/(portal)/inventory/actions";
import { INVENTORY_CATEGORIES } from "@/types";
import type { FormState } from "@/lib/forms";

const FORM_ID = "create-supply-order-form";
const initialState: FormState = {};

const categoryOptions = INVENTORY_CATEGORIES.map((cat) => ({
  value: cat,
  label: cat,
}));

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="text-[11px] text-destructive">{messages[0]}</p>;
}

export function CreateSupplyOrderModal() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createSupplyOrder,
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
        <ShoppingCart className="w-4 h-4" /> Create Order
      </Button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create Supply Order"
        description="Order inventory items and manage stock levels."
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
              {pending ? "Creating..." : "Submit Order"}
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
              label="Item Name"
              name="itemName"
              placeholder="e.g., Nitrile Gloves, Blue, Large"
              required
            />
            <FieldError messages={state.fieldErrors?.itemName} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select
                label="Category"
                name="category"
                options={categoryOptions}
                required
              />
              <FieldError messages={state.fieldErrors?.category} />
            </div>
            <div>
              <Input
                label="Vendor"
                name="vendor"
                placeholder="e.g., Medline Industries"
                required
              />
              <FieldError messages={state.fieldErrors?.vendor} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Input
                label="Quantity"
                name="quantity"
                type="number"
                min="1"
                placeholder="10"
                required
              />
              <FieldError messages={state.fieldErrors?.quantity} />
            </div>
            <div>
              <Input
                label="Unit Cost (cents)"
                name="unitCost"
                type="number"
                min="0"
                placeholder="4250"
                required
              />
              <FieldError messages={state.fieldErrors?.unitCost} />
            </div>
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

          <div>
            <Textarea
              label="Notes (optional)"
              name="notes"
              placeholder="Special instructions or details..."
            />
            <FieldError messages={state.fieldErrors?.notes} />
          </div>
        </form>
      </Modal>
    </>
  );
}
