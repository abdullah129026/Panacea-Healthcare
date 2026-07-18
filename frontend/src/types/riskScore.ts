import type { ISODateString, TenantScoped } from "./common";

export type RiskLevel = "Low" | "Moderate" | "High" | "Critical";

export const RISK_LEVELS: readonly RiskLevel[] = [
  "Low",
  "Moderate",
  "High",
  "Critical",
];

/** One axis of the CDS radar chart (e.g. Cardiac, Respiratory). */
export type RiskFactor = {
  label: string;
  /** Normalized 0–100 score for the radar axis. */
  score: number;
};

/** Output of an AI Clinical Decision Support analysis. */
export type RiskScore = TenantScoped & {
  id: string;
  patientId: string;
  patientName: string;
  /** Overall 0–100 composite risk. */
  overall: number;
  level: RiskLevel;
  factors: RiskFactor[];
  recommendation: string;
  createdAt: ISODateString;
};
