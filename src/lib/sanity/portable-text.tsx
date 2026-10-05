import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { PortableText, type PortableTextBlock, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "./image";

function dimsFromRef(ref: string): { width: number; height: number } {
  const match = ref?.match(/-(\d+)x(\d+)-/);
  if (match) return { width: Number(match[1]), height: Number(match[2]) };
  return { width: 1200, height: 800 };
}

// Imported headings often open with a decorative glyph ("◆ What the Fine
// Print Says", "✦ GemSpark of the Day"). Keep it visible, but hide it from
// screen readers so the heading is announced (and outlined) by its words.
const HEADING_ORNAMENT = /^\s*([◆◇✦✧✴⟶→•★☆]+)\s*/;
function hideHeadingOrnament(children: ReactNode) {
  const nodes = Array.isArray(children) ? children : [children];
  const first = nodes[0];
  if (typeof first !== "string") return children;
  const match = first.match(HEADING_ORNAMENT);
  if (!match) return children;
  return [
    <span key="ornament" aria-hidden="true">
      {match[1]}{" "}
    </span>,
    first.slice(match[0].length),
    ...nodes.slice(1),
  ];
}

// The essay drop cap (globals.css) goes on the first real paragraph. These
// are flagged and skipped, so the drop cap moves to the next paragraph: one
// opening with a link ("← Back to the main article") or a symbol (a giant gold
// arrow), an all-bold label or all-italic caption line, or a short line like
// the byline "By Tony Greenberg, Social Impact Instigator" (a drop cap needs a
// few lines to sit in).
function opensWithoutLetter(block: PortableTextBlock) {
  const spans = (block.children ?? []) as { text?: string; marks?: string[] }[];
  const first = spans[0];
  if (!first?.text) return false;
  const linkKeys = new Set((block.markDefs ?? []).filter((d) => d._type === "link").map((d) => d._key));
  if (first.marks?.some((m) => linkKeys.has(m))) return true;
  const allMarked = (mark: string) => spans.every((c) => !c.text?.trim() || c.marks?.includes(mark));
  if (allMarked("strong") || allMarked("em")) return true;
  if (spans.map((c) => c.text ?? "").join("").trim().length < 80) return true;
  return !/^[\p{L}\p{N}"'“‘]/u.test(first.text.trimStart());
}

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;
      const { width, height } = dimsFromRef(value.asset._ref);
      // Matches legacy BlogPost.tsx's in-body images: capped at 620px tall
      // (tall phone screenshots would otherwise run ~1700px), and the alt
      // text doubles as the caption when there's no separate one. Legacy
      // cropped tall images with object-cover; contain keeps the whole
      // screenshot readable instead.
      const caption = value.caption || value.alt;
      return (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(1200).url()}
            alt={value.alt || ""}
            width={width}
            height={height}
            sizes="(max-width: 768px) 100vw, 800px"
            className="mx-auto h-auto max-h-155 w-auto max-w-full rounded-lg object-contain shadow-[0_4px_30px_rgba(0,0,0,0.08)]"
          />
          {caption && (
            <figcaption className="mt-4 text-center text-xs leading-normal tracking-[0.02em] text-muted-foreground italic">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    },
    // Legacy markdown tables (schemas/dataTable.ts). Scrolls sideways inside
    // its own box on phones so the page itself never does.
    dataTable: ({ value }) => {
      const rows = ((value?.rows ?? []) as { _key?: string; cells?: string[] }[]).filter((r) => r.cells?.length);
      if (rows.length < 2) return null;
      const [head, ...body] = rows;
      return (
        <div className="my-8 overflow-x-auto rounded-lg border border-border" tabIndex={0} role="region" aria-label="Table (scrolls sideways)">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-secondary">
              <tr>
                {head.cells!.map((cell, i) => (
                  <th key={i} scope="col" className="px-4 py-3 align-bottom font-mono text-xs font-semibold tracking-wide text-foreground uppercase">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, r) => (
                <tr key={row._key ?? r} className="border-t border-border">
                  {row.cells!.map((cell, i) => (
                    <td key={i} className="px-4 py-3 align-top leading-relaxed text-foreground/85">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
  },
  block: {
    h2: ({ children }) => <h2 className="mt-10 mb-4 font-heading text-2xl font-bold">{hideHeadingOrnament(children)}</h2>,
    h3: ({ children }) => <h3 className="mt-8 mb-3 font-heading text-xl font-bold">{hideHeadingOrnament(children)}</h3>,
    h4: ({ children }) => <h4 className="mt-6 mb-2 font-heading text-lg font-semibold">{hideHeadingOrnament(children)}</h4>,
    normal: ({ children, value }) => (
      <p className="mb-5 leading-relaxed" data-no-drop-cap={opensWithoutLetter(value) || undefined}>
        {children}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-primary/40 pl-5 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-5 ml-6 list-disc space-y-1.5">{children}</ul>,
    number: ({ children }) => <ol className="mb-5 ml-6 list-decimal space-y-1.5">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm">{children}</code>
    ),
    link: ({ children, value }) => {
      const href = value?.href;
      // A real content-data issue found across ~8 migrated posts: their
      // original source markdown has `[text]()` links with an empty URL
      // (predates this migration — the href was already lost before the
      // content ever reached blogData.json). Rendering those as `href="#"`
      // silently created a fake dead link; render the marked text plain
      // instead of pretending it points somewhere.
      if (!href) return <>{children}</>;
      const isExternal = /^https?:\/\//.test(href);
      return isExternal ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:opacity-70"
        >
          {children}
        </a>
      ) : (
        <Link href={href} className="underline underline-offset-2 hover:opacity-70">
          {children}
        </Link>
      );
    },
  },
};

export { PortableText };
