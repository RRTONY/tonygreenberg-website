// One-off (2026-10-07): the two "video moments" legacy BlogPost.tsx shows
// under an essay (ArticleVideo), set on each post's `videoMoment` field.
// Clarisse's clip is rescued off the legacy media host here; the FRQNCY bus
// tour was rescued earlier (scripts/rescue-manus-media.ts). Captions are
// legacy's. Writes the published posts (owner's choice 2026-10-07).
//
// Usage: pnpm tsx scripts/rescue-2026-10-07-essay-videos.ts [--dry-run]
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "next-sanity";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.loadEnvFile(path.join(__dirname, "../.env.local"));

const DRY_RUN = process.argv.includes("--dry-run");
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const CLARISSE_SOURCE = "https://tonygreenberg.com/api/media/clarisse-painting-moment_d338c917.mp4";
const FRQNCY_ASSET = "file-d334cc864e3b80c605211468cf5f6846a021aad0-mov";

async function main() {
  if (DRY_RUN) return console.log(`[dry-run] would upload ${CLARISSE_SOURCE} and set 2 posts`);
  const res = await fetch(CLARISSE_SOURCE);
  if (!res.ok) throw new Error(`${res.status} fetching ${CLARISSE_SOURCE}`);
  const clarisse = await client.assets.upload("file", Buffer.from(await res.arrayBuffer()), {
    filename: "clarisse-painting-moment.mp4",
    contentType: "video/mp4",
  });
  console.log("clarisse video:", clarisse.url);
  const file = (ref: string) => ({ _type: "file", asset: { _type: "reference", _ref: ref } });
  await client
    .transaction()
    .patch("post-is-that-a-lot-clarisse-abelarde", (p) =>
      p.set({ videoMoment: { file: file(clarisse._id), caption: "Clarisse, behind the bars the algorithm built. The platform restricts. The artist persists." } }),
    )
    .patch("post-frqncy-the-bus-that-restores-the-world", (p) =>
      p.set({
        videoMoment: {
          file: file(FRQNCY_ASSET),
          caption: "Inside the BioFRQNCY Bus — where red light, sound, and electromagnetic fields converge into a single coherent protocol.",
        },
      }),
    )
    .commit();
  console.log("set videoMoment on 2 posts");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
