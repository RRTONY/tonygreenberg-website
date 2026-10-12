// One-off (2026-10-13, owner: "you can create new image if it's broken"): adds
// the 5 in-body pictures of /blog/the-tollbooth-and-the-alternative, drawn by
// scripts/generate-tollbooth-art.mjs (live's own are broken). Each goes after
// the same paragraph as on live, with live's alt text as alt and caption (live
// shows it as the caption too). Saved as a **draft**; skips a picture whose
// alt text is already in the body, so a re-run adds nothing twice.
//
// Usage: pnpm tsx scripts/add-tollbooth-art-2026-10-13.ts <dir> [--dry-run]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "next-sanity";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.loadEnvFile(path.join(__dirname, "../.env.local"));

const DRY_RUN = process.argv.includes("--dry-run");
const dir = process.argv.slice(2).find((a) => !a.startsWith("--"));
if (!dir) throw new Error("Usage: add-tollbooth-art-2026-10-13.ts <dir> [--dry-run]");

const SLUG = "the-tollbooth-and-the-alternative";

// file, the start of the paragraph it follows on live, live's alt text
const ART: [string, string, string][] = [
  [
    "tollbooth-1-tollbooth.jpg",
    "KYC and legal presence exist for legitimate reasons",
    "Illustration of a tollbooth operator collecting coins from rowboats while superyachts pass freely through, representing unequal access to payment rails",
  ],
  [
    "tollbooth-2-maze.jpg",
    "Sanctions lists are at least public.",
    "Isometric illustration of a person lost in a maze of filing cabinets with a single red door, representing opaque de-risking decisions with no appeal",
  ],
  [
    "tollbooth-3-unbanked.jpg",
    "Then there's the customer who gets excluded",
    "World map made of human figures connecting to a single empty chair, representing the 1.3 billion adults excluded from the formal financial system",
  ],
  [
    "tollbooth-4-dials.jpg",
    "What's actually new is programmability.",
    "Illustration of a hand configuring dials on a circuit-covered dial pad, representing the programmable design choices behind a stablecoin",
  ],
  [
    "tollbooth-5-open-rails.jpg",
    "Go a step further, and transparency lets you price for social cost",
    "Split illustration of a traveler blocked by a winding road of tollbooth barriers on one side, and two people meeting freely in an open green space on the other",
  ],
];

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

type Block = { _type: string; _key: string; alt?: string; children?: { text?: string }[] };

// Live's text uses curly apostrophes in places; compare without them.
const norm = (s: string) => s.replace(/[’‘]/g, "'").replace(/\s+/g, " ").trim();
const text = (b: Block) => norm((b.children ?? []).map((c) => c.text ?? "").join(""));

async function run() {
  const docs = await client.fetch<({ _id: string; body: Block[] } & Record<string, unknown>)[]>(
    `*[_type == "post" && slug.current == $slug]`,
    { slug: SLUG },
    { perspective: "raw" },
  );
  const doc = docs.find((d) => d._id.startsWith("drafts.")) ?? docs.find((d) => !d._id.startsWith("drafts."));
  if (!doc) throw new Error(`${SLUG}: no post`);
  const body = [...doc.body];

  for (const [file, after, alt] of ART) {
    if (body.some((b) => b._type === "image" && b.alt === alt)) {
      console.log(`skip ${file}: already in the body`);
      continue;
    }
    const at = body.findIndex((b) => b._type === "block" && text(b).startsWith(norm(after)));
    if (at === -1) throw new Error(`${file}: paragraph "${after}" not found`);
    if (DRY_RUN) {
      console.log(`[dry] ${file} after block ${at}: "${after}"`);
      continue;
    }
    const asset = await client.assets.upload("image", fs.readFileSync(path.join(dir!, file)), { filename: file });
    body.splice(at + 1, 0, {
      _type: "image",
      _key: `toll${ART.findIndex((a) => a[0] === file)}`,
      alt,
      caption: alt,
      asset: { _type: "reference", _ref: asset._id },
    } as Block);
    console.log(`add  ${file} after block ${at} <- ${asset._id}`);
  }

  if (DRY_RUN) return;
  const baseId = doc._id.replace(/^drafts\./, "");
  const { _rev, _createdAt, _updatedAt, ...rest } = doc;
  void _rev;
  void _createdAt;
  void _updatedAt;
  await client.createOrReplace({ ...rest, _id: `drafts.${baseId}`, _type: "post", body } as never);
  console.log(`saved drafts.${baseId} (${body.length} blocks)`);
}

run();
