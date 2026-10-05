type Span = { _key: string; _type: string; marks?: string[]; text?: string };
type Block = {
  _key: string;
  _type: string;
  style?: string;
  listItem?: string;
  children?: Span[];
  [key: string]: unknown;
};

// Every post imported from the legacy app was created in Sanity before this
// date (scripts/migrate-blog-posts.ts and the 2026-09/10 rescue scripts). A
// post written in Studio after it keeps its own headings untouched.
export const LEGACY_IMPORT_CUTOFF = "2026-10-02T00:00:00Z";

// Legacy BlogPost.tsx's `isPlainSectionTitle`, verbatim: a short line with no
// closing punctuation that starts with a capital renders as a section heading.
function isPlainSectionTitle(text: string): boolean {
  return (
    !/^(##|-|\*|>|!|\[|\|)/.test(text) &&
    text.length < 60 &&
    !/[.!?,:;]$/.test(text) &&
    /^[A-Z✦✴◆]/.test(text) &&
    !/^\d+\./.test(text) &&
    text.split(" ").length <= 8
  );
}

// Splits one block's spans at every "\n", keeping each span's marks, so a
// block of N lines becomes N blocks sharing the original markDefs.
function splitLines(block: Block): Block[] {
  const lines: Span[][] = [[]];
  let n = 0;
  for (const span of block.children ?? []) {
    if (span._type !== "span" || !span.text?.includes("\n")) {
      lines[lines.length - 1].push(span);
      continue;
    }
    span.text.split("\n").forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ ...span, _key: `${span._key}l${n++}`, text: part });
    });
  }
  return lines
    .map((children) => {
      // Trim the line's outer whitespace, as legacy's `.trim()` did.
      const first = children[0];
      const last = children[children.length - 1];
      if (first?.text) children[0] = { ...first, text: first.text.replace(/^\s+/, "") };
      if (last?.text) children[children.length - 1] = { ...children[children.length - 1], text: last.text.replace(/\s+$/, "") };
      return children.filter((s) => s._type !== "span" || s.text);
    })
    .filter((children) => children.length > 0)
    .map((children, i) => ({ ...block, _key: i === 0 ? block._key : `${block._key}-${i}`, children }));
}

/**
 * The legacy app (what tonygreenberg.com still serves) rendered a post as one
 * paragraph per line and turned short title-like lines into section headings.
 * The Markdown import kept single-newline lines inside one block (119 blocks
 * in 78 posts, one of them 7,932 characters), so posts ran together and lost
 * ~500 headings. This restores live's layout at render time instead of
 * rewriting 78 posts as Sanity drafts. Run it before autoLinkBody, so
 * auto-linking sees the final paragraphs.
 */
const normalize = (t: string) => t.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/\s+/g, " ").trim().toLowerCase();
const blockText = (b: Block) => (b.children ?? []).map((s) => s.text ?? "").join("");

export function legacyBodyLayout<T>(value: T, createdAt: string | undefined, title?: string): T {
  if (!Array.isArray(value)) return value;
  const imported = !!createdAt && createdAt < LEGACY_IMPORT_CUTOFF;

  // Many imported bodies open with the post's own title as a plain paragraph,
  // repeating the H1 right above it. Drop that first block when it matches.
  const first = value[0] as Block | undefined;
  const body =
    title && first?._type === "block" && normalize(blockText(first)) === normalize(title) ? value.slice(1) : value;

  return body.flatMap((block: Block) => {
    if (block._type !== "block" || block.listItem || (block.style && block.style !== "normal")) return [block];
    const blocks = block.children?.some((s) => s.text?.includes("\n")) ? splitLines(block) : [block];
    if (!imported) return blocks;
    return blocks.map((b) => {
      const text = (b.children ?? []).map((s) => s.text ?? "").join("").trim();
      // Legacy saw raw Markdown, so a line opening with bold, italic or a link
      // ("*", "[") was never a title: same here for a first span with marks.
      // Live also keeps a line holding a web address as text.
      const startsFormatted = (b.children?.[0]?.marks?.length ?? 0) > 0;
      const hasUrl = /https?:\/\/|www\./i.test(text);
      return !startsFormatted && !hasUrl && isPlainSectionTitle(text) ? { ...b, style: "h2" } : b;
    });
  }) as T;
}
