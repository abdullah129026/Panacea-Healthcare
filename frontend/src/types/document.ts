import type { ISODateString, TenantScoped } from "./common";

export type DocumentCategory =
  | "Clinical"
  | "Lab Reports"
  | "Imaging & Scans"
  | "Prescriptions"
  | "Admin Documents"
  | "Archived";

export const DOCUMENT_CATEGORIES: readonly DocumentCategory[] = [
  "Clinical",
  "Lab Reports",
  "Imaging & Scans",
  "Prescriptions",
  "Admin Documents",
  "Archived",
];

export type DocumentStatus = "Active" | "Archived";

/** A medical-record document. Binary lives behind the API's file endpoints. */
export type Document = TenantScoped & {
  id: string;
  name: string;
  type: string;
  category: DocumentCategory;
  format: string;
  /** File size in bytes. */
  sizeBytes: number;
  status: DocumentStatus;
  patientId: string | null;
  uploadedBy: string;
  uploadedAt: ISODateString;
};
