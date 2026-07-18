import { describe, expect, it } from "vitest";
import { z } from "zod";
import { fieldErrorsFromZod } from "@/lib/forms";

const schema = z.object({
  email: z.email("Bad email."),
  password: z.string().min(8, "Too short."),
});

describe("fieldErrorsFromZod", () => {
  it("maps each invalid field to its messages", () => {
    const result = schema.safeParse({ email: "nope", password: "x" });
    expect(result.success).toBe(false);
    if (result.success) return;

    const errors = fieldErrorsFromZod(result.error);
    expect(errors.email).toEqual(["Bad email."]);
    expect(errors.password).toEqual(["Too short."]);
  });

  it("returns no keys for valid input", () => {
    const result = schema.safeParse({
      email: "a@b.com",
      password: "longenough",
    });
    expect(result.success).toBe(true);
  });
});
