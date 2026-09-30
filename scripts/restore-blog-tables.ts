// One-off (2026-10-01): puts back the markdown tables the Phase 5 migration
// dropped. markdown-to-portable-text.ts had no "table" case, so every table in
// legacy blogData.json's `originalContent` (18 posts) silently vanished, while
// live still shows them. Found by comparing every post's body text with live.
//
// For each table, the block just before it in the legacy markdown (a paragraph
// or heading) is the anchor: the table is inserted after the Sanity block with
// the same text. If that block isn't found, the block just after the table is
// tried (insert before it). Anything still unplaced is reported, not guessed.
//
// Every change is a **draft** (`drafts.<post id>`), never the published post;
// an existing draft (e.g. from restore-blog-body-images.ts or
// fix-blog-body-links.ts) is built on, not replaced. Posts whose body already
// has a table are skipped, so re-running is safe.
//
// Usage: pnpm tsx scripts/restore-blog-tables.ts          (dry run, prints the plan)
//        pnpm tsx scripts/restore-blog-tables.ts --write  (saves the drafts)
import path from "node:path";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { marked, type Token, type Tokens } from "marked";
import { createClient } from "next-sanity";
import { tableTokenToBlock, type TableBlock } from "./markdown-to-portable-text";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.loadEnvFile(path.join(__dirname, "../.env.local"));

const WRITE = process.argv.includes("--write");

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

type LegacyPost = { slug: string; originalContent?: string; updatedContent?: string };
type BodyBlock = { _type: string; _key: string; children?: { text?: string }[] };
type PostDoc = { _id: string; body?: BodyBlock[]; [k: string]: unknown };

const legacy: LegacyPost[] = JSON.parse(
  readFileSync(path.join(__dirname, "../_legacy-manus-app/client/src/data/blogData.json"), "utf8"),
);

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

// Plain text of a markdown token, close enough to match the migrated block.
function tokenText(token: Token): string {
  if ("tokens" in token && Array.isArray(token.tokens)) return token.tokens.map(tokenText).join("");
  return "text" in token && typeof token.text === "string" ? token.text : "";
}

function blockText(b: BodyBlock) {
  return (b.children ?? []).map((c) => c.text ?? "").join("");
}

// Searches forward from `from` first, so a heading that repeats in a post
// ("Efficacy of alternatives" once per substance) matches the right one.
function findBlock(body: BodyBlock[], text: string, from = 0) {
  const want = norm(text).slice(0, 80);
  if (want.length < 8) return -1;
  const match = (b: BodyBlock) => b._type === "block" && norm(blockText(b)).startsWith(want);
  const ahead = body.slice(from).findIndex(match);
  return ahead !== -1 ? from + ahead : body.findIndex(match);
}

async function run() {
  let saved = 0;
  const unplaced: string[] = [];

  for (const post of legacy) {
    const markdown = post.originalContent || post.updatedContent || "";
    const tokens = marked.lexer(markdown).filter((t) => t.type !== "space");
    if (!tokens.some((t) => t.type === "table")) continue;

    const docs = await client.fetch<PostDoc[]>(
      `*[_type == "post" && slug.current == $slug]`,
      { slug: post.slug },
      { perspective: "raw" },
    );
    const doc = docs.find((d) => d._id.startsWith("drafts.")) ?? docs.find((d) => !d._id.startsWith("drafts."));
    if (!doc?.body) {
      console.log(`${post.slug}: not in Sanity, skipping`);
      continue;
    }
    if (doc.body.some((b) => b._type === "dataTable")) {
      console.log(`${post.slug}: already has tables, skipping`);
      continue;
    }

    const body: (BodyBlock | TableBlock)[] = [...doc.body];
    const placed: string[] = [];
    let cursor = 0;
    tokens.forEach((token, i) => {
      if (token.type !== "table") return;
      const table = tableTokenToBlock(token as Tokens.Table);
      table._key = `tbl${i}${post.slug.length}`;
      const header = table.rows[0].cells.join(" | ");

      // Anchor on the nearest non-table neighbour before, else after.
      const before = tokens.slice(0, i).reverse().find((t) => t.type !== "table" && tokenText(t).trim());
      const after = tokens.slice(i + 1).find((t) => t.type !== "table" && tokenText(t).trim());
      const current = body as BodyBlock[];
      let at = before ? findBlock(current, tokenText(before), cursor) : -1;
      if (at !== -1) {
        // Keep consecutive tables in source order.
        while (body[at + 1]?._type === "dataTable") at += 1;
        body.splice(at + 1, 0, table);
        cursor = at + 2;
        placed.push(`after "${tokenText(before!).slice(0, 50)}" -> ${header.slice(0, 60)}`);
        return;
      }
      at = after ? findBlock(current, tokenText(after), cursor) : -1;
      if (at !== -1) {
        body.splice(at, 0, table);
        cursor = at + 1;
        placed.push(`before "${tokenText(after!).slice(0, 50)}" -> ${header.slice(0, 60)}`);
        return;
      }
      unplaced.push(`${post.slug}: ${header.slice(0, 80)}`);
    });

    if (!placed.length) continue;
    const from = doc._id.startsWith("drafts.") ? "existing draft" : "published";
    console.log(`\n${post.slug} (${placed.length} tables, from ${from}):`);
    placed.forEach((p) => console.log(`  ${p}`));

    if (WRITE) {
      const baseId = doc._id.replace(/^drafts\./, "");
      const { _rev, _createdAt, _updatedAt, ...rest } = doc;
      void _rev;
      void _createdAt;
      void _updatedAt;
      await client.createOrReplace({ ...rest, _id: `drafts.${baseId}`, _type: "post", body } as never);
      console.log(`  → saved drafts.${baseId}`);
      saved += 1;
    }
  }

  if (unplaced.length) {
    console.log(`\nCould not place (no matching neighbour block):`);
    unplaced.forEach((u) => console.log(`  ${u}`));
  }
  console.log(WRITE ? `\nSaved ${saved} drafts.` : `\nDry run. Re-run with --write to save drafts.`);
}

run();
