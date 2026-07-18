import { z } from "zod";

const appointmentMode = z.enum(["In-Person", "Virtual"]);
const appointmentStatus = z.enum([
  "Confirmed",
  "Pending",
  "Cancelled",
  "Completed",
]);

export const createAppointmentSchema = z.object({
  patientId: z.string().min(1, "Select a patient."),
  type: z.string().min(1, "Appointment type is required."),
  department: z.string().min(1, "Department is required."),
  doctor: z.string().min(1, "Assign a doctor."),
  mode: appointmentMode.default("In-Person"),
  status: appointmentStatus.default("Pending"),
  startsAt: z.iso.datetime({ message: "Select a valid date and time." }),
  durationMinutes: z.coerce
    .number()
    .int()
    .min(5, "Minimum duration is 5 minutes.")
    .max(480, "Duration is too long."),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
