import { describe, expect, it } from "vitest";
import { formatPostDate } from "@/lib/format-post-date";

describe("formatPostDate", () => {
  it("shows the India date for an 18:30 UTC publish time (the real publish day)", () => {
    expect(formatPostDate("2026-08-08T18:30:00Z")).toBe("August 9, 2026");
  });

  it("supports the short and month-year styles", () => {
    expect(formatPostDate("2026-08-08T18:30:00Z", "short")).toBe("Aug 9, 2026");
    expect(formatPostDate("2026-08-08T18:30:00Z", "monthYear")).toBe("August 2026");
  });

  it("returns an empty string for a missing or broken date", () => {
    expect(formatPostDate(undefined)).toBe("");
    expect(formatPostDate("not a date")).toBe("");
  });
});
