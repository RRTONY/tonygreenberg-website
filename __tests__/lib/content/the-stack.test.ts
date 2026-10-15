import { describe, expect, it } from "vitest";
import * as stack from "@/lib/content/the-stack";
import { STACK_HERO, STACK_CATEGORIES } from "@/lib/content/the-stack";

const SUPPLIERS = STACK_CATEGORIES.flatMap((c) => c.suppliers);

describe("the-stack", () => {
  it("hosts the hero and QR codes on Sanity, never Manus", () => {
    expect(STACK_HERO.src).toMatch(/^https:\/\/cdn\.sanity\.io\/images\//);
    expect(STACK_HERO.src).toContain(`-${STACK_HERO.width}x${STACK_HERO.height}.`);
    expect(STACK_HERO.alt.trim()).not.toBe("");
    for (const s of SUPPLIERS) if (s.qr) expect(s.qr.src).toMatch(/^https:\/\/cdn\.sanity\.io\/images\//);
    expect(JSON.stringify(stack)).not.toMatch(/manuscdn|\/manus-storage\/|\/api\/img\//);
  });

  it("has five QR codes", () => {
    expect(SUPPLIERS.filter((s) => s.qr)).toHaveLength(5);
  });

  it("has unique categories starting with Bloodwork", () => {
    expect(STACK_CATEGORIES[0]).toMatchObject({ id: "bloodwork", title: "Bloodwork" });
    expect(new Set(STACK_CATEGORIES.map((c) => c.id)).size).toBe(STACK_CATEGORIES.length);
    for (const c of STACK_CATEGORIES) expect(c.suppliers.length).toBeGreaterThan(0);
  });

  it("gives every supplier its copy and an https or mailto link", () => {
    for (const s of SUPPLIERS) {
      expect(s.kicker && s.name && s.description && s.why).toBeTruthy();
      expect(s.href).toMatch(/^(https:\/\/|mailto:)/);
    }
  });
});
