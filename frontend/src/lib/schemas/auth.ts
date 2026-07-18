import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Enter your full name."),
  clinicName: z.string().min(2, "Enter your clinic or hospital name."),
  email: z.email("Enter a valid email address."),
  password: z
    .string()
    .min(12, "Password must be at least 12 characters.")
    .regex(/[^a-zA-Z0-9]/, "Include at least one symbol."),
  agree: z.literal(true, {
    error: "You must accept the terms to continue.",
  }),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Enter a valid email address."),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
