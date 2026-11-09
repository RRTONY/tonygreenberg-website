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

  it("sends the old SoulSmoke addresses to the Spirits page, permanently", async () => {
    const redirects = await nextConfig.redirects!();
    for (const source of ["/soulsmoke", "/soul-smoke"]) {
      expect(redirects).toContainEqual({ source, destination: "/spirits", permanent: true });
    }
  });
});
