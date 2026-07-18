import { describe, expect, it } from "vitest";
import { canAccessRoute } from "@/lib/auth/rbac";

describe("canAccessRoute", () => {
  it("allows a role listed for a route", () => {
    expect(canAccessRoute("admin", "/billing")).toBe(true);
    expect(canAccessRoute("billing", "/billing")).toBe(true);
    expect(canAccessRoute("clinician", "/patients")).toBe(true);
  });

  it("denies a role not listed for a route", () => {
    expect(canAccessRoute("clinician", "/billing")).toBe(false);
    expect(canAccessRoute("support", "/patients")).toBe(false);
    expect(canAccessRoute("billing", "/ai-cds")).toBe(false);
  });

  it("grants every role access to the dashboard", () => {
    for (const role of ["clinician", "admin", "support", "billing"] as const) {
      expect(canAccessRoute(role, "/dashboard")).toBe(true);
    }
  });

  it("defaults to allow for routes absent from the map", () => {
    expect(canAccessRoute("support", "/unmapped")).toBe(true);
  });
});
