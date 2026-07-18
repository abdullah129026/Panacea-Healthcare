/**
 * Clinical Operations domain types.
 * Represents procedures, staff schedules, and bed occupancy tracking.
 */

export type ProcedureStatus = "Scheduled" | "In Progress" | "Complete" | "Cancelled";

export interface Procedure {
  id: string;
  procedure: string;
  patient: string;
  doctor: string;
  room: string;
  status: ProcedureStatus;
  duration: string;
  startedAt?: string;
  completedAt?: string;
  notes?: string;
}

export type StaffStatus = "On Duty" | "In Surgery" | "Available" | "Off Duty";

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: StaffStatus;
  patientsAssigned: number;
  shiftStart?: string;
  shiftEnd?: string;
  specializations?: string[];
}

export interface BedOccupancy {
  department: string;
  occupied: number;
  total: number;
  occupancyRate: number;
}

export interface OperationsMetrics {
  activeProcedures: number;
  staffOnDuty: number;
  bedOccupancyRate: number;
  averageTurnaroundTime: string;
  proceduresToday: number;
  surgeries: number;
  diagnostics: number;
  consultations: number;
  followUps: number;
}
