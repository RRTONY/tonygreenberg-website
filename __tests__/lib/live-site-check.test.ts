import { describe, expect, it, vi } from "vitest";
import {
  checkSite,
  inspectPage,
  mapLimit,
  pageProblems,
  sameAddress,
  sitemapUrls,
} from "@/lib/live-site-check";

const IMG = "https://cdn.sanity.io/images/a3q1cyqs/production/abc123-1200x630.webp";

function page(path: string, extra = "") {
  return `<html><head><link rel="canonical" href="https://tonygreenberg.com${path}"/>${extra}</head><body><img src="${IMG}?w=800"/></body></html>`;
}

function res(status: number, body = "", robots: string | null = null) {
  return {
    status,
    headers: { get: (name: string) => (name === "x-robots-tag" ? robots : null) },
    text: async () => body,
  };
}

const SITEMAP = `<urlset>
  <url><loc>https://tonygreenberg.com/</loc></url>
  <url><loc>https://tonygreenberg.com/blog</loc></url>
  <url><loc>https://tonygreenberg.com/blog</loc></url>
</urlset>`;

describe("sitemapUrls", () => {
  it("reads every <loc> once, in order", () => {
    expect(sitemapUrls(SITEMAP)).toEqual(["https://tonygreenberg.com/", "https://tonygreenberg.com/blog"]);
  });

  it("returns nothing for an empty sitemap", () => {
    expect(sitemapUrls("<urlset></urlset>")).toEqual([]);
  });
});

describe("sameAddress", () => {
  it("ignores a trailing slash", () => {
    expect(sameAddress("https://tonygreenberg.com/", "https://tonygreenberg.com")).toBe(true);
    expect(sameAddress("https://tonygreenberg.com/a", "https://tonygreenberg.com/b")).toBe(false);
  });

  it("treats an accent and its encoded form as the same address", () => {
    expect(
      sameAddress("https://tonygreenberg.com/coffee/tarrazú", "https://tonygreenberg.com/coffee/tarraz%C3%BA"),
    ).toBe(true);
  });
});

describe("inspectPage", () => {
  it("passes a normal page and collects its Sanity images once", () => {
    const p = inspectPage("https://tonygreenberg.com/blog", 200, page("/blog") + IMG, null);
    expect(p).toMatchObject({ noindex: false, canonicalOk: true, manus: false, images: [IMG] });
    expect(pageProblems(p)).toEqual([]);
  });

  it("accepts a relative canonical that points at the page", () => {
    const html = '<link rel="canonical" href="/about"/>';
    expect(inspectPage("https://tonygreenberg.com/about", 200, html, null).canonicalOk).toBe(true);
  });

  it("flags a robots meta noindex", () => {
    const p = inspectPage("https://tonygreenberg.com/x", 200, page("/x", '<meta name="robots" content="noindex, nofollow"/>'), null);
    expect(pageProblems(p)).toEqual(["https://tonygreenberg.com/x: in the sitemap but tells Google not to index it"]);
  });

  it("flags an X-Robots-Tag noindex header", () => {
    expect(inspectPage("https://tonygreenberg.com/x", 200, page("/x"), "noindex").noindex).toBe(true);
  });

  it("flags a canonical pointing somewhere else, or none at all", () => {
    const other = inspectPage("https://tonygreenberg.com/x", 200, page("/y"), null);
    expect(pageProblems(other)).toEqual(["https://tonygreenberg.com/x: canonical is https://tonygreenberg.com/y"]);
    const none = inspectPage("https://tonygreenberg.com/x", 200, "<html></html>", null);
    expect(pageProblems(none)).toEqual(["https://tonygreenberg.com/x: canonical is missing"]);
  });

  it.each(["https://files.manuscdn.com/a.jpg", "/api/img/a.jpg", "/manus-storage/a.webp", "https://x.manus.space/"])(
    "flags a Manus address (%s)",
    (addr) => {
      const p = inspectPage("https://tonygreenberg.com/x", 200, page("/x", `<img src="${addr}"/>`), null);
      expect(pageProblems(p)).toEqual(["https://tonygreenberg.com/x: uses a Manus address"]);
    },
  );

  it("reports only the status for a page that doesn't load", () => {
    expect(pageProblems(inspectPage("https://tonygreenberg.com/gone", 404, "", null))).toEqual([
      "https://tonygreenberg.com/gone: status 404",
    ]);
  });
});

describe("mapLimit", () => {
  it("keeps order and never runs more than the limit at once", async () => {
    let running = 0;
    let peak = 0;
    const out = await mapLimit([1, 2, 3, 4, 5], 2, async (n) => {
      running++;
      peak = Math.max(peak, running);
      await new Promise((r) => setTimeout(r, 1));
      running--;
      return n * 10;
    });
    expect(out).toEqual([10, 20, 30, 40, 50]);
    expect(peak).toBe(2);
  });

  it("handles an empty list", async () => {
    expect(await mapLimit([], 4, async () => 1)).toEqual([]);
  });
});

describe("checkSite", () => {
  it("passes a healthy site and points sitemap addresses at the base", async () => {
    const fetchImpl = vi.fn(async (url: string) => {
      if (url.endsWith("/sitemap.xml")) return res(200, SITEMAP);
      if (url === IMG) return res(200);
      return res(200, page(new URL(url).pathname === "/" ? "/" : "/blog"));
    });
    const report = await checkSite("http://localhost:3000", fetchImpl);
    expect(report.problems).toEqual([]);
    expect(report.pages).toHaveLength(2);
    expect(report.images).toEqual([{ url: IMG, status: 200 }]);
    expect(fetchImpl).toHaveBeenCalledWith("http://localhost:3000/blog", { redirect: "follow" });
  });

  it("lists broken pages, broken images and failed requests", async () => {
    const fetchImpl = vi.fn(async (url: string) => {
      if (url.endsWith("/sitemap.xml")) return res(200, SITEMAP);
      if (url === IMG) throw new Error("offline");
      if (url.endsWith("/blog")) throw new Error("timeout");
      return res(500, page("/"));
    });
    const report = await checkSite("https://tonygreenberg.com", fetchImpl);
    expect(report.problems).toEqual([
      "https://tonygreenberg.com/: status 500",
      "https://tonygreenberg.com/blog: status 0",
      `${IMG}: image status 0`,
    ]);
  });

  it("flags an image that doesn't load", async () => {
    const fetchImpl = vi.fn(async (url: string) => {
      if (url.endsWith("/sitemap.xml")) return res(200, "<loc>https://tonygreenberg.com/</loc>");
      if (url === IMG) return res(404);
      return res(200, page("/"));
    });
    expect((await checkSite("https://tonygreenberg.com", fetchImpl)).problems).toEqual([`${IMG}: image status 404`]);
  });

  it("stops when the sitemap is missing or empty", async () => {
    const missing = await checkSite("https://tonygreenberg.com", async () => res(404));
    expect(missing.problems).toEqual(["sitemap.xml: status 404"]);
    const empty = await checkSite("https://tonygreenberg.com", async () => res(200, "<urlset/>"));
    expect(empty.problems).toEqual(["sitemap.xml: no addresses"]);
  });
});
