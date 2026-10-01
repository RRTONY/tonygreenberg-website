// One-off cleanup of blog post bodies, found by the 2026-09-29 link check.
// Every fix is written as a **draft** (`drafts.<post id>`), never to the
// published post; if a draft already exists (e.g. from
// restore-blog-body-images.ts) it builds on that draft instead.
//
// 1. Broken internal links: pointed at the real page.
// 2. Leaked markdown: three placeholder images whose `![alt](url)` code was
//    showing as text (they pointed at the generic og-default.jpg, so there is
//    no real image to restore), and Energy Is Money's author bio, whose
//    RampRate link was split across two blocks with a paragraph between.
// 3. WordPress page furniture scraped with the original posts: the
//    "Share this: / Related / You Might Also Like / Stay Connected /
//    Copyright" tail, the "Show More / Top News" menu at the top of three
//    posts, and a `[mc4wp_form]` shortcode plus its signup small print.
//
// Usage:
//   pnpm tsx scripts/fix-blog-body-links.ts          (dry run, prints the plan)
//   pnpm tsx scripts/fix-blog-body-links.ts --write  (creates the drafts)
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "next-sanity";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.loadEnvFile(path.join(__dirname, "../.env.local"));

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  perspective: "raw",
});

const WRITE = process.argv.includes("--write");

type Span = { _key: string; _type: "span"; text: string; marks: string[] };
type MarkDef = { _key: string; _type: string; href?: string };
type Block = { _key: string; _type: string; style?: string; children?: Span[]; markDefs?: MarkDef[] };
type Post = { _id: string; body: Block[] } & Record<string, unknown>;

type Fix = {
  hrefs?: Record<string, string>;
  removeKeys?: string[];
  // Drop the block that starts with this text and everything after it.
  truncateFrom?: string;
  custom?: (body: Block[], log: (m: string) => void) => Block[];
};

const FIXES: Record<string, Fix> = {
  "forever-chemicals-in-my-blood-pfas-and-microplastics": {
    hrefs: { "/blog/psychedelic-readiness-index": "/psychedelic-readiness-index" },
  },
  "molecule-as-mirror-10-what-the-pioneers-know": {
    // "The Doorway" is part 11, not part 10.
    hrefs: { "/blog/molecule-as-mirror-10-the-doorway": "/blog/molecule-as-mirror-11-the-doorway" },
  },
  "eco-vegan-realities-seriesethical-economic": {
    hrefs: {
      "https://tonygreenberg.com/cios-maximize-roi-or-find-new-role-joe-weinman/": "/blog/cios-maximize-roi-or-find-new-role-joe-weinman",
    },
    removeKeys: ["k16", "k1e"], // [mc4wp_form] + "By signing up, you agree to our Terms of Use…"
  },
  "find-my-ev-paul-scott-wont-let-you-buy-a-gas-car": {
    hrefs: {
      "https://tonygreenberg.com/my-other-car-is-a-bentley-not-car-to-leaf-alone/": "/blog/my-other-car-is-a-bentley-not-car-to-leaf-alone",
    },
  },
  "molecule-as-mirror-8-resources-and-costs": { removeKeys: ["k1u"] },
  "molecule-as-mirror-9-a-ceremony-story": { removeKeys: ["kg", "ku"] },
  "boiling-the-human-summit-harvard-kurzweil": { truncateFrom: "Share this:" },
  "davos-2022-world-economic-forum-here-we-come": { truncateFrom: "Share this:" },
  "drbronners-to-pressurecookers-simplify-your-life": { truncateFrom: "Share this:" },
  "myth-rfp-everything-half-price": { truncateFrom: "Share this:" },
  "mastering-human-and-business-development": { truncateFrom: "Share this:", removeKeys: ["k2"] },
  "powering-purpose-driven-innovation": { truncateFrom: "Share this:", removeKeys: ["k4"] },
  // k2 is the old HTML <title> ("… | Tony Greenberg") repeated as a paragraph.
  "return-on-investment-going-green-going-green-2": { truncateFrom: "Share this:", removeKeys: ["k2", "k4"] },
  "energy-is-money-money-is-memory": {
    custom: (body, log) => {
      // k55: "**Tony Greenberg** is Founder and CEO of [R"   k5i: "ampRate](https://ramprate.com) and Founder of ImpactSoul. …"
      const start = body.find((b) => b._key === "k55");
      const rest = body.find((b) => b._key === "k5i");
      if (!start?.children || !rest?.children) {
        log("! bio blocks not found, skipped");
        return body;
      }
      const [lead] = start.children;
      const tail = rest.children.slice(2); // after "ampRate](" and the raw URL span
      tail[0] = { ...tail[0], text: tail[0].text.replace(/^\)/, "") };
      const merged: Block = {
        ...start,
        children: [
          lead,
          { _key: "k54", _type: "span", marks: [], text: " is Founder and CEO of " },
          { _key: "k5d", _type: "span", marks: ["k5c"], text: "RampRate" },
          ...tail,
        ],
        markDefs: rest.markDefs,
      };
      log("~ merged the split author bio (k55 + k5i)");
      return body.filter((b) => b._key !== "k5i").map((b) => (b._key === "k55" ? merged : b));
    },
  },
};

const blockText = (b: Block) => (b.children ?? []).map((c) => c.text).join("");

async function run() {
  for (const [slug, fix] of Object.entries(FIXES)) {
    const docs = await client.fetch<Post[]>(`*[_type == "post" && slug.current == $slug]`, { slug });
    const post = docs.find((d) => d._id.startsWith("drafts.")) ?? docs.find((d) => !d._id.startsWith("drafts."));
    if (!post) {
      console.log(`\n${slug}: not found, skipped`);
      continue;
    }
    const baseId = post._id.replace(/^drafts\./, "");
    const lines: string[] = [];
    const log = (m: string) => lines.push(m);
    let body = post.body;

    if (fix.hrefs) {
      body = body.map((b) => {
        if (!b.markDefs?.length) return b;
        const markDefs = b.markDefs.map((m) => {
          const to = m.href ? fix.hrefs![m.href] : undefined;
          if (!to) return m;
          log(`~ link ${m.href} → ${to}`);
          return { ...m, href: to };
        });
        return { ...b, markDefs };
      });
    }
    if (fix.truncateFrom) {
      const i = body.findIndex((b) => blockText(b).startsWith(fix.truncateFrom!));
      if (i >= 0) {
        log(`- removed ${body.length - i} trailing blocks from "${fix.truncateFrom}" to the end`);
        body = body.slice(0, i);
      } else log(`! "${fix.truncateFrom}" not found`);
    }
    if (fix.removeKeys) {
      for (const key of fix.removeKeys) {
        const b = body.find((x) => x._key === key);
        if (b) log(`- removed ${key}: "${blockText(b).slice(0, 70).replace(/\n/g, " ")}"`);
        else log(`! ${key} not found`);
      }
      body = body.filter((b) => !fix.removeKeys!.includes(b._key));
    }
    if (fix.custom) body = fix.custom(body, log);

    console.log(`\n${slug} (from ${post._id.startsWith("drafts.") ? "existing draft" : "published"}):`);
    for (const l of lines) console.log(`  ${l}`);
    if (!WRITE) continue;

    const { _rev, _updatedAt, _createdAt, ...rest } = post;
    void _rev;
    void _updatedAt;
    void _createdAt;
    await client.createOrReplace({ ...rest, _id: `drafts.${baseId}`, _type: "post", body } as never);
    console.log(`  → saved drafts.${baseId}`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
