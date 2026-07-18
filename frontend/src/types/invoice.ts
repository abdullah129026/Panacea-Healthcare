import type { ISODateString, TenantScoped } from "./common";

export type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Draft";

export const INVOICE_STATUSES: readonly InvoiceStatus[] = [
  "Paid",
  "Pending",
  "Overdue",
  "Draft",
];

export type InvoiceLineItem = {
  description: string;
  quantity: number;
  /** Unit price in minor currency units (cents) to avoid float drift. */
  unitAmount: number;
};

export type Invoice = TenantScoped & {
  id: string;
  patientId: string;
  patientName: string;
  payer: string;
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
  /** Total in minor currency units (cents). */
  totalAmount: number;
  currency: string;
  issuedAt: ISODateString;
  dueAt: ISODateString;
  createdAt: ISODateString;
};
