// One-off (2026-10-02): moves every image the code loads from
// d2xsxph8kpxj0f.cloudfront.net into Sanity. Older notes call that host
// "RampRate's own CloudFront" (an S3 copy of the Manus storage, files dated
// 2026-08-25), but every file sits under the legacy Manus app's project folder
// (310519663242884547/gXhndHxpF4hLjcgkrqbdCP/, as in
// tonygreenb-gxhndhxp.manus.space) and nobody here could confirm who owns the
// bucket. CONTRIBUTING.md says every content image lives in Sanity regardless,
// so they move there and the host leaves images.remotePatterns.
//
// Finds every URL on that host under src/, downloads it, uploads it as a
// Sanity image asset (Sanity dedupes by SHA-1, so re-running is safe),
// rewrites the URL in place in the source file, and prints a Markdown table
// for docs/ai/manus-media-rescue.md. Nothing is published or drafted: these
// are assets plus code edits.
//
// Usage: pnpm tsx scripts/rescue-cloudfront-images.ts [--dry-run]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "next-sanity";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
process.loadEnvFile(path.join(ROOT, ".env.local"));

const DRY_RUN = process.argv.includes("--dry-run");
const HOST_RE = /https:\/\/d2xsxph8kpxj0f\.cloudfront\.net\/[^"'`\s)]+/g;

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return /\.(ts|tsx)$/.test(e.name) ? [p] : [];
  });
}

async function main() {
  const files = walk(path.join(ROOT, "src"));
  const usedIn = new Map<string, Set<string>>();
  for (const file of files) {
    for (const url of fs.readFileSync(file, "utf8").match(HOST_RE) ?? []) {
      if (!usedIn.has(url)) usedIn.set(url, new Set());
      usedIn.get(url)!.add(path.relative(ROOT, file));
    }
  }
  console.log(`${usedIn.size} unique images in ${new Set([...usedIn.values()].flatMap((s) => [...s])).size} files`);

  const map = new Map<string, string>();
  const failed: string[] = [];
  for (const url of usedIn.keys()) {
    const filename = decodeURIComponent(url.split("/").pop()!);
    if (DRY_RUN) {
      console.log(`would upload ${filename}`);
      continue;
    }
    const res = await fetch(url);
    if (!res.ok) {
      failed.push(`${url} (HTTP ${res.status})`);
      continue;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    const asset = await writeClient.assets.upload("image", buffer, { filename });
    map.set(url, asset.url);
    console.log(`${filename} -> ${asset.url}`);
  }
  if (DRY_RUN) return;

  for (const file of files) {
    const before = fs.readFileSync(file, "utf8");
    const after = before.replace(HOST_RE, (url) => map.get(url) ?? url);
    if (after !== before) fs.writeFileSync(file, after);
  }

  console.log("\n| File | Used in | Sanity URL |\n| --- | --- | --- |");
  for (const [url, sanityUrl] of map) {
    console.log(`| \`${decodeURIComponent(url.split("/").pop()!)}\` | ${[...usedIn.get(url)!].map((f) => `\`${f}\``).join(", ")} | ${sanityUrl} |`);
  }
  if (failed.length) console.log(`\nNOT rescued (left in place):\n${failed.join("\n")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
