import { describe, expect, it } from "vitest";
import { pageWindow } from "@/lib/pagination";

describe("pageWindow", () => {
  it("returns a single page when there is one or none", () => {
    expect(pageWindow(1, 1)).toEqual([1]);
    expect(pageWindow(1, 0)).toEqual([1]);
  });

  it("lists every page without gaps when small", () => {
    expect(pageWindow(2, 4)).toEqual([1, 2, 3, 4]);
  });

  it("inserts ellipses around the current page in a large range", () => {
    expect(pageWindow(6, 42)).toEqual([1, "...", 5, 6, 7, "...", 42]);
  });

  it("has no leading gap near the start", () => {
    expect(pageWindow(2, 42)).toEqual([1, 2, 3, "...", 42]);
  });

  it("has no trailing gap near the end", () => {
    expect(pageWindow(41, 42)).toEqual([1, "...", 40, 41, 42]);
  });
});
