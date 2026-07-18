import { z } from "zod";

const gender = z.enum(["Male", "Female", "Other"]);
const patientStatus = z.enum([
  "Active",
  "Critical",
  "Recovering",
  "Admitted",
  "Discharged",
]);

export const createPatientSchema = z.object({
  name: z.string().min(2, "Enter the patient's full name."),
  age: z.coerce
    .number()
    .int("Age must be a whole number.")
    .min(0, "Age must be positive.")
    .max(150, "Enter a valid age."),
  gender,
  phone: z.string().min(7, "Enter a valid phone number."),
  email: z.email("Enter a valid email address."),
  condition: z.string().min(1, "Condition is required."),
  department: z.string().min(1, "Department is required."),
  status: patientStatus.default("Active"),
  doctor: z.string().min(1, "Assign a doctor."),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
