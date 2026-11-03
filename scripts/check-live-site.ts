// Read-only health check of a running copy of the site, from its sitemap:
// every page loads (200), none says noindex, each canonical points at itself,
// no Manus addresses, every Sanity image loads. Prints a summary and any
// problems; exits 1 if there are problems. Rules: src/lib/live-site-check.ts.
//
//   node --import tsx scripts/check-live-site.ts [base-url]
//
// base-url defaults to https://tonygreenberg.com. For a local build:
// `pnpm build && pnpm start`, then pass http://localhost:3000.
// Run after a big merge, a DNS change, or when a report says the site is broken.
import { checkSite } from "../src/lib/live-site-check";

const base = process.argv[2] ?? "https://tonygreenberg.com";

async function main() {
  const report = await checkSite(base, (url, init) => fetch(url, init));
  const ok = report.pages.filter((p) => p.status === 200).length;
  const imagesOk = report.images.filter((i) => i.status === 200).length;

  console.log(`Checked ${base}`);
  console.log(`Pages: ${ok} of ${report.pages.length} load`);
  console.log(`Images: ${imagesOk} of ${report.images.length} load`);
  if (report.problems.length === 0) {
    console.log("No problems found.");
  } else {
    console.log(`${report.problems.length} problem(s):`);
    for (const p of report.problems) console.log(`- ${p}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
