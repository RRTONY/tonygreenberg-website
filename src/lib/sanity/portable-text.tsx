import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { urlFor } from "./image";

function dimsFromRef(ref: string): { width: number; height: number } {
  const match = ref?.match(/-(\d+)x(\d+)-/);
  if (match) return { width: Number(match[1]), height: Number(match[2]) };
  return { width: 1200, height: 800 };
}

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) return null;
      const { width, height } = dimsFromRef(value.asset._ref);
      return (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(1200).url()}
            alt={value.alt || ""}
            width={width}
            height={height}
            sizes="(max-width: 768px) 100vw, 800px"
            className="rounded-lg w-full h-auto"
          />
          {value.caption && (
            <figcaption className="mt-2 text-sm text-muted-foreground text-center">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }) => <h2 className="mt-10 mb-4 text-2xl font-bold">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 mb-3 text-xl font-bold">{children}</h3>,
    h4: ({ children }) => <h4 className="mt-6 mb-2 text-lg font-semibold">{children}</h4>,
    normal: ({ children }) => <p className="mb-5 leading-relaxed">{children}</p>,
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
