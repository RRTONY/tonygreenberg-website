// One-off (2026-10-10): the Five Cups essay's items from the "SEO and UX
// Implementation Pack" (section 3, owner's yes 2026-10-10):
// - SEO title and description (the post's `seo` fields; the layout adds
//   " | Tony Greenberg" to the title);
// - the short-answer box and the visible questions and answers (`shortAnswer`
//   and `faq`, wording exactly as the pack gives it, no new facts);
// - the section-title rewrites: real H2 blocks with no glyphs, plus the new
//   "Filtered vs. Espresso and French Press: What Is Cafestol?" title.
// The H1 (title) is unchanged. Written straight onto the published post (the
// owner's standing choice for Sanity content) and onto a pending draft when
// there is one. Sanity keeps the document history; the script also saves the
// post as it was before to --backup=<file>.
//
// The new cafestol title goes above the paragraph that explains cafestol
// ("More critically: these heart-healthy findings apply strictly to
// paper-filtered…") rather than directly above "The Coffees Worth the
// Conversation" as the pack literally says: there it would head an empty
// section.
//
// Usage: pnpm tsx scripts/update-2026-10-10-five-cups-seo.ts --dry-run
//        pnpm tsx scripts/update-2026-10-10-five-cups-seo.ts --backup=/path/five-cups-before.json
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "next-sanity";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.loadEnvFile(path.join(__dirname, "../.env.local"));

const DRY_RUN = process.argv.includes("--dry-run");
const BACKUP = process.argv.find((a) => a.startsWith("--backup="))?.slice("--backup=".length);
const POST_ID = "post-five-cups";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const SEO = {
  metaTitle: "Five Cups of Coffee? What the AHA Left Out",
  metaDescription:
    "The AHA says up to five cups of coffee a day is safe for most adults. Here's what it means for bone density, filtered vs. espresso, and your caffeine genes.",
};

const SHORT_ANSWER =
  "The AHA statement describes up to five cups of coffee a day as safe for most adults. The essay notes that benefits appear to plateau around two to four cups, and that the heart-health findings apply to filtered or instant coffee, not espresso or French press.";

const FAQ = [
  {
    question: "How many cups of coffee a day is safe?",
    answer: "The AHA statement describes up to five cups as safe for most adults. The essay says benefits appear to plateau at two to four.",
  },
  {
    question: "Do espresso and French press have the same heart benefits?",
    answer:
      "The essay says the findings apply to paper-filtered or instant coffee, because other methods retain cafestol, which raises LDL cholesterol.",
  },
  {
    question: "Does coffee affect bone density?",
    answer: "The essay cites research linking higher caffeine intake to lower bone mineral density in postmenopausal women.",
  },
  {
    question: "What is CYP1A2?",
    answer: "A gene variant that affects how quickly a person metabolizes caffeine.",
  },
];

// Current text (exact) -> new H2 text. A block holding more than one line
// keeps its other lines as a paragraph right after the new title.
const HEADINGS: Record<string, string> = {
  "◆ What the Fine Print Actually Says": "What the AHA Coffee Statement Actually Says",
  "◆ Your Heart Might Survive It. Your Bones Are a Different Story.": "Does Coffee Affect Bone Density?",
  "◆ Who Actually Wins When the Ceiling Goes Up": "Who Profits When the Five-Cup Ceiling Rises?",
  "◆ What You Should Actually Drink in the Morning": "Better Morning Alternatives: Matcha, Yerba Mate, Cacao and Adaptogens",
  "◆ The Coffees Worth the Conversation": "The Coffees Worth the Conversation",
  "◆ The Bigger Pattern ✦ and Where This Goes": "Where Morning Rituals Go Next",
  "✦ GemSpark of the Day": "GemSpark: Aspen, Colorado",
};
const NEW_HEADING = {
  text: "Filtered vs. Espresso and French Press: What Is Cafestol?",
  before: "More critically: these heart-healthy findings apply strictly to paper-filtered or instant coffee.",
};

type Span = { _key: string; _type: string; text?: string; marks?: string[] };
type Block = { _key: string; _type: string; style?: string; listItem?: string; children?: Span[]; markDefs?: unknown[] };

const textOf = (b: Block) => (b.children ?? []).map((s) => s.text ?? "").join("");
const h2 = (key: string, text: string): Block => ({
  _key: key,
  _type: "block",
  style: "h2",
  markDefs: [],
  children: [{ _key: `${key}s`, _type: "span", marks: [], text }],
});

function rewriteBody(body: Block[]) {
  const out: Block[] = [];
  const changes: { before: string; after: string }[] = [];
  const done = new Set<string>();
  for (const b of body) {
    if (b._type !== "block" || b.listItem) {
      out.push(b);
      continue;
    }
    const text = textOf(b);
    if (text.trim().startsWith(NEW_HEADING.before) && !done.has(NEW_HEADING.text)) {
      out.push(h2(`${b._key}cafestol`, NEW_HEADING.text));
      changes.push({ before: "(new section title)", after: NEW_HEADING.text });
      done.add(NEW_HEADING.text);
    }
    const [firstLine, ...rest] = text.split("\n");
    const target = HEADINGS[firstLine.trim()];
    if (!target) {
      out.push(b);
      continue;
    }
    out.push(h2(b._key, target));
    changes.push({ before: firstLine.trim(), after: target });
    done.add(firstLine.trim());
    const remainder = rest.join("\n").trim();
    if (remainder) {
      out.push({ _key: `${b._key}r`, _type: "block", style: "normal", markDefs: [], children: [{ _key: `${b._key}rs`, _type: "span", marks: [], text: remainder }] });
      changes.push({ before: "(rest of that block)", after: `${remainder} (kept as the next paragraph)` });
    }
  }
  const missing = [...Object.keys(HEADINGS), NEW_HEADING.text].filter((k) => !done.has(k));
  return { body: out, changes, missing };
}

const withKeys = <T extends object>(items: T[], prefix: string) => items.map((item, i) => ({ _key: `${prefix}${i + 1}`, _type: "faqItem", ...item }));

async function main() {
  const docs = await client.fetch<({ _id: string; _rev: string; body: Block[] } & Record<string, unknown>)[]>(
    `*[_id in [$id, "drafts." + $id]]`,
    { id: POST_ID },
  );
  if (docs.length === 0) throw new Error(`${POST_ID} not found`);

  if (!DRY_RUN) {
    if (!BACKUP) throw new Error("Pass --backup=<file> to save the post as it is now before writing.");
    fs.writeFileSync(BACKUP, JSON.stringify(docs, null, 2));
    console.log(`saved the current post(s) to ${BACKUP}`);
  }

  const tx = client.transaction();
  for (const doc of docs) {
    const { body, changes, missing } = rewriteBody(doc.body);
    console.log(`\n== ${doc._id} (rev ${doc._rev})`);
    console.log(`seo: ${JSON.stringify(doc.seo ?? null)} -> ${JSON.stringify(SEO)}`);
    console.log(`shortAnswer: ${JSON.stringify(doc.shortAnswer ?? null)} -> ${JSON.stringify(SHORT_ANSWER)}`);
    console.log(`faq: ${Array.isArray(doc.faq) ? doc.faq.length : 0} -> ${FAQ.length} items`);
    for (const q of FAQ) console.log(`   Q: ${q.question}\n   A: ${q.answer}`);
    console.log(`body: ${doc.body.length} -> ${body.length} blocks. Headings:`);
    for (const c of changes) console.log(`   BEFORE: ${c.before}\n   AFTER:  ${c.after}${c.before.startsWith("(rest") ? "" : " (H2)"}`);
    if (missing.length) throw new Error(`not found in ${doc._id} (already changed?): ${missing.join(" | ")}`);
    tx.patch(doc._id, (p) =>
      p
        .ifRevisionId(doc._rev)
        .setIfMissing({ seo: { _type: "seo" } })
        .set({ "seo.metaTitle": SEO.metaTitle, "seo.metaDescription": SEO.metaDescription, shortAnswer: SHORT_ANSWER, faq: withKeys(FAQ, "faq"), body }),
    );
  }
  if (DRY_RUN) return console.log("\n[dry-run] nothing written");
  const res = await tx.commit({ visibility: "sync" });
  console.log(`\ncommitted ${res.transactionId}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
