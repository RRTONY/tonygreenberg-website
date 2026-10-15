import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { TENTACLES, TOTAL_STOPS, SKIPPY_STORAGE_KEY } from "@/lib/content/skippy-map";
import { POST_ORDER } from "@/lib/content/post-order";

const APP = path.join(process.cwd(), "src/app");
const NEXT_CONFIG = readFileSync(path.join(process.cwd(), "next.config.ts"), "utf8");
function page(href: string, dir = APP): boolean {
  const [seg, ...rest] = href.replace(/[?#].*$/, "").split("/").filter(Boolean);
  if (!seg) return existsSync(path.join(dir, "page.tsx"));
  const entries = readdirSync(dir);
  const candidates = [seg, ...entries.filter((d) => d.startsWith("(")).map((g) => `${g}/${seg}`)];
  return candidates.some((s) => existsSync(path.join(dir, s)) && page(rest.join("/"), path.join(dir, s)));
}
const STOPS = TENTACLES.flatMap((t) => t.stops);

describe("skippy-map", () => {
  it("has unique tentacles, starting with the featured path", () => {
    expect(TENTACLES[0].id).toBe("featured");
    expect(new Set(TENTACLES.map((t) => t.id)).size).toBe(TENTACLES.length);
    expect(new Set(TENTACLES.map((t) => t.theme)).size).toBe(TENTACLES.length);
  });

  it("has unique stop ids, one start stop, and the right total", () => {
    expect(new Set(STOPS.map((s) => s.id)).size).toBe(STOPS.length);
    expect(TOTAL_STOPS).toBe(STOPS.length);
    expect(STOPS.filter((s) => s.isStart).map((s) => s.id)).toEqual(["start-here"]);
    expect(SKIPPY_STORAGE_KEY).toBe("skippy-journey-progress");
  });

  it("links each live stop to a real page without a redirect hop", () => {
    for (const s of STOPS) {
      if (s.href === null) continue;
      expect(NEXT_CONFIG.includes(`source: "${s.href}"`), `${s.id} uses a redirect`).toBe(false);
      const essay = s.href.match(/^\/blog\/([^/]+)$/);
      if (essay) expect(POST_ORDER).toContain(essay[1]);
      else expect(page(s.href), `${s.id} -> ${s.href}`).toBe(true);
    }
  });

  it("shows only the documented unbuilt stops as Coming Soon", () => {
    const coming = STOPS.filter((s) => s.href === null).map((s) => s.id);
    // Friend Gate and Post-Intervention are live pages now (fixed 2026-10-16).
    expect(coming).not.toContain("friend-gate");
    expect(coming).not.toContain("post-intervention");
    for (const s of STOPS) expect(s.label.trim() && s.description.trim() && s.time.trim()).toBeTruthy();
  });
});
