// One-off (2026-10-07): rescues the peptide-page images live still serves
// only from the old Manus host (/api/img/): the /peptide-watch hero
// background and its 11 section banners, and the hero backgrounds of
// /peptide-matrix, /peptide-hall-of-shame and /peptide-supply-chain. Each was
// downloaded and looked at first (all real art, no placeholders). Uploads the
// assets to Sanity only (zero-Manus rule); no document is changed. Prints the
// Sanity URLs to wire into the pages (see docs/ai/manus-media-rescue.md).
//
// Usage: pnpm tsx scripts/rescue-2026-10-07-peptide-images.ts [--dry-run]
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "next-sanity";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.loadEnvFile(path.join(__dirname, "../.env.local"));

const DRY_RUN = process.argv.includes("--dry-run");
const BASE = "https://tonygreenberg.com/api/img/";

const IMAGES: { file: string; name: string; title: string }[] = [
  { name: "peptide-watch-hero", title: "Peptide Watch hero: shattered vial crossed by a red light beam", file: "site-057-opt_27_0_JXknTuGM5jXLADVhzi2311_1773617447237_na1fn_L2hvbWUvdWJ1bnR1L2hl_a57017496e_51be235d.webp" },
  { name: "peptide-watch-three-markets", title: "Three syringes, clear, gold and black, among glass shards", file: "site-072-opt_41_1_v2WYYfU57IwN06VnYMczhd_1773617453105_na1fn_L2hvbWUvdWJ1bnR1L3Ro_13a4be094d_19528483.webp" },
  { name: "peptide-watch-enforcement", title: "Glass hourglass with red sand over stacks of cash", file: "site-050-opt_19_2_E8571TfuVcPpzA3l8sDtUG_1773617443569_na1fn_L2hvbWUvdWJ1bnR1L2Vu_9623a1fae8_2632b980.webp" },
  { name: "peptide-watch-wall-of-shame", title: "Wall of framed mugshots behind evidence tape", file: "site-041-opt_1_3_MIYsdI7jUuNQa0NltDUgjn_1773617441031_na1fn_L2hvbWUvdWJ1bnR1L3dhb_8cb7461e35_bcd9044f.webp" },
  { name: "peptide-watch-fraud-patterns", title: "Ring of twelve glowing medallions around a watching eye", file: "site-040-opt_0_4_MCkiwFGAzWiyKXzYmiwuBZ_1773617441126_na1fn_L2hvbWUvdWJ1bnR1LzEyX_3af14cf6d2_2e6f4d55.webp" },
  { name: "peptide-watch-checklists", title: "Hands reaching for a glowing vial over a sacred-geometry table", file: "site-094-opt_8_5_uzz3yDoGjZ1TsSejER4qZC_1773617435275_na1fn_L2hvbWUvdWJ1bnR1L3Jvb_1d6376e1f6_2d7bc2e6.webp" },
  { name: "peptide-watch-supply-chain-test", title: "Glass scales weighing a fraud bottle against a trust bottle", file: "site-053-opt_22_6_9L4WV2g0hc1P2OWmepfvJd_1773617434549_na1fn_L2hvbWUvdWJ1bnR1L3Nl_a29e2ca71a_4f1214cd.webp" },
  { name: "peptide-watch-vendor-scorecard", title: "Light beam from a carved box across ten glowing scorecard markers", file: "site-045-opt_13_7_C1fQmXkqFMlvJ032C4qvEY_1773617444714_na1fn_L2hvbWUvdWJ1bnR1L3Zl_0a056cd495_2de75538.webp" },
  { name: "peptide-watch-finnrick", title: "Molecule inside a glass sphere ringed by a golden seal", file: "site-066-opt_35_8_fW9NqUzYD9g7z7SGoJBLLT_1773617447285_na1fn_L2hvbWUvdWJ1bnR1L2Zp_66f2f907c0_443eaaa5.webp" },
  { name: "peptide-watch-consumer-org", title: "Glowing lighthouse over a dark shore of broken vials", file: "site-047-opt_15_9_yJslhilC8rx2UAMMgYdWcm_1773617449214_na1fn_L2hvbWUvdWJ1bnR1L3Nl_939f10520e_034c7b8a.webp" },
  { name: "peptide-watch-whistleblower", title: "Golden whistle between two silhouettes behind cracked glass", file: "site-056-opt_26_10_jdNQ9z5VMCRzCSnTvLtYCx_1773617445869_na1fn_L2hvbWUvdWJ1bnR1L3d_f447e7c0db_36096a86.webp" },
  { name: "peptide-watch-protocol", title: "Broken chain with a certificate: trust chain of custody, not reputation", file: "site-048-opt_16_11_ecMRcv6t898oag7yBTl2HK_1773617461058_na1fn_L2hvbWUvdWJ1bnR1L3N_48edd23009_6d54f0a7.webp" },
  { name: "peptide-matrix-hero", title: "Peptide Matrix hero: corridor of glowing glass molecule cubes", file: "site-090-opt_66_peptide-hero-matrix-TUP48rggCiaJdBFdZh9eMF_3b80d0d9_5a13f23bf2_aa8d491e.webp" },
  { name: "peptide-hall-of-shame-hero", title: "Hall of Shame hero: shattered glass pane in a white room", file: "site-098-peptide-hero-shame-F3CU4ffRKBb77JgiCsFgmX_fb1ebaec57_1008dba4.webp" },
  { name: "peptide-supply-chain-hero", title: "Supply Chain hero: glass chain with one cracked red link", file: "site-099-peptide-hero-supply-PYCPqN9umsL4js9C6nUkYD_04fc7bf50c_8b06680b.webp" },
];

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function main() {
  for (const img of IMAGES) {
    const source = BASE + img.file;
    if (DRY_RUN) {
      console.log(`[dry-run] would upload ${source}`);
      continue;
    }
    const res = await fetch(source);
    if (!res.ok) throw new Error(`${res.status} fetching ${source}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    const asset = await writeClient.assets.upload("image", buffer, {
      filename: `${img.name}.webp`,
      title: img.title,
    });
    console.log(`${img.name}: ${asset.url} (${asset.metadata?.dimensions?.width}x${asset.metadata?.dimensions?.height})`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
