// One-off (2026-10-01): brings the essays Tony's team rewrote on the live
// legacy site (tonygreenberg.com) into Sanity, as **drafts**. Found by
// comparing every post's body text with live (after the table fix in
// restore-blog-tables.ts, and ignoring live's leftover WordPress furniture
// that fix-blog-body-links.ts already cleaned out of our copies).
//
// Input: a JSON file of live essay bodies, extracted in a headless browser
// from each post's `.tg-editorial-reader` (or `.package-prose`) element:
//   { [slug]: ({ type: "block", style, listItem?, spans: {text, marks}[] }
//             | { type: "image", src, alt, caption }
//             | { type: "table", rows: string[][] })[] }
// Link marks arrive as "link:<href>". The extractor is not in the repo (it
// needs Playwright, which isn't a dependency); its output shape is above.
//
// PLAN says what to do per post:
// - "replace": the body becomes live's body (whole essay rewritten on live).
//   `keepTailFrom` keeps our draft's blocks from the one starting with that
//   text to the end (live still has a broken author bio we fixed).
// - "add": only live's new passages are added (`prepend` / `appendFrom`),
//   the rest of our body stays as it is.
// Live images are downloaded and uploaded to Sanity (zero-Manus rule); links
// to pages this site doesn't have are dropped (`DROP_LINKS`), keeping the text.
//
// Usage: pnpm tsx scripts/sync-live-essays.ts <live-essays.json>          (dry run)
//        pnpm tsx scripts/sync-live-essays.ts <live-essays.json> --write  (saves drafts)
import path from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createClient } from "next-sanity";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.loadEnvFile(path.join(__dirname, "../.env.local"));

const WRITE = process.argv.includes("--write");
const INPUT = process.argv.slice(2).find((a) => !a.startsWith("--"));
if (!INPUT) throw new Error("usage: sync-live-essays.ts <live-essays.json> [--write]");

type Plan =
  | { mode: "replace"; keepTailFrom?: string }
  | { mode: "add"; prepend?: { heading: string; text: string }; appendFrom?: string };

const PLAN: Record<string, Plan> = {
  "your-blood-lies-without-your-dna": { mode: "replace" },
  "energy-is-money-money-is-memory": { mode: "replace", keepTailFrom: "Tony Greenberg is Founder and CEO of" },
  "the-way-of-dao": { mode: "replace" },
  "what-solutions-are-best-built-with-blockchain": { mode: "replace" },
  "the-peptide-truth-65m-fraud-industry-vs-life-changing-medicine": {
    mode: "add",
    // Shown above the essay on live (outside its body container).
    prepend: {
      heading: "Provenance and Corrections",
      text: "This is an opinionated account that separates Tony’s direct experience from linked reporting or documentation where available. If a factual detail is wrong, incomplete, or inconsistent with the record, send the source to tony@impactsoul.is. Verified corrections are added without changing the stated opinion.",
    },
    appendFrom: "Appendix: Stem Cells, Hope, and the Work of Knowing",
  },
};

// `/the-stack` is a "Private review draft" page on live, not ported.
const DROP_LINKS = new Set(["/the-stack"]);

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

type LiveBlock =
  | { type: "block"; style: string; listItem?: "bullet" | "number"; spans: { text: string; marks: string[] }[] }
  | { type: "image"; src: string; alt: string; caption: string }
  | { type: "table"; rows: string[][] };

type PtBlock = { _type: string; _key: string; [k: string]: unknown };

let n = 0;
const key = (p: string) => `${p}${(n++).toString(36)}`;

const plain = (b: LiveBlock) =>
  b.type === "block" ? b.spans.map((s) => s.text).join("").replace(/\s+/g, " ").trim() : "";

// Live draws list markers as separate "1." lines and "✦" glyphs, and wraps
// quotes in "✦ ✦ ✦" ornaments. Fold those back into real list items and drop
// the ornaments and field labels ("Reference") that only live's layout uses.
function tidy(blocks: LiveBlock[]): LiveBlock[] {
  const out: LiveBlock[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type !== "block") {
      out.push(b);
      continue;
    }
    const text = plain(b);
    if (/^\d+\.$/.test(text) && blocks[i + 1]?.type === "block") {
      const next = blocks[i + 1] as Extract<LiveBlock, { type: "block" }>;
      out.push({ ...next, listItem: "number", spans: stripLead(next.spans, /^\s*\d+\\?\.\s*/) });
      i += 1;
      continue;
    }
    if (text === "Reference" && blocks[i + 1]?.type === "table") continue;
    if (text.startsWith("✦")) {
      out.push({ ...b, listItem: "bullet", spans: stripLead(b.spans, /^\s*✦\s*(\d+\\?\.\s*)?/) });
      continue;
    }
    out.push({ ...b, spans: b.spans.map((s) => ({ ...s, text: s.text.replace(/✦ ✦ ✦/g, "") })) });
  }
  return out;
}

function stripLead(spans: { text: string; marks: string[] }[], re: RegExp) {
  const copy = spans.map((s) => ({ ...s }));
  const first = copy.find((s) => s.text.trim());
  if (first) first.text = first.text.replace(re, "");
  return copy;
}

const imageCache = new Map<string, string>();
async function uploadImage(src: string, slug: string) {
  if (imageCache.has(src)) return imageCache.get(src)!;
  const res = await fetch(src);
  if (!res.ok) throw new Error(`fetch ${src} -> HTTP ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const name = decodeURIComponent(new URL(src).pathname.split("/").pop() || slug);
  const asset = await client.assets.upload("image", buffer, { filename: name });
  imageCache.set(src, asset._id);
  return asset._id;
}

async function toPortable(blocks: LiveBlock[], slug: string): Promise<PtBlock[]> {
  const out: PtBlock[] = [];
  for (const b of tidy(blocks)) {
    if (b.type === "table") {
      out.push({
        _type: "dataTable",
        _key: key("t"),
        rows: b.rows.map((cells) => ({ _type: "row", _key: key("r"), cells })),
      });
      continue;
    }
    if (b.type === "image") {
      const caption = b.caption.replace(/^\*+|\*+$/g, "").trim();
      const ref = WRITE ? await uploadImage(b.src, slug) : `image-(dry-run)`;
      out.push({ _type: "image", _key: key("i"), alt: b.alt || caption, ...(caption ? { caption } : {}), asset: { _type: "reference", _ref: ref } });
      continue;
    }
    const markDefs: { _key: string; _type: "link"; href: string }[] = [];
    const hrefKey = new Map<string, string>();
    const children = b.spans
      .filter((s) => s.text)
      .map((s) => ({
        _type: "span",
        _key: key("s"),
        text: s.text.replace(/ /g, " "),
        marks: s.marks.flatMap((m) => {
          if (!m.startsWith("link:")) return [m];
          const href = m.slice(5);
          if (DROP_LINKS.has(href.split("#")[0])) return [];
          if (!hrefKey.has(href)) {
            const k = key("l");
            hrefKey.set(href, k);
            markDefs.push({ _key: k, _type: "link", href });
          }
          return [hrefKey.get(href)!];
        }),
      }));
    if (!children.some((c) => c.text.trim())) continue;
    // Trim edge whitespace so paragraphs don't open or close with a space.
    children[0].text = children[0].text.replace(/^\s+/, "");
    children[children.length - 1].text = children[children.length - 1].text.replace(/\s+$/, "");
    out.push({
      _type: "block",
      _key: key("b"),
      style: b.style,
      ...(b.listItem ? { listItem: b.listItem, level: 1 } : {}),
      children,
      markDefs,
    });
  }
  return out;
}

const blockText = (b: PtBlock) =>
  ((b.children as { text?: string }[] | undefined) ?? []).map((c) => c.text ?? "").join("");

async function run() {
  const live: Record<string, LiveBlock[] | null> = JSON.parse(readFileSync(path.resolve(INPUT!), "utf8"));

  for (const [slug, plan] of Object.entries(PLAN)) {
    const liveBlocks = live[slug];
    if (!liveBlocks?.length) {
      console.log(`${slug}: no live body in input, skipping`);
      continue;
    }
    const docs = await client.fetch<({ _id: string; body?: PtBlock[] } & Record<string, unknown>)[]>(
      `*[_type == "post" && slug.current == $slug]`,
      { slug },
      { perspective: "raw" },
    );
    const doc = docs.find((d) => d._id.startsWith("drafts.")) ?? docs.find((d) => !d._id.startsWith("drafts."));
    if (!doc?.body) {
      console.log(`${slug}: not in Sanity, skipping`);
      continue;
    }

    let body: PtBlock[];
    if (plan.mode === "replace") {
      let source = liveBlocks;
      let tail: PtBlock[] = [];
      if (plan.keepTailFrom) {
        const cut = liveBlocks.findIndex((b) => plain(b).startsWith(plan.keepTailFrom!));
        const ours = doc.body.findIndex((b) => blockText(b).startsWith(plan.keepTailFrom!));
        if (cut !== -1 && ours !== -1) {
          source = liveBlocks.slice(0, cut);
          tail = doc.body.slice(ours);
        }
      }
      body = [...(await toPortable(source, slug)), ...tail];
    } else {
      body = [...doc.body];
      if (plan.appendFrom && !doc.body.some((b) => blockText(b).startsWith(plan.appendFrom!))) {
        const from = liveBlocks.findIndex((b) => plain(b).startsWith(plan.appendFrom!));
        if (from !== -1) body.push(...(await toPortable(liveBlocks.slice(from), slug)));
      }
      if (plan.prepend && !doc.body.some((b) => blockText(b) === plan.prepend!.heading)) {
        body.unshift(
          ...(await toPortable(
            [
              { type: "block", style: "h4", spans: [{ text: plan.prepend.heading, marks: [] }] },
              { type: "block", style: "normal", spans: [{ text: plan.prepend.text, marks: ["em"] }] },
            ],
            slug,
          )),
        );
      }
    }

    const counts = (b: PtBlock[]) =>
      `${b.filter((x) => x._type === "block").length} text, ${b.filter((x) => x._type === "image").length} images, ${b.filter((x) => x._type === "dataTable").length} tables`;
    const from = doc._id.startsWith("drafts.") ? "existing draft" : "published";
    console.log(`\n${slug} [${plan.mode}] from ${from}:\n  before: ${counts(doc.body)}\n  after:  ${counts(body)}`);

    if (WRITE) {
      const baseId = doc._id.replace(/^drafts\./, "");
      const { _rev, _createdAt, _updatedAt, ...rest } = doc;
      void _rev;
      void _createdAt;
      void _updatedAt;
      await client.createOrReplace({ ...rest, _id: `drafts.${baseId}`, _type: "post", body } as never);
      console.log(`  → saved drafts.${baseId}`);
    }
  }
  if (!WRITE) console.log(`\nDry run. Re-run with --write to save drafts.`);
}

run();
