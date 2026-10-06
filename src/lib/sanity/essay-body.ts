// Live's essay layout, applied at render time on top of legacyBodyLayout()
// (legacy BlogPost.tsx's ArticleContent / extractTOCHeadings, same rules):
// - every section title (h2/h3) gets an anchor id, and the h2s become the
//   sticky "Contents" sidebar's list;
// - the first short line among paragraphs 3 to 8 (40 to 200 characters,
//   not a list or quote) is shown as the pull quote instead of a paragraph;
// - a "GemSpark" section (its title and every paragraph up to the next title)
//   becomes the GemSpark card;
// - a line that is only a section-break mark ("∴", "⁂", "* * *", "---")
//   becomes a thin centered rule;
// - a post with sub-titles (h3) but no section titles (h2) has them promoted.
// Run it last, after autoLinkBody.

type Span = { _type: string; text?: string; marks?: string[] };
type Block = { _key: string; _type: string; style?: string; listItem?: string; children?: Span[]; [k: string]: unknown };

export type TocHeading = { id: string; text: string; level: 2 | 3 };

const ORNAMENT = /^\s*[◆◇✦✧✴⟶→•★☆]+\s*/;
const BREAK_MARK = /^[\s∴⁂*✦·•—–-]+$/;

const textOf = (b: Block) => (b.children ?? []).map((s) => s.text ?? "").join("").trim();
const isText = (b: Block) => b._type === "block" && !b.listItem;
const isNormal = (b: Block) => isText(b) && (!b.style || b.style === "normal");
const isHeading = (b: Block) => isText(b) && (b.style === "h2" || b.style === "h3");

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
}

// idPrefix keeps the second ("Updated for today") version's anchors unique.
export function essayBody<T>(value: T, idPrefix = ""): { body: T; toc: TocHeading[] } {
  if (!Array.isArray(value)) return { body: value, toc: [] };
  // Some imports stored every section title one level down (h3) with no h2
  // at all; live shows those as full section titles, so promote them.
  const raw = value as Block[];
  const hasH2 = raw.some((b) => isText(b) && b.style === "h2");
  const blocks = hasH2 ? raw : raw.map((b) => (isText(b) && b.style === "h3" ? { ...b, style: "h2" } : b));
  const toc: TocHeading[] = [];
  const used = new Set<string>();
  const anchor = (text: string) => {
    const base = idPrefix + slugify(text);
    let id = base;
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);
    return id;
  };

  // Pull quote: same window and limits as legacy (index 2 to 7).
  let pullIdx = -1;
  for (let i = 2; i < Math.min(blocks.length - 1, 8); i++) {
    const b = blocks[i];
    const t = textOf(b);
    if (isNormal(b) && t.length > 40 && t.length < 200 && !/^[#|\-*>!["“]/.test(t) && !BREAK_MARK.test(t)) {
      pullIdx = i;
      break;
    }
  }

  const out: Block[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const t = isText(b) ? textOf(b) : "";

    if (isHeading(b) && /GemSpark/i.test(t)) {
      const paragraphs: Block[] = [];
      let j = i + 1;
      while (j < blocks.length && !isHeading(blocks[j]) && !/^⁂/.test(textOf(blocks[j]))) {
        if (!(isNormal(blocks[j]) && BREAK_MARK.test(textOf(blocks[j])))) paragraphs.push(blocks[j]);
        j++;
      }
      const title = t.replace(ORNAMENT, "");
      const id = anchor(title);
      toc.push({ id, text: title, level: b.style === "h2" ? 2 : 3 });
      out.push({
        _key: b._key,
        _type: "gemSpark",
        anchorId: id,
        subtitle: t.replace(/^✦\s*GemSpark\s*(of the Day)?\s*[—-]?\s*/i, "").trim(),
        paragraphs,
      });
      i = j - 1;
      continue;
    }

    if (isHeading(b) && t) {
      const title = t.replace(ORNAMENT, "");
      const id = anchor(title);
      toc.push({ id, text: title, level: b.style === "h2" ? 2 : 3 });
      out.push({ ...b, anchorId: id });
      continue;
    }

    if (isNormal(b) && t && BREAK_MARK.test(t)) {
      out.push({ _key: b._key, _type: "sectionBreak" });
      continue;
    }

    if (i === pullIdx) {
      out.push({ _key: b._key, _type: "essayPullQuote", text: t });
      continue;
    }

    out.push(b);
  }
  return { body: out as T, toc };
}
