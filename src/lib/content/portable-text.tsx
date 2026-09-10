import Image from "next/image";
import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

import { urlFor } from "./content-image";

function dimsFromValue(value: { height?: number; width?: number }) {
  return {
    height: value.height ?? 800,
    width: value.width ?? 1200,
  };
}

export const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      const imageUrl = urlFor(value?.url).url();
      if (!imageUrl) return null;
      const { width, height } = dimsFromValue(value);
      return (
        <figure className="my-8">
          <Image
            src={imageUrl}
            alt={value.alt || ""}
            width={width}
            height={height}
            sizes="(max-width: 768px) 100vw, 800px"
            className="h-auto w-full rounded-lg"
          />
          {value.caption && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  block: {
    h2: ({ children }) => (
      <h2 className="mb-4 mt-10 font-heading text-2xl font-bold">{children}</h2>
    ),
    h3: ({ children }) => <h3 className="mb-3 mt-8 font-heading text-xl font-bold">{children}</h3>,
    h4: ({ children }) => (
      <h4 className="mb-2 mt-6 font-heading text-lg font-semibold">{children}</h4>
    ),
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
