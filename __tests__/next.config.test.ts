import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";

describe("next.config redirects", () => {
  it("sends the short /united address to the United article, permanently", async () => {
    const redirects = await nextConfig.redirects!();
    expect(redirects).toContainEqual({
      source: "/united",
      destination: "/blog/united-airlines-the-case-of-the-creamy-thing",
      permanent: true,
    });
  });

  it("sends /medicine to the medicine hub, permanently", async () => {
    const redirects = await nextConfig.redirects!();
    expect(redirects).toContainEqual({
      source: "/medicine",
      destination: "/psychedelic-readiness-index",
      permanent: true,
    });
  });

  it("sends the PRI pages to psychedelicreadiness.com, temporarily (QA, 2026-11-13)", async () => {
    const redirects = await nextConfig.redirects!();
    const pri = (source: string) => redirects.find((r) => r.source === source);
    expect(pri("/psychedelic-readiness-index")).toEqual({
      source: "/psychedelic-readiness-index",
      destination: "https://psychedelicreadiness.com/",
      permanent: false,
    });
    expect(pri("/psychedelic-readiness-index/disclaimer")?.destination).toBe("https://psychedelicreadiness.com/disclaimer");
    for (const page of ["/pri-calibration", "/pri-efficacy", "/medicine-sequencing", "/iboga-ibogaine", "/iboga-compass", "/peyote-mescaline", "/facilitator-index"]) {
      expect(pri(page)).toEqual({ source: page, destination: `https://psychedelicreadiness.com${page}`, permanent: false });
    }
    expect(pri("/pri-research")).toBeUndefined();
  });

  it("sends the Search Console 404s (/bio, old BrewSoul catalog files) to real pages, permanently", async () => {
    const redirects = await nextConfig.redirects!();
    expect(redirects).toContainEqual({ source: "/bio", destination: "/about", permanent: true });
    expect(redirects).toContainEqual({
      source: "/brewsoul/catalog.txt",
      destination: "/brewsoul/directory",
      permanent: true,
    });
    expect(redirects).toContainEqual({
      source: "/brewsoul/catalog.json",
      destination: "/brewsoul/directory",
      permanent: true,
    });
  });

  it("sends /soulsmoke (and deep links under it) to the SoulSmoke guide, permanently", async () => {
    const redirects = await nextConfig.redirects!();
    expect(redirects).toContainEqual({ source: "/soulsmoke", destination: "/soul-smoke", permanent: true });
    expect(redirects).toContainEqual({
      source: "/soulsmoke/:path*",
      destination: "/soul-smoke/:path*",
      permanent: true,
    });
    // /soul-smoke is a real page now, so it must not redirect anywhere.
    expect(redirects.some((r) => r.source === "/soul-smoke")).toBe(false);
  });
});
