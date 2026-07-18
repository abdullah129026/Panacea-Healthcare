import type { ISODateString, TenantScoped } from "./common";

export type AppointmentStatus =
  | "Confirmed"
  | "Pending"
  | "Cancelled"
  | "Completed";

export const APPOINTMENT_STATUSES: readonly AppointmentStatus[] = [
  "Confirmed",
  "Pending",
  "Cancelled",
  "Completed",
];

export type AppointmentMode = "In-Person" | "Virtual";

export type Appointment = TenantScoped & {
  id: string;
  patientId: string;
  patientName: string;
  type: string;
  department: string;
  doctor: string;
  status: AppointmentStatus;
  mode: AppointmentMode;
  /** Scheduled start; duration in minutes kept separate for grid rendering. */
  startsAt: ISODateString;
  durationMinutes: number;
  createdAt: ISODateString;
};
