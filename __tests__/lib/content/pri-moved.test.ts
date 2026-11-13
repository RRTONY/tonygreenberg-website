import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";
import { PRI_MOVED_PAGES, isMovedPriHref, priPrefetch } from "@/lib/content/pri-moved";

describe("pri-moved", () => {
  it("is the same list the redirect uses: each page 307s to psychedelicreadiness.com", async () => {
    const redirects = (await nextConfig.redirects!()) as { source: string; destination: string; permanent?: boolean }[];
    for (const [source, path] of PRI_MOVED_PAGES) {
      expect(redirects).toContainEqual({ source, destination: `https://psychedelicreadiness.com${path}`, permanent: false });
    }
  });

  it("recognises moved pages with or without a query or #hash, and nothing else", () => {
    expect(isMovedPriHref("/psychedelic-readiness-index")).toBe(true);
    expect(isMovedPriHref("/psychedelic-readiness-index?m=ibogaine")).toBe(true);
    expect(isMovedPriHref("/psychedelic-readiness-index#mao-b")).toBe(true);
    expect(isMovedPriHref("/facilitator-index")).toBe(true);
    expect(isMovedPriHref("/pri-research")).toBe(false); // stays on tonygreenberg.com
    expect(isMovedPriHref("/psychedelic-readiness-index-extra")).toBe(false);
    expect(isMovedPriHref("/blog/iboga-ibogaine-the-full-paradox")).toBe(false);
  });

  it("turns prefetch off only for moved pages (a cross-site prefetch fails with a CORS error)", () => {
    expect(priPrefetch("/iboga-compass")).toBe(false);
    expect(priPrefetch("/the-index")).toBeUndefined();
  });
});
