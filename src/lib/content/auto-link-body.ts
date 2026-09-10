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

export function autoLinkBody<T>(value: T): T {
  if (!Array.isArray(value)) return value;

  return value.map((block: Block) => {
    if (block._type !== "block" || !Array.isArray(block.children)) return block;

    const hasRealLink = (block.markDefs || []).some(
      (definition) => definition._type === "link" && definition.href,
    );
    if (hasRealLink) return block;

    let didLink = false;
    const markDefs: MarkDef[] = [...(block.markDefs || [])];
    const children: Span[] = [];
    let counter = 0;

    for (const span of block.children) {
      if (span._type !== "span" || (span.marks && span.marks.length > 0) || !span.text) {
        children.push(span);
        continue;
      }

      const segments = autoLinkSegments(span.text);
      if (segments.length === 1 && typeof segments[0] === "string") {
        children.push(span);
        continue;
      }

      didLink = true;
      for (const segment of segments) {
        if (typeof segment === "string") {
          if (segment)
            children.push({
              _key: `${span._key}al${counter++}`,
              _type: "span",
              marks: [],
              text: segment,
            });
        } else {
          const markKey = `${span._key}alm${counter++}`;
          markDefs.push({ _key: markKey, _type: "link", href: segment.href });
          children.push({
            _key: `${span._key}al${counter++}`,
            _type: "span",
            marks: [markKey],
            text: segment.text,
          });
        }
      }
    }

    return didLink ? { ...block, children, markDefs } : block;
  }) as T;
}
