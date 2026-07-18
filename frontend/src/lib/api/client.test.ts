import { afterEach, describe, expect, it, vi } from "vitest";
import { apiRequest } from "@/lib/api/client";

function mockFetch(response: Partial<Response> & { json?: () => Promise<unknown> }) {
  return vi.fn().mockResolvedValue(response as Response);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("apiRequest", () => {
  it("returns { success: true, data } on a 200 response", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({ ok: true, status: 200, json: async () => ({ id: "1" }) })
    );
    const result = await apiRequest<{ id: string }>("patients/1");
    expect(result).toEqual({ success: true, data: { id: "1" } });
  });

  it("normalizes a non-ok response to a user-facing error", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({ ok: false, status: 500, json: async () => ({ error: "boom" }) })
    );
    const result = await apiRequest("patients");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error).not.toContain("boom");
    }
  });

  it("never throws when fetch rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    const result = await apiRequest("patients");
    expect(result.success).toBe(false);
  });

  it("attaches auth + tenant headers when provided", async () => {
    const fetchMock = mockFetch({
      ok: true,
      status: 200,
      json: async () => ({}),
    });
    vi.stubGlobal("fetch", fetchMock);
    await apiRequest("patients", { token: "tok", clinicId: "clinic-1" });
    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers.Authorization).toBe("Bearer tok");
    expect(init.headers["X-Clinic-Id"]).toBe("clinic-1");
  });
});
