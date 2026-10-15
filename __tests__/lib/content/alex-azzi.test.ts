import { describe, expect, it } from "vitest";
import * as data from "@/lib/content/alex-azzi";
import {
  SUBJECT, IMG, TOC, EVIDENCE_TOTALS, EVIDENCE_ROWS, PLAYBOOK_STEPS, VERIFICATION_STEPS,
  SCAM_RESOURCES, RETRIBUTION_LEDGER, FAQ, ECOSYSTEM_LINKS, MAP_PINS, LEGAL_NOTICES,
} from "@/lib/content/alex-azzi";

const MANUS = /manuscdn|\/manus-storage\/|\/api\/img\//;
function allStrings(v: unknown, out: string[] = []): string[] {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => allStrings(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => allStrings(x, out));
  return out;
}

describe("alex-azzi case data", () => {
  it("has the real subject details", () => {
    expect(SUBJECT.name).toBe("Alex Azzi");
    expect(SUBJECT.caseNumber).toBe("CPR-2026-001");
    expect(SUBJECT.slug).toBe("alex-azzi");
    expect(SUBJECT.totalPaid).toBe("$15,000");
    expect(SUBJECT.yearsOfPattern).toBe(6);
  });

  it("contains no Manus-hosted URL anywhere, and every image is on Sanity's CDN", () => {
    for (const s of allStrings(data)) expect(s).not.toMatch(MANUS);
    for (const url of Object.values(IMG)) expect(url).toMatch(/^https:\/\/cdn\.sanity\.io\/images\//);
  });

  it("has unique table-of-contents anchors with labels", () => {
    const ids = TOC.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids[0]).toBe("case");
    for (const t of TOC) {
      expect(t.id).toMatch(/^[a-z-]+$/);
      expect(t.label.trim()).not.toBe("");
    }
  });

  it("numbers the playbook and verification steps 1..n in order", () => {
    expect(PLAYBOOK_STEPS.map((s) => s.num)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(VERIFICATION_STEPS.map((s) => s.num)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    for (const s of VERIFICATION_STEPS) expect(s.gate.trim()).not.toBe("");
  });

  it("uses only known evidence strengths and ledger statuses", () => {
    expect(EVIDENCE_TOTALS).toHaveLength(4);
    for (const r of EVIDENCE_ROWS) expect(["IRONCLAD", "STRONG", "DOCUMENTED"]).toContain(r.strength);
    const catIds = RETRIBUTION_LEDGER.categories.map((c) => c.id);
    expect(new Set(catIds).size).toBe(catIds.length);
    for (const c of RETRIBUTION_LEDGER.categories) expect(c.items.length).toBeGreaterThan(0);
  });

  it("links ecosystem cards to internal routes and resources to https sites", () => {
    const hrefs = ECOSYSTEM_LINKS.map((l) => l.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const l of ECOSYSTEM_LINKS) {
      expect(l.href).toMatch(/^\/[a-z0-9/-]*$/);
      expect(l.href).not.toContain("?type=");
      expect(["Assessment", "Read"]).toContain(l.tag);
    }
    for (const r of SCAM_RESOURCES) expect(r.url).toMatch(/^https:\/\//);
  });

  it("has non-empty FAQ, map pins and legal notices", () => {
    expect(FAQ.length).toBeGreaterThanOrEqual(5);
    for (const f of FAQ) expect(f.q.endsWith("?") && f.a.length > 20).toBe(true);
    expect(MAP_PINS.map((p) => p.city)).toContain("Dubai, UAE");
    expect(LEGAL_NOTICES.map((n) => n.title)).toContain("Right of Reply");
  });
});
