import { drizzle } from "drizzle-orm/mysql2";
import { searchIndex } from "../drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const entries = [
  {
    contentKey: "external-the-way-out-home",
    title: "The Way Out — Richard Condon & Buckminster Fuller (1948–2024)",
    path: "https://thewayout-fciushx2.manus.space/",
    category: "pages",
    excerpt: "A tribute to Richard Condon. In the 1970s, Buckminster Fuller gave a handwritten document to a single man — the historical attempt to convert evolution from a subjective to an objective process. Condon spent fifty years delivering it, one person at a time.",
    body: "Richard Condon Buckminster Fuller geodesic dome human potential evolution consciousness the historical attempt to convert his evolution from a subjective to an objective process handwritten manifesto blueprint human evolution cosmic geometry human empathy We are born whole Every layer after that is a lesson in forgetting Richards work was the remembering The Way Out A Story of Two Worldly Creatures",
    tags: "Richard Condon, Buckminster Fuller, consciousness, evolution, philosophy, tribute, legacy, geodesic dome, human potential",
  },
  {
    contentKey: "external-the-way-out-book",
    title: "The Book — Richard Condon's Philosophy",
    path: "https://thewayout-fciushx2.manus.space/book",
    category: "pages",
    excerpt: "The definitive written account of Richard Condon's philosophy, captured in his final years. The Way Out.",
    body: "Richard Condon philosophy book chapter Buckminster Fuller evolution consciousness human potential the way out",
    tags: "Richard Condon, Buckminster Fuller, philosophy, book",
  },
  {
    contentKey: "external-the-way-out-infusion",
    title: "The Infusion — Fuller & Condon",
    path: "https://thewayout-fciushx2.manus.space/infusion",
    category: "pages",
    excerpt: "How Fuller's cosmic geometry met Condon's human empathy. The story of their friendship and intellectual partnership.",
    body: "Buckminster Fuller Richard Condon cosmic geometry human empathy friendship infusion lineage evolution consciousness",
    tags: "Richard Condon, Buckminster Fuller, infusion, friendship, cosmic geometry",
  },
  {
    contentKey: "external-the-way-out-stories",
    title: "Stories — People Richard Condon Changed",
    path: "https://thewayout-fciushx2.manus.space/stories",
    category: "pages",
    excerpt: "First-hand accounts from the thousands of people whose lives were altered by one conversation with Richard Condon.",
    body: "Richard Condon stories tributes lives changed one conversation guest book remembering",
    tags: "Richard Condon, stories, tributes, testimonials",
  },
];

for (const entry of entries) {
  await db.insert(searchIndex).values(entry).onDuplicateKeyUpdate({
    set: { title: entry.title, body: entry.body, excerpt: entry.excerpt, tags: entry.tags },
  });
  console.log("Indexed:", entry.title);
}
console.log("Done — The Way Out indexed under Richard Condon and Buckminster Fuller");
process.exit(0);
