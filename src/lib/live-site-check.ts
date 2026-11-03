// Rules for the read-only live-site health check (scripts/check-live-site.ts).
// Written 2026-11-04 from the go-live QA in docs/ai/project_go_live_record.md:
// every sitemap page loads, none tells Google to stay away, each canonical
// points at itself, no page uses a Manus address, and every Sanity image loads.
// No network here: the caller passes `fetch`, so tests can fake it.

export const MANUS_PATTERN = /manuscdn\.com|\/manus-storage\/|\/api\/img\/|\.manus\.space/i;

const SANITY_IMAGE_PATTERN =
  /https:\/\/cdn\.sanity\.io\/images\/[a-z0-9]+\/[a-z0-9_-]+\/[A-Za-z0-9_-]+-\d+x\d+\.(?:jpe?g|png|webp|gif|svg|avif)/g;

export type PageReport = {
  url: string;
  status: number;
  noindex: boolean;
  canonical: string | null;
  canonicalOk: boolean;
  manus: boolean;
  images: string[];
};

export type ImageReport = { url: string; status: number };

export type SiteReport = {
  pages: PageReport[];
  images: ImageReport[];
  problems: string[];
};

type Fetch = (url: string, init?: { method?: string; redirect?: "follow" }) => Promise<{
  status: number;
  headers: { get(name: string): string | null };
  text(): Promise<string>;
}>;

/** Every <loc> in a sitemap, in order, without duplicates. */
export function sitemapUrls(xml: string): string[] {
  const urls = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  return [...new Set(urls)];
}

/** Same address ignoring a trailing slash and how accents are written (ú vs %C3%BA). */
export function sameAddress(a: string, b: string): boolean {
  const clean = (u: string) => new URL(u).toString().replace(/\/+$/, "");
  return clean(a) === clean(b);
}

/** What one page's HTML and headers say about indexing, canonical, Manus and images. */
export function inspectPage(
  url: string,
  status: number,
  html: string,
  robotsHeader: string | null,
): PageReport {
  const meta = html.match(/<meta[^>]+name="robots"[^>]+content="([^"]*)"/i)?.[1] ?? "";
  const noindex = /noindex/i.test(`${robotsHeader ?? ""} ${meta}`);
  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i)?.[1] ?? null;
  const canonicalOk = canonical !== null && sameAddress(new URL(canonical, url).toString(), url);
  const images = [...new Set(html.match(SANITY_IMAGE_PATTERN) ?? [])];
  return { url, status, noindex, canonical, canonicalOk, manus: MANUS_PATTERN.test(html), images };
}

/** Plain-language problems for one page, empty when it's fine. */
export function pageProblems(page: PageReport): string[] {
  if (page.status !== 200) return [`${page.url}: status ${page.status}`];
  const out: string[] = [];
  if (page.noindex) out.push(`${page.url}: in the sitemap but tells Google not to index it`);
  if (!page.canonicalOk) out.push(`${page.url}: canonical is ${page.canonical ?? "missing"}`);
  if (page.manus) out.push(`${page.url}: uses a Manus address`);
  return out;
}

/** Run `task` over `items` with at most `limit` at once, keeping order. */
export async function mapLimit<T, R>(items: T[], limit: number, task: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      results[i] = await task(items[i]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

/**
 * Check a whole site from its sitemap. `base` is the site to fetch (the live
 * domain or a local `pnpm start`); sitemap addresses are re-pointed at it.
 */
export async function checkSite(base: string, fetchImpl: Fetch, concurrency = 12): Promise<SiteReport> {
  const sitemap = await fetchImpl(new URL("/sitemap.xml", base).toString());
  if (sitemap.status !== 200) {
    return { pages: [], images: [], problems: [`sitemap.xml: status ${sitemap.status}`] };
  }
  const urls = sitemapUrls(await sitemap.text());
  if (urls.length === 0) return { pages: [], images: [], problems: ["sitemap.xml: no addresses"] };

  const pages = await mapLimit(urls, concurrency, async (listed) => {
    const path = new URL(listed);
    const target = new URL(path.pathname + path.search, base).toString();
    try {
      const res = await fetchImpl(target, { redirect: "follow" });
      const html = await res.text();
      // Judge the canonical against the address the sitemap lists.
      return inspectPage(listed, res.status, html, res.headers.get("x-robots-tag"));
    } catch {
      return inspectPage(listed, 0, "", null);
    }
  });

  const imageUrls = [...new Set(pages.flatMap((p) => p.images))];
  const images = await mapLimit(imageUrls, concurrency, async (url) => {
    try {
      return { url, status: (await fetchImpl(url, { method: "HEAD" })).status };
    } catch {
      return { url, status: 0 };
    }
  });

  const problems = [
    ...pages.flatMap(pageProblems),
    ...images.filter((i) => i.status !== 200).map((i) => `${i.url}: image status ${i.status}`),
  ];
  return { pages, images, problems };
}
