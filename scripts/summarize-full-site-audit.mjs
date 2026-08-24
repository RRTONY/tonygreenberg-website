import { readFile } from "node:fs/promises";

const report = JSON.parse(await readFile(new URL("../audit-reports/full-site-seo-audit.json", import.meta.url), "utf8"));
const grouped = Object.fromEntries(
  Object.keys(report.summary.issueCounts || {}).map((issue) => [
    issue,
    report.failures
      .filter((page) => page.issues.some((entry) => entry.split(":")[0] === issue))
      .map((page) => ({ path: page.path, issues: page.issues, canonical: page.canonical, ssrTextLength: page.ssrTextLength })),
  ]),
);

console.log(JSON.stringify({
  summary: report.summary,
  issueGroups: grouped,
  failedImages: report.failedImages,
}, null, 2));
