// Some essays carry their own "Further Reading" section inside the body
// (five-cups: "Title (url) · why" lines; heart-protocol-addendum: the same
// section twice, "Title — why" lines with one link each). The page also shows
// the per-category Further Reading list (further-reading.ts), so those posts
// showed the heading two or three times (SEO pack, owner's yes 2026-10-10).
// This pulls each body section out, so the page can show ONE "Further
// Reading" block with both lists merged and de-duplicated. A section whose
// lines don't read as links (when-healing-becomes-extraction's sources list)
// stays in the body, and the page then leaves out the category list instead.
// Run it on the output of legacyBodyLayout (one block per line), before
// autoLinkBody and essayBody, so the Contents sidebar never lists it.

type Span = { _type: string; text?: string; marks?: string[] };
type MarkDef = { _key: string; _type: string; href?: string };
type Block = { _key: string; _type: string; style?: string; listItem?: string; children?: Span[]; markDefs?: MarkDef[] };

export type FurtherReadingItem = { title: string; url: string; why?: string; source?: string };

export type BodyFurtherReading = {
  items: FurtherReadingItem[];
  intro?: string;
  // A body section that couldn't be read as a list of links stays in the body.
  keptInBody: boolean;
};

const ORNAMENT = /^\s*[◆◇✦✧✴⟶→•★☆#]+\s*/;
const BREAK_MARK = /^[\s∴⁂*✦·•—–-]+$/;
// "Title (https://… or /path) · why"
const PAREN_ITEM = /^(.+?)\s*\((\/[^\s)]*|https?:\/\/[^\s)]+)\)\s*[·—–-]\s*(.+)$/;
// "Title — why" (the link sits on the title)
const DASH_ITEM = /^(.+?)\s+[—–·]\s+(.+)$/;

const textOf = (b: Block) => (b.children ?? []).map((s) => s.text ?? "").join("").trim();
const isTextBlock = (b: Block) => b._type === "block";
const isHeading = (b: Block) => isTextBlock(b) && !b.listItem && (b.style === "h2" || b.style === "h3" || b.style === "h4");
const isBreak = (b: Block | undefined) => !!b && isTextBlock(b) && !b.listItem && BREAK_MARK.test(textOf(b));

function isFurtherReadingHeading(b: Block) {
  if (!isTextBlock(b) || b.listItem) return false;
  return textOf(b).replace(ORNAMENT, "").replace(/:$/, "").trim().toLowerCase() === "further reading";
}

function linkHrefs(b: Block) {
  const used = new Set((b.children ?? []).flatMap((s) => s.marks ?? []));
  return (b.markDefs ?? []).filter((m) => m._type === "link" && m.href && used.has(m._key)).map((m) => m.href as string);
}

function parseItem(b: Block): FurtherReadingItem | null {
  if (!isTextBlock(b) || (b.style && b.style !== "normal")) return null;
  const text = textOf(b);
  const paren = text.match(PAREN_ITEM);
  if (paren) return { title: paren[1].trim(), url: paren[2], why: paren[3].trim() };
  const hrefs = [...new Set(linkHrefs(b))];
  const dash = text.match(DASH_ITEM);
  if (dash && hrefs.length === 1) return { title: dash[1].trim(), url: hrefs[0], why: dash[2].trim() };
  return null;
}

/** Same address written two ways ("https://www.x.com/a/", "x.com/a") counts once. */
export function readingKey(url: string) {
  return url
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/^tonygreenberg\.com(?=\/|$)/, "")
    .replace(/\/+$/, "");
}

export function extractFurtherReading<T>(value: T): { body: T; reading: BodyFurtherReading } {
  const reading: BodyFurtherReading = { items: [], keptInBody: false };
  if (!Array.isArray(value)) return { body: value, reading };
  const blocks = value as Block[];
  const drop = new Set<number>();

  for (let i = 0; i < blocks.length; i++) {
    if (!isFurtherReadingHeading(blocks[i])) continue;
    let j = i + 1;
    let intro: string | undefined;
    const items: FurtherReadingItem[] = [];
    // The first line may be a short lead-in ("These are the threads worth
    // pulling after this one:"); after that, the section is its link lines.
    if (j < blocks.length && !parseItem(blocks[j]) && isTextBlock(blocks[j]) && !isHeading(blocks[j]) && !isBreak(blocks[j])) {
      intro = textOf(blocks[j]);
      j++;
    }
    while (j < blocks.length) {
      const item = parseItem(blocks[j]);
      if (!item) break;
      items.push(item);
      j++;
    }
    if (items.length === 0) {
      reading.keptInBody = true;
      continue;
    }
    for (let k = i; k < j; k++) drop.add(k);
    // "⁂ Further Reading … ⁂": without the section the two marks would sit
    // next to each other, so keep only one.
    if (isBreak(blocks[i - 1]) && isBreak(blocks[j])) drop.add(j);
    reading.intro ??= intro;
    for (const item of items) {
      if (!reading.items.some((x) => readingKey(x.url) === readingKey(item.url))) reading.items.push(item);
    }
    i = j - 1;
  }

  if (drop.size === 0) return { body: value, reading };
  return { body: blocks.filter((_, i) => !drop.has(i)) as T, reading };
}
