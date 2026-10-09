// Checks every tonygreenberg.com address Google has shown in search (Search
// Console, last 16 months) against a running copy of this site, following
// redirects, and lists the ones that end in anything but a 200. Read-only.
// Used 2026-10-09 to build src/lib/content/search-console-redirects.ts; run
// it again at DNS cutover against the real domain.
//
//   pnpm build && pnpm start      (in another terminal)
//   node --env-file=.env.local --import tsx scripts/check-search-console-urls.ts [base-url]
//
// base-url defaults to http://localhost:3000. Needs GOOGLE_GA_CLIENT_EMAIL /
// GOOGLE_GA_PRIVATE_KEY (the service account with Search Console access).
import { getGoogleAccessToken } from "../src/lib/admin/google-auth";

const SITE = "https://tonygreenberg.com/";

async function searchConsolePages(): Promise<Array<{ url: string; clicks: number; impressions: number }>> {
  const token = await getGoogleAccessToken("https://www.googleapis.com/auth/webmasters.readonly");
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 16);
  const day = (d: Date) => d.toISOString().slice(0, 10);
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ startDate: day(start), endDate: day(end), dimensions: ["page"], rowLimit: 25000 }),
    },
  );
  const json = (await res.json()) as {
    rows?: Array<{ keys: string[]; clicks: number; impressions: number }>;
    error?: { message: string };
  };
  if (json.error) throw new Error(json.error.message);
  return (json.rows ?? []).map((r) => ({ url: r.keys[0], clicks: r.clicks, impressions: r.impressions }));
}

async function finalStatus(base: string, path: string): Promise<{ status: string; hops: number; final: string }> {
  let url = new URL(path, base).toString();
  for (let hops = 0; hops < 6; hops++) {
    const res = await fetch(url, { redirect: "manual" });
    const location = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && location) {
      const next = new URL(location, url);
      if (next.origin !== new URL(base).origin) return { status: "external", hops: hops + 1, final: next.toString() };
      url = next.toString();
      continue;
    }
    return { status: String(res.status), hops, final: new URL(url).pathname };
  }
  return { status: "redirect loop", hops: 6, final: url };
}

async function main() {
  const base = process.argv[2] ?? "http://localhost:3000";
  const pages = await searchConsolePages();
  const problems: string[] = [];
  const counts: Record<string, number> = {};
  for (const page of pages) {
    const u = new URL(page.url);
    if (u.hostname !== "tonygreenberg.com" && u.hostname !== "www.tonygreenberg.com") continue;
    const { status, hops, final } = await finalStatus(base, u.pathname + u.search);
    counts[status] = (counts[status] ?? 0) + 1;
    if (status !== "200" && status !== "external") {
      problems.push(`${page.impressions}\t${page.clicks}\t${status}\t${u.pathname}${u.search}\t(${hops} hops, ends at ${final})`);
    }
  }
  console.log(`${pages.length} addresses from Search Console, checked against ${base}:`, counts);
  console.log("Not working (impressions, clicks, status, address):");
  for (const line of problems.sort((a, b) => Number(b.split("\t")[0]) - Number(a.split("\t")[0]))) console.log(line);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
