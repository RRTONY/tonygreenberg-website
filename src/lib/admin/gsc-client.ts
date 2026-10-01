import {
  getGoogleAccessToken,
  getServiceAccountEmail,
} from "@/lib/admin/google-auth";

// Ported from ramprate-ui (2026-10-02), read-only here: the sitemap submit /
// delete calls were left out, so nothing in this file changes Search Console.
// Google Search Console via its REST APIs, authenticated as the same service
// account GA4 uses. The service account must be added as a user on each
// Search Console property (Settings -> Users and permissions); "Restricted"
// is enough for these reads. What the API does
// NOT offer at all (so no tool here can do it): "Request indexing" for normal
// pages, removals, manual actions, security issues, links, settings, users.
const WEBMASTERS_BASE = "https://www.googleapis.com/webmasters/v3";
const INSPECTION_URL =
  "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";
const READ_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

export const DEFAULT_SITE = "tonygreenberg.com";
export const GSC_DIMENSIONS = [
  "query",
  "page",
  "country",
  "device",
  "date",
  "searchAppearance",
] as const;
export const GSC_SEARCH_TYPES = [
  "web",
  "image",
  "video",
  "news",
  "discover",
  "googleNews",
] as const;
export const GSC_FILTER_OPERATORS = [
  "contains",
  "equals",
  "notContains",
  "notEquals",
  "includingRegex",
  "excludingRegex",
] as const;
const MAX_ROWS = 1000;
const MAX_INSPECT_URLS = 20;
// Search Console's own performance data lags ~2-3 days behind today.
const DATA_LAG_DAYS = 3;

type Dimension = (typeof GSC_DIMENSIONS)[number];

async function gscFetch<T>(
  url: string,
  scope: string,
  init: { method?: string; body?: unknown } = {},
): Promise<T> {
  const token = await getGoogleAccessToken(scope);
  const res = await fetch(url, {
    method: init.method ?? "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
  });
  if (res.status === 204) return {} as T;
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const message =
      typeof data?.error?.message === "string"
        ? data.error.message
        : `Search Console API error (${res.status})`;
    if (res.status === 403) {
      throw new Error(
        `${message} - add ${getServiceAccountEmail() ?? "the GOOGLE_GA_CLIENT_EMAIL service account"} as a user on this Search Console property (Settings -> Users and permissions).`,
      );
    }
    throw new Error(message);
  }
  return data as T;
}

export interface GscSite {
  siteUrl: string;
  permissionLevel: string;
}

export async function listSites(): Promise<GscSite[]> {
  const data = await gscFetch<{ siteEntry?: GscSite[] }>(
    `${WEBMASTERS_BASE}/sites`,
    READ_SCOPE,
  );
  return data.siteEntry ?? [];
}

// Accepts a property exactly as Search Console names it ("sc-domain:x.com",
// "https://x.com/") or a bare domain / URL, and maps the latter onto whichever
// property the service account can actually see - preferring the Domain
// property, since it covers every subdomain and protocol.
export function resolveSiteUrl(
  input: string | undefined,
  sites: GscSite[],
): string {
  const raw = (input ?? "").trim() || DEFAULT_SITE;
  const known = sites.map((s) => s.siteUrl);
  if (known.includes(raw)) return raw;

  const host = raw
    .replace(/^sc-domain:/i, "")
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .replace(/^www\./i, "")
    .toLowerCase();
  const candidates = [
    `sc-domain:${host}`,
    `https://${host}/`,
    `https://www.${host}/`,
    `http://${host}/`,
    `http://www.${host}/`,
  ];
  const match = candidates.find((c) => known.includes(c));
  if (match) return match;

  throw new Error(
    `No Search Console property for "${raw}" is visible to the service account. Visible properties: ${known.join(", ") || "none"}. Add ${getServiceAccountEmail() ?? "the service account"} as a user on that property first.`,
  );
}

async function resolveSite(input: string | undefined): Promise<string> {
  return resolveSiteUrl(input, await listSites());
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(date: string, n: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return isoDate(d);
}

export function performanceDateRange(
  opts: { days?: number; startDate?: string; endDate?: string },
  today = new Date(),
): {
  startDate: string;
  endDate: string;
  previous: { startDate: string; endDate: string };
} {
  const endDate = opts.endDate || addDays(isoDate(today), -DATA_LAG_DAYS);
  const days = opts.days && opts.days > 0 ? Math.floor(opts.days) : 28;
  const startDate = opts.startDate || addDays(endDate, -(days - 1));
  const length =
    Math.round(
      (Date.parse(`${endDate}T00:00:00Z`) -
        Date.parse(`${startDate}T00:00:00Z`)) /
        86_400_000,
    ) + 1;
  return {
    startDate,
    endDate,
    previous: {
      startDate: addDays(startDate, -length),
      endDate: addDays(startDate, -1),
    },
  };
}

export interface PerformanceRow {
  keys: Record<string, string>;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  change?: {
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  };
}

const EMPTY_ROW: PerformanceRow = {
  keys: {},
  clicks: 0,
  impressions: 0,
  ctr: 0,
  position: 0,
};

interface RawRow {
  keys?: string[];
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

function round(n: number, places = 2): number {
  const f = 10 ** places;
  return Math.round(n * f) / f;
}

function toRow(raw: RawRow, dimensions: Dimension[]): PerformanceRow {
  const keys: Record<string, string> = {};
  dimensions.forEach((d, i) => {
    keys[d] = raw.keys?.[i] ?? "";
  });
  return {
    keys,
    clicks: raw.clicks,
    impressions: raw.impressions,
    ctr: round(raw.ctr * 100),
    position: round(raw.position, 1),
  };
}

// Joins current-period rows with previous-period rows on their dimension
// values. Rows new this period compare against zero; position change is
// "previous - current" so a positive number always means "moved up".
export function mergeComparison(
  current: PerformanceRow[],
  previous: PerformanceRow[],
): PerformanceRow[] {
  const prevByKey = new Map(
    previous.map((r) => [JSON.stringify(r.keys), r] as const),
  );
  return current.map((row) => {
    const prev = prevByKey.get(JSON.stringify(row.keys));
    return {
      ...row,
      change: {
        clicks: row.clicks - (prev?.clicks ?? 0),
        impressions: row.impressions - (prev?.impressions ?? 0),
        ctr: round(row.ctr - (prev?.ctr ?? 0)),
        position: prev ? round(prev.position - row.position, 1) : 0,
      },
    };
  });
}

export interface PerformanceOptions {
  site?: string;
  days?: number;
  startDate?: string;
  endDate?: string;
  dimensions?: string[];
  rowLimit?: number;
  searchType?: string;
  filters?: Array<{ dimension: string; operator?: string; expression: string }>;
  compare?: boolean;
}

export async function getSearchPerformance(opts: PerformanceOptions) {
  const siteUrl = await resolveSite(opts.site);
  const range = performanceDateRange(opts);
  const dimensions = (
    opts.dimensions?.length ? opts.dimensions : ["query"]
  ).filter((d): d is Dimension =>
    (GSC_DIMENSIONS as readonly string[]).includes(d),
  );
  const rowLimit = Math.min(
    Math.max(Math.floor(opts.rowLimit ?? 25), 1),
    MAX_ROWS,
  );
  const searchType = (GSC_SEARCH_TYPES as readonly string[]).includes(
    opts.searchType ?? "",
  )
    ? opts.searchType
    : "web";
  const filters = (opts.filters ?? [])
    .filter((f) => f && f.dimension && f.expression)
    .map((f) => ({
      dimension: f.dimension,
      operator: (GSC_FILTER_OPERATORS as readonly string[]).includes(
        f.operator ?? "",
      )
        ? f.operator
        : "contains",
      expression: f.expression,
    }));

  const endpoint = `${WEBMASTERS_BASE}/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`;
  const query = (
    period: { startDate: string; endDate: string },
    dims: Dimension[],
    limit: number,
  ) =>
    gscFetch<{ rows?: RawRow[] }>(endpoint, READ_SCOPE, {
      method: "POST",
      body: {
        startDate: period.startDate,
        endDate: period.endDate,
        dimensions: dims,
        rowLimit: limit,
        type: searchType,
        dataState: "all",
        ...(filters.length ? { dimensionFilterGroups: [{ filters }] } : {}),
      },
    }).then((d) => (d.rows ?? []).map((r) => toRow(r, dims)));

  const [rows, totals, prevRows, prevTotals] = await Promise.all([
    query(range, dimensions, rowLimit),
    query(range, [], 1),
    opts.compare
      ? query(range.previous, dimensions, MAX_ROWS)
      : Promise.resolve(null),
    opts.compare ? query(range.previous, [], 1) : Promise.resolve(null),
  ]);

  const total = totals[0] ?? EMPTY_ROW;
  return {
    siteUrl,
    searchType,
    period: { startDate: range.startDate, endDate: range.endDate },
    ...(opts.compare ? { previousPeriod: range.previous } : {}),
    dimensions,
    filters,
    totals: prevTotals
      ? mergeComparison([total], [prevTotals[0] ?? EMPTY_ROW])[0]
      : total,
    rowCount: rows.length,
    rows: opts.compare && prevRows ? mergeComparison(rows, prevRows) : rows,
    note: "Search Console data lags ~2-3 days; the most recent days may still be partial.",
  };
}

interface InspectionResult {
  inspectionResult?: {
    inspectionResultLink?: string;
    indexStatusResult?: {
      verdict?: string;
      coverageState?: string;
      robotsTxtState?: string;
      indexingState?: string;
      lastCrawlTime?: string;
      pageFetchState?: string;
      googleCanonical?: string;
      userCanonical?: string;
      crawledAs?: string;
      sitemap?: string[];
      referringUrls?: string[];
    };
    mobileUsabilityResult?: {
      verdict?: string;
      issues?: Array<{ message?: string }>;
    };
    richResultsResult?: {
      verdict?: string;
      detectedItems?: Array<{
        richResultType?: string;
        items?: Array<{
          issues?: Array<{ issueMessage?: string; severity?: string }>;
        }>;
      }>;
    };
  };
}

export async function inspectUrls(
  siteInput: string | undefined,
  urls: string[],
) {
  const siteUrl = await resolveSite(siteInput);
  const list = urls
    .map((u) => String(u).trim())
    .filter(Boolean)
    .slice(0, MAX_INSPECT_URLS);

  const results = await Promise.all(
    list.map(async (url) => {
      try {
        const data = await gscFetch<InspectionResult>(
          INSPECTION_URL,
          READ_SCOPE,
          {
            method: "POST",
            body: { inspectionUrl: url, siteUrl, languageCode: "en-US" },
          },
        );
        const r = data.inspectionResult ?? {};
        const idx = r.indexStatusResult ?? {};
        return {
          url,
          verdict: idx.verdict,
          coverageState: idx.coverageState,
          indexingState: idx.indexingState,
          robotsTxtState: idx.robotsTxtState,
          pageFetchState: idx.pageFetchState,
          lastCrawlTime: idx.lastCrawlTime,
          crawledAs: idx.crawledAs,
          googleCanonical: idx.googleCanonical,
          userCanonical: idx.userCanonical,
          canonicalMismatch:
            !!idx.googleCanonical &&
            !!idx.userCanonical &&
            idx.googleCanonical !== idx.userCanonical,
          sitemaps: idx.sitemap ?? [],
          referringUrls: (idx.referringUrls ?? []).slice(0, 5),
          mobileUsability: r.mobileUsabilityResult?.verdict,
          mobileIssues: (r.mobileUsabilityResult?.issues ?? []).map(
            (i) => i.message,
          ),
          richResults: r.richResultsResult
            ? {
                verdict: r.richResultsResult.verdict,
                types: (r.richResultsResult.detectedItems ?? []).map((d) => ({
                  type: d.richResultType,
                  issues: (d.items ?? []).flatMap((i) =>
                    (i.issues ?? []).map(
                      (x) => `${x.severity}: ${x.issueMessage}`,
                    ),
                  ),
                })),
              }
            : undefined,
          searchConsoleLink: r.inspectionResultLink,
        };
      } catch (err) {
        return {
          url,
          error: err instanceof Error ? err.message : "Inspection failed",
        };
      }
    }),
  );

  return {
    siteUrl,
    inspected: results.length,
    ...(urls.length > MAX_INSPECT_URLS
      ? {
          note: `Only the first ${MAX_INSPECT_URLS} URLs were inspected (Google allows ~2,000 inspections/day per property).`,
        }
      : {}),
    results,
  };
}

interface RawSitemap {
  path: string;
  lastSubmitted?: string;
  lastDownloaded?: string;
  isPending?: boolean;
  isSitemapsIndex?: boolean;
  warnings?: string;
  errors?: string;
  contents?: Array<{ type?: string; submitted?: string; indexed?: string }>;
}

export async function listSitemaps(siteInput: string | undefined) {
  const siteUrl = await resolveSite(siteInput);
  const data = await gscFetch<{ sitemap?: RawSitemap[] }>(
    `${WEBMASTERS_BASE}/sites/${encodeURIComponent(siteUrl)}/sitemaps`,
    READ_SCOPE,
  );
  return {
    siteUrl,
    sitemaps: (data.sitemap ?? []).map((s) => ({
      path: s.path,
      lastSubmitted: s.lastSubmitted,
      lastDownloaded: s.lastDownloaded,
      isPending: s.isPending ?? false,
      isIndex: s.isSitemapsIndex ?? false,
      errors: Number(s.errors ?? 0),
      warnings: Number(s.warnings ?? 0),
      contents: (s.contents ?? []).map((c) => ({
        type: c.type,
        submitted: Number(c.submitted ?? 0),
      })),
    })),
  };
}
