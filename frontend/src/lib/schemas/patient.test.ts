import { describe, expect, it } from "vitest";
import { createPatientSchema } from "@/lib/schemas";

const valid = {
  name: "Jordan Rivers",
  age: "45",
  gender: "Male",
  phone: "+1 (555) 234-5678",
  email: "jordan.rivers@email.com",
  condition: "Cardiac Arrhythmia",
  department: "Cardiology",
  status: "Active",
  doctor: "Dr. Wilson",
};

describe("createPatientSchema", () => {
  it("accepts valid input and coerces age from a string", () => {
    const result = createPatientSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.age).toBe(45);
      expect(typeof result.data.age).toBe("number");
    }
  });

  it("defaults status to Active when omitted", () => {
    const { status: _status, ...rest } = valid;
    void _status;
    const result = createPatientSchema.safeParse(rest);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.status).toBe("Active");
  });

  it("rejects an invalid email and a non-numeric age", () => {
    const result = createPatientSchema.safeParse({
      ...valid,
      email: "not-an-email",
      age: "abc",
    });
    expect(result.success).toBe(false);
  });
});
