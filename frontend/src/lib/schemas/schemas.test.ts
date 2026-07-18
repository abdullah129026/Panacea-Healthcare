import { describe, expect, it } from "vitest";
import { createPatientSchema } from "@/lib/schemas/patient";
import { loginSchema, registerSchema } from "@/lib/schemas/auth";

describe("createPatientSchema", () => {
  const valid = {
    name: "Jordan Rivers",
    age: "45",
    gender: "Male",
    phone: "+1 (555) 234-5678",
    email: "jordan.rivers@email.com",
    condition: "Cardiac Arrhythmia",
    department: "Cardiology",
    doctor: "Dr. Wilson",
  };

  it("accepts valid input and coerces age to a number", () => {
    const result = createPatientSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.age).toBe(45);
      expect(result.data.status).toBe("Active");
    }
  });

  it("rejects an invalid email", () => {
    const result = createPatientSchema.safeParse({ ...valid, email: "nope" });
    expect(result.success).toBe(false);
  });

  it("rejects an out-of-range age", () => {
    const result = createPatientSchema.safeParse({ ...valid, age: "999" });
    expect(result.success).toBe(false);
  });
});

describe("auth schemas", () => {
  it("loginSchema requires email + password", () => {
    expect(loginSchema.safeParse({ email: "a@b.com", password: "x" }).success).toBe(
      true
    );
    expect(loginSchema.safeParse({ email: "a@b.com", password: "" }).success).toBe(
      false
    );
  });

  it("registerSchema fails when passwords do not match", () => {
    const result = registerSchema.safeParse({
      name: "Ada Lovelace",
      email: "ada@example.com",
      password: "supersecret",
      confirmPassword: "different",
    });
    expect(result.success).toBe(false);
  });
});
