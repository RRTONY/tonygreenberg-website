import { marked, type Tokens, type Token } from "marked";

// Converts the legacy blog posts' markdown (`originalContent` in
// blogData.json) into standard Sanity Portable Text blocks. Deliberately
// does NOT try to reproduce the legacy BlogPost.tsx renderer's one-off
// paragraph-position special cases (GemSpark sections, "LAW" call-outs,
// quote-group detection, etc.) — those are presentation embellishments the
// generic Next.js post template re-applies uniformly (drop caps, pull
// quotes from the `pullQuote` field), not content to preserve verbatim.

type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type MarkDef = { _key: string; _type: "link"; href: string };
type Block = {
  _type: "block";
  _key: string;
  style: string;
  children: Span[];
  markDefs: MarkDef[];
  listItem?: "bullet" | "number";
  level?: number;
};

let keyCounter = 0;
function key(): string {
  keyCounter += 1;
  return `k${keyCounter.toString(36)}`;
}

function span(text: string, marks: string[] = []): Span {
  return { _type: "span", _key: key(), text, marks };
}

// Walks marked's inline token tree, accumulating spans + markDefs for a
// single block. `marks` carries the marks inherited from enclosing
// strong/em/etc tokens as we recurse.
function inlineToSpans(
  tokens: Token[],
  marks: string[],
  markDefs: MarkDef[],
): Span[] {
  const spans: Span[] = [];
  for (const t of tokens) {
    switch (t.type) {
      case "text":
      case "escape": {
        const withInline = "tokens" in t && t.tokens ? t.tokens : null;
        if (withInline) spans.push(...inlineToSpans(withInline, marks, markDefs));
        else spans.push(span((t as Tokens.Text).text, marks));
        break;
      }
      case "strong":
        spans.push(...inlineToSpans((t as Tokens.Strong).tokens, [...marks, "strong"], markDefs));
        break;
      case "em":
        spans.push(...inlineToSpans((t as Tokens.Em).tokens, [...marks, "em"], markDefs));
        break;
      case "codespan":
        spans.push(span((t as Tokens.Codespan).text, [...marks, "code"]));
        break;
      case "link": {
        const linkToken = t as Tokens.Link;
        const markKey = key();
        markDefs.push({ _key: markKey, _type: "link", href: linkToken.href });
        spans.push(...inlineToSpans(linkToken.tokens, [...marks, markKey], markDefs));
        break;
      }
      case "br":
        spans.push(span("\n", marks));
        break;
      case "del":
        spans.push(...inlineToSpans((t as Tokens.Del).tokens, marks, markDefs));
        break;
      default:
        if ("raw" in t && typeof t.raw === "string") spans.push(span(t.raw, marks));
    }
  }
  return spans;
}

function paragraphBlock(tokens: Token[], style = "normal"): Block {
  const markDefs: MarkDef[] = [];
  const children = inlineToSpans(tokens, [], markDefs);
  return { _type: "block", _key: key(), style, children, markDefs };
}

// Markdown "#" is the post title (shown separately in the page header) —
// depth is shifted down one level so body headings don't collide with it.
function headingStyle(depth: number): string {
  const shifted = Math.min(depth + 1, 4);
  return `h${Math.max(shifted, 2)}`;
}

export function markdownToPortableText(markdown: string): Block[] {
  keyCounter = 0;
  const tokens = marked.lexer(markdown || "");
  const blocks: Block[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case "heading": {
        const h = token as Tokens.Heading;
        blocks.push(paragraphBlock(h.tokens, headingStyle(h.depth)));
        break;
      }
      case "paragraph": {
        const p = token as Tokens.Paragraph;
        blocks.push(paragraphBlock(p.tokens, "normal"));
        break;
      }
      case "blockquote": {
        const bq = token as Tokens.Blockquote;
        for (const inner of bq.tokens) {
          if (inner.type === "paragraph") {
            blocks.push(paragraphBlock((inner as Tokens.Paragraph).tokens, "blockquote"));
          }
        }
        break;
      }
      case "list": {
        const list = token as Tokens.List;
        for (const item of list.items) {
          // A "tight" list item's content is a bare "text" token; a "loose"
          // one (any item followed by a body paragraph on the next line,
          // like the numbered questions in five-cups) wraps it in a
          // "paragraph" token instead. Missing the second case silently
          // produced an empty list item for every such post.
          const markDefs: MarkDef[] = [];
          const children: Span[] = [];
          for (const sub of item.tokens) {
            let inline: Token[] = [];
            if (sub.type === "text") inline = (sub as Tokens.Text).tokens ?? [];
            else if (sub.type === "paragraph") inline = (sub as Tokens.Paragraph).tokens;
            else continue;
            if (children.length > 0) children.push(span("\n"));
            children.push(...inlineToSpans(inline, [], markDefs));
          }
          blocks.push({
            _type: "block",
            _key: key(),
            style: "normal",
            listItem: list.ordered ? "number" : "bullet",
            level: 1,
            children,
            markDefs,
          });
        }
        break;
      }
      case "code": {
        const codeToken = token as Tokens.Code;
        blocks.push({
          _type: "block",
          _key: key(),
          style: "normal",
          children: [span(codeToken.text, ["code"])],
          markDefs: [],
        });
        break;
      }
      // "space", "hr", "html", "table" — deliberately skipped; not present
      // in any sampled post body and not worth a block-schema extension
      // for a one-time migration.
      default:
        break;
    }
  }

  return blocks;
}
