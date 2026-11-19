import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";
import { PRI_MOVED_PAGES, PRI_SITE, priHref } from "@/lib/content/pri-moved";

describe("pri-moved", () => {
  it("is the same list the redirect uses: each page 308s to psychedelicreadiness.com", async () => {
    const redirects = (await nextConfig.redirects!()) as { source: string; destination: string; permanent?: boolean }[];
    for (const [source, path] of PRI_MOVED_PAGES) {
      expect(redirects).toContainEqual({ source, destination: `${PRI_SITE}${path}`, permanent: true });
    }
  });

  it("points moved pages straight at psychedelicreadiness.com, keeping the query and #hash", () => {
    expect(priHref("/psychedelic-readiness-index")).toBe("https://psychedelicreadiness.com/");
    expect(priHref("/psychedelic-readiness-index?m=ibogaine")).toBe("https://psychedelicreadiness.com/?m=ibogaine");
    expect(priHref("/psychedelic-readiness-index#mao-b")).toBe("https://psychedelicreadiness.com/#mao-b");
    expect(priHref("/psychedelic-readiness-index/disclaimer")).toBe("https://psychedelicreadiness.com/disclaimer");
    expect(priHref("/facilitator-index")).toBe("https://psychedelicreadiness.com/facilitator-index");
    expect(priHref("https://tonygreenberg.com/iboga-compass")).toBe("https://psychedelicreadiness.com/iboga-compass");
    expect(priHref("https://www.tonygreenberg.com/pri-efficacy")).toBe("https://psychedelicreadiness.com/pri-efficacy");
  });

  it("leaves every other link alone", () => {
    expect(priHref("/pri-research")).toBe("/pri-research"); // stays on tonygreenberg.com
    expect(priHref("/psychedelic-readiness-index-extra")).toBe("/psychedelic-readiness-index-extra");
    expect(priHref("/blog/iboga-ibogaine-the-full-paradox")).toBe("/blog/iboga-ibogaine-the-full-paradox");
    expect(priHref("https://example.com/facilitator-index")).toBe("https://example.com/facilitator-index");
    expect(priHref("")).toBe("");
  });
});
