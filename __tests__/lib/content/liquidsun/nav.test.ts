import { describe, expect, it } from "vitest";
import { LIQUIDSUN_BASE, liquidsunMenu, liquidsunRoutes, liquidsunUnlistedRoutes, ls } from "@/lib/content/liquidsun/nav";

describe("LiquidSun nav", () => {
  it("prefixes every path with /liquid-sun", () => {
    expect(LIQUIDSUN_BASE).toBe("/liquid-sun");
    expect(ls("/")).toBe("/liquid-sun");
    expect(ls("")).toBe("/liquid-sun");
    expect(ls("/altar")).toBe("/liquid-sun/altar");
    expect(ls("altar")).toBe("/liquid-sun/altar");
  });

  it("lists the app's 32 routes and every menu link is one of them", () => {
    expect(liquidsunRoutes).toHaveLength(32);
    expect(new Set(liquidsunRoutes).size).toBe(32);
    const routes = new Set<string>(liquidsunRoutes);
    const items = liquidsunMenu.flatMap((s) => s.items);
    expect(items).toHaveLength(23);
    for (const item of items) {
      expect(routes.has(item.path)).toBe(true);
      expect(item.labelEs).toBeTruthy();
    }
    expect(liquidsunMenu.map((s) => s.title)).toEqual(["The Spirit", "The Hunt", "The Culture", "The Industry"]);
    for (const r of liquidsunUnlistedRoutes) expect(routes.has(r)).toBe(true);
  });
});
