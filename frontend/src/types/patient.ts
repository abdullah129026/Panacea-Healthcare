import type { ISODateString, TenantScoped } from "./common";

export type Gender = "Male" | "Female" | "Other";

/** Patient lifecycle status, mirroring the badges used in the patients UI. */
export type PatientStatus =
  | "Active"
  | "Critical"
  | "Recovering"
  | "Admitted"
  | "Discharged";

export const PATIENT_STATUSES: readonly PatientStatus[] = [
  "Active",
  "Critical",
  "Recovering",
  "Admitted",
  "Discharged",
];

export type Patient = TenantScoped & {
  id: string;
  name: string;
  age: number;
  gender: Gender;
  phone: string;
  email: string;
  condition: string;
  department: string;
  status: PatientStatus;
  doctor: string;
  avatar?: string;
  lastVisit: ISODateString | null;
  createdAt: ISODateString;
};
