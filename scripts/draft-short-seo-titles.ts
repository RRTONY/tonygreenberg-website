/**
 * Short search-result titles for essays whose headline is longer than Google shows (~60 chars).
 * Owner's team asked for the long titles to be fixed (2026-11-14); CONTRIBUTING.md says a title
 * that's long in its own words is Tony's to shorten. So this only writes each post's separate
 * `seo.metaTitle` (the Google listing), never the headline, and only as a Sanity DRAFT: nothing
 * changes on the site until someone reviews and publishes it in Studio (/studio).
 *
 * Every title below keeps Tony's own words, mostly by dropping the subtitle.
 * Run:  pnpm tsx scripts/draft-short-seo-titles.ts            (dry run: prints the plan)
 *       pnpm tsx scripts/draft-short-seo-titles.ts --write    (creates/updates the drafts)
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "next-sanity";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.loadEnvFile(path.join(__dirname, "../.env.local"));
const WRITE = process.argv.includes("--write");

export const SHORT_TITLES: Record<string, string> = {
  "the-decay-of-modern-day-communication": "The Decay of Modern Day Communication",
  "is-that-a-lot-clarisse-abelarde": "Is That A Lot? On Clarisse Abelarde's Magnificent Painting",
  "how-to-alienate-a-loyal-vegan": "How to Alienate a Loyal Vegan Trying to Buy Your Product",
  "the-1000-hour-hold": "The $1,000/Hour Hold: A Manifesto",
  "united-airlines-the-case-of-the-creamy-thing": "United Airlines Collected $4.8 Billion in Fees",
  "luz-lounge-where-loyalty-goes-to-die-groupon": "Luz Lounge: Where Loyalty Goes to Die",
  "an-ode-to-kusaki-where-plants-become-culinary-masterpieces": "An Ode to Kusaki: Where Plants Become Culinary Masterpieces",
  "the-decay-of-professional-phone-calls": "The Decay of Professional Phone Calls Circa 2022",
  "10-magic-questions-for-projects-success-kick-ass": "10 Magic Questions to Make Your Project Go Right",
  "psychedelics-could-become-extractive-capitalism": "Psychedelics Could Become Extractive Capitalism",
  "productivity-apps-that-rock-my-world-in-2026": "Productivity Apps That Rock My World in 2026",
  "trap-how-dmn8-gym-became-a-poster-child-for-fitness-fraud": "Fitness Fraud Trap: How DMN8 Gym Became a Poster Child",
  "it-services-good-shoe-10-years-later-ramprate": "Making IT Fit Like a Good Shoe, 10 Years Later",
  "greenberg-kurzweil-scientist-foundation-of-trust": "H+ Summit: Rise of the Citizen-Scientist",
  "dmn8-the-most-beautiful-crooked-gym-in-the-world": "DMN8 Santa Monica: The Most Beautiful (and Crooked) Gym?",
  "innovative-thinking-with-tony-greenberg-scale-up-show": "Innovative Thinking with Tony Greenberg: The Scale Up Show",
  "forever-chemicals-in-my-blood-pfas-and-microplastics": "Forever Chemicals in My Blood: Testing for PFAS",
  "google-verizon-walled-garden-plan": "The Google/Verizon Walled Garden Plan",
  "bread-stuck-with-no-customer-service": "Lodge Bread Stuck In Suck-Cess with No Customer Service",
  "the-ties-that-bind-interpersonal-relationships": "The Ties That Bind: Interpersonal Relationships",
  "productivity-apps-that-rocked-my-world-in-2024": "Productivity Apps That Rocked My World in 2024",
  "the-butchers-daughter-the-carbon-toll-and-the-cheese-that-ate-the-planet": "The Butcher's Daughter and the Cheese That Ate the Planet",
  "jumping-through-hoops-with-hulu-will-hollywood-kill-their-offspring-again": "Jumping Through Hoops with Hulu",
  "save-entrepreneurs-big-business-buying-startup-2": "Save the Entrepreneur: Big Business Keeps Buying Startups",
  "the-clock-keeper-chronicles-part-1": "The Clock Keeper Chronicles: Part I",
  "cios-maximize-roi-or-find-new-role-joe-weinman": "How CIOs Must Maximize ROI or Find a New Role",
  "break-buggy-whip-now-tipping-for-streaming-video": "Is Now the Tipping Point for Streaming Video?",
  "trust-tongue-bottle-wine": "Trust Your Tongue: The Only Wine Critic That Matters Is You",
  "triple-bottom-line-of-soul-gregory-markel": "Triple Bottom Line of Soul? Trust + Empathy",
  "enterprise-blockchain-can-big-business-co-opt": "Enterprise Blockchain: Can Big Business Co-opt It?",
  "founders-institute-anti-millennial-funding-guide": "Banking on the Wrongs: The Anti-Millennial Funding Craze",
  "restaurants-beware-of-vegans-and-vegans-beware-of-lying-restaurants": "Vegans Beware of Lying Restaurants",
  "the-peptide-truth-65m-fraud-industry-vs-life-changing-medicine": "The Peptide Truth: $65M Fraud Industry vs. Real Medicine",
  "the-ball-and-blockchain-decentralization": "The Ball and Blockchain: Obstacles to a World-Changer",
  "love-as-dharma-a-science-based-playbook-for-magnetic-partnership": "Love as Dharma: A Science-Based Playbook",
  "from-supply-chain-to-the-blockchain-heal": "From Supply Chain to the Blockchain: Heal Body, Mind, Earth",
  "clout-v-klout-differences-and-never-be-the-same": "Clout v. Klout: Why They Aren't the Same Thing",
  "the-arithmetic-of-relationships": "The Arithmetic of Relationships: Our Mutual Net Profit",
  "thing-price-gouging-price-fixing": "Is There Price Gouging and Price Fixing in IT?",
  "hiding-fees-tips-in-the-transparent-age": "Hiding Fees & Tips in the Transparent Age Is Bad Business",
  "california-toll-roads-legalized-scam": "California Toll Roads Are a Legalized Scam",
  "business-at-the-speed-of-light-millisecond-worth": "Business at the Speed of Light: What's a Millisecond Worth?",
};

async function main() {
  for (const [slug, t] of Object.entries(SHORT_TITLES)) if (t.length > 60) throw new Error(`${slug}: ${t.length} chars`);
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2024-01-01",
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
    perspective: "raw",
  });
  const slugs = Object.keys(SHORT_TITLES);
  const docs: { _id: string; slug: string; title: string; metaTitle?: string }[] = await client.fetch(
    `*[_type == "post" && slug.current in $slugs]{ _id, "slug": slug.current, title, "metaTitle": seo.metaTitle }`,
    { slugs },
  );
  const published = new Map(docs.filter((d) => !d._id.startsWith("drafts.")).map((d) => [d.slug, d]));
  const drafts = new Map(docs.filter((d) => d._id.startsWith("drafts.")).map((d) => [d.slug, d]));
  const missing = slugs.filter((s) => !published.has(s));
  if (missing.length) console.log("NOT FOUND in Sanity (skipped):", missing.join(", "));

  let n = 0;
  for (const slug of slugs) {
    const pub = published.get(slug);
    if (!pub) continue;
    const next = SHORT_TITLES[slug];
    if ((drafts.get(slug)?.metaTitle ?? pub.metaTitle) === next) continue;
    console.log(`${WRITE ? "DRAFT" : "would draft"}  ${slug}\n    ${pub.title}\n  → ${next}`);
    n++;
    if (!WRITE) continue;
    // Start the draft from the current draft if one exists, else from the published post, so no
    // other unpublished edit is lost; then set only seo.metaTitle.
    const draftId = `drafts.${pub._id}`;
    const base = drafts.get(slug) ? await client.getDocument(draftId) : await client.getDocument(pub._id);
    if (!base) continue;
    await client.createOrReplace({ ...base, _id: draftId, seo: { ...(base.seo as object | undefined), metaTitle: next } });
  }
  console.log(`\n${n} post(s) ${WRITE ? "drafted" : "to draft"}. ${WRITE ? "Review and publish them in /studio." : "Re-run with --write to create the drafts."}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
