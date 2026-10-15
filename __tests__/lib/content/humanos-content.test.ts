import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import * as h from "@/lib/content/humanos-content";
import {
  HUMANOS_NAV_ITEMS, MENTOR, ADVISORS, PARTNERS, CLIENTS, DIAGNOSTIC_HREF, PLAYBOOKS, DAILY_PRACTICES, READING_LIST,
  CONNECT_CHANNELS, PATH_TIMELINE,
} from "@/lib/content/humanos-content";

const pageExists = (href: string) => existsSync(path.join(process.cwd(), "src/app", href, "page.tsx"));

describe("humanos-content", () => {
  it("has the four HumanOS sections in the nav, all real pages", () => {
    expect(HUMANOS_NAV_ITEMS.map((n) => n.label)).toEqual(["Philosophy", "Ecosystem", "Resources", "Connect"]);
    for (const n of HUMANOS_NAV_ITEMS) expect(pageExists(n.href), n.href).toBe(true);
  });

  it("points every diagnostic CTA at the philosophy page, and connect channels at real pages", () => {
    expect(DIAGNOSTIC_HREF).toBe("/humanos/philosophy");
    for (const c of CONNECT_CHANNELS) {
      expect(c.href.startsWith("/")).toBe(true);
      expect(pageExists(c.href), c.href).toBe(true);
    }
    expect(CONNECT_CHANNELS.map((c) => c.href)).not.toContain("/manifesto");
  });

  it("gives every person a name, role, org, quote and a Sanity photo", () => {
    const people = [MENTOR, ...ADVISORS, ...PARTNERS];
    expect(people).toHaveLength(12);
    expect(new Set(people.map((p) => p.name)).size).toBe(12);
    for (const p of people) {
      expect(p.name && p.role && p.org && p.quote).toBeTruthy();
      expect(p.img).toMatch(/^https:\/\/cdn\.sanity\.io\/images\//);
    }
    expect(MENTOR.name).toBe("David Orban");
  });

  it("contains no Manus URL anywhere", () => {
    expect(JSON.stringify(h)).not.toMatch(/manuscdn|\/manus-storage\/|\/api\/img\//);
  });

  it("has numbered playbooks, practices, books, clients and a timeline", () => {
    expect(PLAYBOOKS.map((p) => p.num)).toEqual(["01", "02", "03", "04"]);
    for (const d of DAILY_PRACTICES) expect(d.items.length).toBeGreaterThan(0);
    expect(READING_LIST.map((b) => b.title)).toContain("The Paradox of Choice");
    expect(new Set(CLIENTS).size).toBe(CLIENTS.length);
    expect(PATH_TIMELINE[0]).toMatchObject({ year: "2010", title: "The H+ Summit" });
    expect(PATH_TIMELINE.at(-1)?.year).toBe("2025");
  });
});
