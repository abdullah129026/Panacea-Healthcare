import { describe, expect, it } from "vitest";
import { isAuthPath, isPortalPath } from "@/lib/routes";

describe("isPortalPath", () => {
  it("matches portal roots and their nested paths", () => {
    expect(isPortalPath("/dashboard")).toBe(true);
    expect(isPortalPath("/patients")).toBe(true);
    expect(isPortalPath("/patients/123")).toBe(true);
    expect(isPortalPath("/settings/security")).toBe(true);
  });

  it("does not match public or auth paths", () => {
    expect(isPortalPath("/")).toBe(false);
    expect(isPortalPath("/login")).toBe(false);
    expect(isPortalPath("/register")).toBe(false);
  });

  it("does not match a prefix that is only a substring", () => {
    expect(isPortalPath("/patients-export")).toBe(false);
  });
});

describe("isAuthPath", () => {
  it("matches exact auth routes only", () => {
    expect(isAuthPath("/login")).toBe(true);
    expect(isAuthPath("/forgot-password")).toBe(true);
    expect(isAuthPath("/login/extra")).toBe(false);
    expect(isAuthPath("/dashboard")).toBe(false);
  });
});
