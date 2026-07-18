import { z } from "zod";

const invoiceStatus = z.enum(["Paid", "Pending", "Overdue", "Draft"]);

const lineItem = z.object({
  description: z.string().min(1, "Description is required."),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1."),
  unitAmount: z.coerce
    .number()
    .int("Amount must be in cents.")
    .min(0, "Amount must be positive."),
});

export const createInvoiceSchema = z.object({
  patientId: z.string().min(1, "Select a patient."),
  payer: z.string().min(1, "Payer is required."),
  status: invoiceStatus.default("Draft"),
  currency: z.string().length(3, "Use a 3-letter currency code.").default("USD"),
  lineItems: z.array(lineItem).min(1, "Add at least one line item."),
  issuedAt: z.iso.datetime({ message: "Select a valid issue date." }),
  dueAt: z.iso.datetime({ message: "Select a valid due date." }),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
