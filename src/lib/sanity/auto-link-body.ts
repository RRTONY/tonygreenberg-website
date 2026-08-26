import { autoLinkSegments } from "@/lib/content/link-map";

type Span = { _key: string; _type: "span"; marks?: string[]; text: string };
type MarkDef = { _key: string; _type: string; href?: string };
type Block = {
  _key: string;
  _type: string;
  children?: Span[];
  markDefs?: MarkDef[];
  [key: string]: unknown;
};

/**
 * Enriches Portable Text blocks with entity auto-links (see
 * lib/content/link-map.ts), ported from legacy's `LinkedParagraph`. Runs
 * as a data-level transform before the body reaches `<PortableText>`, so
 * the existing `marks.link` renderer in portable-text.tsx picks these up
 * with zero changes — new link marks are indistinguishable from real
 * authored ones once added to a block's `markDefs`.
 *
 * Conservative by design: only touches spans with no marks at all,
 * leaving anything already bold/italic/coded/linked completely alone —
 * a finer-grained version of legacy's own "skip this whole paragraph if
 * it already has a markdown link" rule, applied per span instead of per
 * paragraph. A block that already has a real (non-empty-href) link mark
 * anywhere is skipped entirely, matching that same legacy rule at the
 * block level.
 */
export function autoLinkBody<T>(value: T): T {
  if (!Array.isArray(value)) return value;

  return value.map((block: Block) => {
    if (block._type !== "block" || !Array.isArray(block.children)) return block;

    const hasRealLink = (block.markDefs || []).some((d) => d._type === "link" && d.href);
    if (hasRealLink) return block;

    let didLink = false;
    const newMarkDefs: MarkDef[] = [...(block.markDefs || [])];
    const newChildren: Span[] = [];
    let counter = 0;

    for (const span of block.children) {
      if (span._type !== "span" || (span.marks && span.marks.length > 0) || !span.text) {
        newChildren.push(span);
        continue;
      }

      const segments = autoLinkSegments(span.text);
      if (segments.length === 1 && typeof segments[0] === "string") {
        newChildren.push(span);
        continue;
      }

      didLink = true;
      for (const seg of segments) {
        if (typeof seg === "string") {
          if (seg) newChildren.push({ _key: `${span._key}al${counter++}`, _type: "span", marks: [], text: seg });
        } else {
          const markKey = `${span._key}alm${counter++}`;
          newMarkDefs.push({ _key: markKey, _type: "link", href: seg.href });
          newChildren.push({ _key: `${span._key}al${counter++}`, _type: "span", marks: [markKey], text: seg.text });
        }
      }
    }

    return didLink ? { ...block, children: newChildren, markDefs: newMarkDefs } : block;
  }) as T;
}
