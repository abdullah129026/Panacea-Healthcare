import { z } from "zod";

/**
 * Input for a new AI CDS analysis (NewClinicalAnalysisModal). Produces a
 * `RiskScore` on the backend; the result renders on `/ai-cds/result`.
 */
export const newAnalysisSchema = z.object({
  patientId: z.string().min(1, "Select a patient."),
  symptoms: z.string().min(1, "Describe the presenting symptoms."),
  vitals: z.string().optional(),
  history: z.string().optional(),
  notes: z.string().max(1000, "Notes are too long.").optional(),
});

export type NewAnalysisInput = z.infer<typeof newAnalysisSchema>;
