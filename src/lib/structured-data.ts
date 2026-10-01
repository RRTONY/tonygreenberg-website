import { sanityFetch } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tonygreenberg.com";

// Real values ported from the live site's JSON-LD (fetched 2026-08-22,
// before this content moves off Manus) — not invented.
export async function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Tony Greenberg",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export async function getPersonJsonLd() {
  const author = await sanityFetch<{ avatar?: Parameters<typeof urlFor>[0] } | null>({
    query: `*[_id == "author-tony-greenberg"][0]{avatar}`,
    tags: ["author"],
    revalidate: 3600,
  });

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Tony Greenberg",
    url: siteUrl,
    jobTitle: "Founder & CEO",
    worksFor: [
      { "@type": "Organization", name: "RampRate A-Team Inc.", url: "https://ramprate.com" },
      { "@type": "Organization", name: "ImpactSoul", url: "https://impactsoul.is" },
    ],
    affiliation: [
      { "@type": "Organization", name: "RampRate A-Team Inc." },
      { "@type": "Organization", name: "ImpactSoul" },
    ],
    description:
      "Twenty-five years building companies, advising Fortune 500s, investing in psychedelic medicine, and trying to make capitalism less extractive.",
    knowsAbout: [
      "Systems Thinking",
      "Impact Investing",
      "Enterprise Technology Strategy",
      "AI Ethics",
      "Trust Economy",
      "Psychedelic Medicine",
      "Tokenization",
      "Payments",
      "Peptide Therapeutics",
      "Conscious Capitalism",
      "Regenerative Capital",
    ],
    // Sourced from Sanity, not the legacy /api/img/ proxy — that path
    // disappears with Manus. See NEXTJS-MIGRATION-TODO.md, Phase 13.
    image: author?.avatar ? urlFor(author.avatar).width(800).url() : undefined,
    sameAs: [
      "https://www.linkedin.com/in/tonygreenberg",
      "https://x.com/ThinkTony",
      "https://www.instagram.com/ThinkTony",
      "https://ramprate.com",
      "https://impactsoul.is",
      "https://en.wikipedia.org/wiki/Tony_Greenberg",
    ],
    alumniOf: [{ "@type": "Organization", name: "University of Southern California" }],
  };
}

export function getArticleJsonLd(post: {
  title: string;
  excerpt?: string;
  slug: { current: string };
  publishedAt: string;
  updatedAt?: string;
  heroImage?: Parameters<typeof urlFor>[0];
  authorName?: string;
  authorAvatar?: Parameters<typeof urlFor>[0];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.heroImage ? [urlFor(post.heroImage).width(1200).height(630).url()] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      "@type": "Person",
      name: post.authorName || "Tony Greenberg",
      url: `${siteUrl}/about`,
      image: post.authorAvatar ? urlFor(post.authorAvatar).width(400).url() : undefined,
    },
    publisher: {
      "@type": "Organization",
      name: "Tony Greenberg",
      // /favicon.ico doesn't exist here (app/icon.tsx serves /icon), so this
      // pointed Google at a 404 on every post until 2026-10-02.
      logo: { "@type": "ImageObject", url: `${siteUrl}/icon` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}/blog/${post.slug.current}` },
  };
}
