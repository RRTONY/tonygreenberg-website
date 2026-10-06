// One-off (2026-10-07): imports the two essays live has that were never in
// legacy's blogData.json or Sanity: `the-tollbooth-and-the-alternative`
// (co-written with Alex Veytsel, from RampRate's blog) and
// `what-quest-could-fix`. Text, dates, category, tags and the extra blocks
// were read from the live pages in a browser into a JSON file (path given as
// the first argument); the converter is the one the original import used.
// Tollbooth's 5 body images are broken on live itself (the image proxy serves
// a 1 KB dark placeholder with unreadable text for each), so they're left out
// and listed in BLOG-IMAGE-BRIEFS.md to be made. Heroes are already in Sanity
// (pass their asset ids in the data); Tollbooth's own hero was rescued the
// same day (image-c1e39e13...-1600x893-webp).
// Creates published posts (owner's choice 2026-10-07); re-running replaces them.
//
// Usage: pnpm tsx scripts/import-2026-10-07-live-only-essays.ts <data.json> [--dry-run]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "next-sanity";
import { markdownToPortableText } from "./markdown-to-portable-text";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.loadEnvFile(path.join(__dirname, "../.env.local"));

const DRY_RUN = process.argv.includes("--dry-run");
const dataPath = process.argv.slice(2).find((a) => !a.startsWith("--"));
if (!dataPath) throw new Error("Pass the scraped data JSON path.");

type Essay = {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  publishedAt: string;
  category: string;
  heroRef: string;
  byline?: string;
  formatTag?: string;
  validityScore?: string;
  validityLabel?: string;
  lesson?: string;
  nextSteps?: string[];
  tryThis?: { title: string; description: string };
  whereThisLeads?: { title: string; slug: string; reason: string }[];
  closingRiddle?: string;
  goDeeper?: string[];
  md: string;
};

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

let n = 0;
const key = () => `i${(n++).toString(36)}${Math.random().toString(36).slice(2, 8)}`;
const IMAGE_LINE = /^!\[([^\]]*)\]\(([^)]+)\)$/;

function bodyFor(e: Essay) {
  // Image lines are dropped (see above); everything else goes through the
  // original import's converter.
  const paras = e.md.split("\n\n");
  const kept = paras.filter((para) => !IMAGE_LINE.test(para.trim()));
  return { body: markdownToPortableText(kept.join("\n\n")), imageCount: paras.length - kept.length };
}

async function main() {
  const essays = JSON.parse(fs.readFileSync(dataPath!, "utf8")) as Essay[];
  const tx = client.transaction();
  for (const e of essays) {
    const { body, imageCount } = bodyFor(e);
    const doc = {
      _id: `post-${e.slug}`,
      _type: "post",
      title: e.title,
      slug: { _type: "slug", current: e.slug },
      excerpt: e.excerpt,
      author: { _type: "reference", _ref: "author-tony-greenberg" },
      category: { _type: "reference", _ref: e.category },
      tags: e.tags,
      publishedAt: e.publishedAt,
      heroImage: { _type: "image", asset: { _type: "reference", _ref: e.heroRef } },
      body,
      ...(e.byline && e.byline !== "Tony Greenberg" ? { byline: e.byline } : {}),
      ...(e.formatTag ? { formatTag: e.formatTag } : {}),
      ...(e.validityScore ? { validityScore: e.validityScore, validityLabel: e.validityLabel } : {}),
      ...(e.lesson ? { lesson: e.lesson } : {}),
      ...(e.nextSteps ? { nextSteps: e.nextSteps } : {}),
      ...(e.tryThis ? { tryThis: e.tryThis } : {}),
      ...(e.whereThisLeads
        ? { whereThisLeads: e.whereThisLeads.map((l) => ({ _key: key(), _type: "leadLink", title: l.title, href: `/blog/${l.slug}`, reason: l.reason })) }
        : {}),
      ...(e.closingRiddle ? { closingRiddle: e.closingRiddle } : {}),
      ...(e.goDeeper ? { goDeeper: e.goDeeper.map((title) => ({ _key: key(), _type: "goDeeperItem", title })) } : {}),
    };
    console.log(`${doc._id}: ${body.length} blocks (${imageCount} broken images left out)`);
    tx.createOrReplace(doc);
  }
  if (DRY_RUN) return console.log("[dry-run] nothing written");
  const res = await tx.commit();
  console.log(`committed ${res.transactionId}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
