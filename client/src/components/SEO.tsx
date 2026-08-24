/*
 * SEO Meta Tags Component
 * Sets document title, meta tags, and JSON-LD structured data
 */

import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: string;
  /** For blog posts: publish date */
  publishDate?: string;
  /** For blog posts: author name */
  author?: string;
  /** For blog posts: category */
  category?: string;
  /** Comma-separated keywords for meta keywords tag */
  keywords?: string;
  /** If true, allow search engines to index this page */
  indexable?: boolean;
}

const BASE_TITLE = "Tony \"WhyNot\" Greenberg — Only Time Buys Trust";
const DEFAULT_IMAGE = "/api/img/tony-headshot_2d63de23.jpg";

// Rich Person entity — used in all structured data
const TONY_PERSON = {
  "@type": "Person",
  "@id": "https://tonygreenberg.com/#tony-greenberg",
  name: "Tony \"WhyNot\" Greenberg",
  givenName: "Tony",
  familyName: "Greenberg",
  jobTitle: "Investor, Systems Thinker, Builder",
  description: "Twenty-five years of enterprise technology, impact investing, psychedelic medicine, and trying to make capitalism less extractive. CEO of RampRate. Co-founder of ImpactSoul.",
  url: "https://tonygreenberg.com",
  image: DEFAULT_IMAGE,
  sameAs: [
    "https://www.linkedin.com/in/tonygreenberg",
    "https://x.com/ThinkTony",
    "https://www.huffpost.com/author/tony-greenberg",
    "https://tonygreenberg.com",
  ],
  worksFor: [
    {
      "@type": "Organization",
      name: "RampRate",
      url: "https://ramprate.com",
    },
    {
      "@type": "Organization",
      name: "ImpactSoul",
      url: "https://impactsoul.org",
    },
  ],
  knowsAbout: [
    "Enterprise Technology Procurement",
    "Impact Investing",
    "Psychedelic Medicine",
    "Tokenization",
    "Conscious Capitalism",
    "Peptide Therapeutics",
    "Systems Thinking",
    "Venture Capital",
  ],
};

export default function SEO({
  title,
  description,
  path = "",
  image = DEFAULT_IMAGE,
  type = "website",
  publishDate,
  author = "Tony Greenberg",
  category,
  keywords,
  indexable = true,
}: SEOProps) {
  useEffect(() => {
    // Set document title — keep under 60 chars for SEO
    const fullTitle = `${title} | ${BASE_TITLE}`;
    document.title = title === "Home" ? BASE_TITLE : (fullTitle.length > 60 ? title : fullTitle);

    // Detect if running on manus.space (staging) — force noindex regardless
    const isManusSpace = typeof window !== "undefined" && window.location.hostname.includes("manus.space");

    // Helper to set/create meta tags
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Standard meta
    setMeta("name", "description", description);
    if (keywords) setMeta("name", "keywords", keywords);

    // Copyright & Rights
    setMeta("name", "author", "Tony \"WhyNot\" Greenberg");
    setMeta("name", "copyright", `© ${new Date().getFullYear()} Tony Greenberg. All rights reserved.`);

    // Robots: if on manus.space, ALWAYS noindex regardless of page setting
    if (isManusSpace) {
      setMeta("name", "robots", "noindex, nofollow, noarchive, nosnippet, noimageindex");
      setMeta("name", "googlebot", "noindex, nofollow");
    } else if (indexable) {
      setMeta("name", "robots", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
      setMeta("name", "googlebot", "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1");
    } else {
      setMeta("name", "robots", "noindex, nofollow, noarchive, nosnippet, noimageindex");
      setMeta("name", "googlebot", "noindex, nofollow");
    }
    setMeta("name", "rights", "All content is the exclusive property of Tony Greenberg and/or RampRate, Inc.");

    // Dynamic canonical link — always points to tonygreenberg.com
    const canonicalPath = path || (typeof window !== "undefined" ? window.location.pathname : "");
    const canonicalHref = `https://tonygreenberg.com${canonicalPath}`;
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute("href", canonicalHref);

    // Resolve image to absolute URL for social crawlers
    const absoluteImage = image.startsWith("/")
      ? `https://tonygreenberg.com${image}`
      : image;

    // For articles, use just the title (no site suffix) so the preview is about the content
    const ogTitle = type === "article" ? title : (title === "Home" ? BASE_TITLE : `${title} | Tony Greenberg`);

    // Open Graph
    setMeta("property", "og:title", ogTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", absoluteImage);
    setMeta("property", "og:image:width", "1200");
    setMeta("property", "og:image:height", "630");
    setMeta("property", "og:image:alt", ogTitle);
    setMeta("property", "og:type", type === "article" ? "article" : "website");
    setMeta("property", "og:site_name", "Tony Greenberg");
    if (path) {
      setMeta("property", "og:url", `https://tonygreenberg.com${path}`);
    }
    if (type === "article" && publishDate) {
      setMeta("property", "article:published_time", publishDate);
      setMeta("property", "article:modified_time", publishDate);
      setMeta("property", "article:author", "https://tonygreenberg.com");
      setMeta("property", "article:publisher", "https://tonygreenberg.com");
      if (category) setMeta("property", "article:section", category);
    }

    // Twitter Card
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:site", "@ThinkTony");
    setMeta("name", "twitter:creator", "@ThinkTony");
    setMeta("name", "twitter:domain", "tonygreenberg.com");
    setMeta("name", "twitter:title", ogTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", absoluteImage);
    setMeta("name", "twitter:image:alt", ogTitle);

    // JSON-LD Structured Data
    const existingLd = document.querySelector('script[data-seo-ld]');
    if (existingLd) existingLd.remove();

    const ldScript = document.createElement("script");
    ldScript.type = "application/ld+json";
    ldScript.setAttribute("data-seo-ld", "true");

    const currentUrl = `https://tonygreenberg.com${canonicalPath}`;

    if (type === "article" && publishDate) {
      // Rich Article schema with breadcrumb
      const breadcrumbSegments = canonicalPath.split("/").filter(Boolean);
      const breadcrumbItems = [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://tonygreenberg.com" },
        { "@type": "ListItem", position: 2, name: "Essays", item: "https://tonygreenberg.com/blog" },
        { "@type": "ListItem", position: 3, name: title, item: currentUrl },
      ];

      ldScript.textContent = JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": `${currentUrl}#article`,
          headline: title,
          description: description,
          image: {
            "@type": "ImageObject",
            url: absoluteImage,
            width: 1200,
            height: 630,
          },
          datePublished: publishDate,
          dateModified: new Date().toISOString().split("T")[0],
          author: TONY_PERSON,
          publisher: {
            "@type": "Person",
            name: "Tony Greenberg",
            url: "https://tonygreenberg.com",
            logo: {
              "@type": "ImageObject",
              url: DEFAULT_IMAGE,
            },
          },
          ...(category ? { articleSection: category } : {}),
          ...(keywords ? { keywords: keywords } : {}),
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": currentUrl,
          },
          url: currentUrl,
          isPartOf: {
            "@type": "WebSite",
            "@id": "https://tonygreenberg.com/#website",
            name: "Tony Greenberg",
            url: "https://tonygreenberg.com",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbItems,
        },
      ]);
    } else {
      // WebSite + Person schema with SearchAction
      ldScript.textContent = JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": "https://tonygreenberg.com/#website",
          name: "Tony Greenberg",
          alternateName: ["Tony Greenberg — Only Time Buys Trust", "Tony WhyNot Greenberg", "tonygreenberg.com"],
          description: "Exposing the extractive. Building what replaces it. 25 years of enterprise technology, impact investing, and systems thinking.",
          url: "https://tonygreenberg.com",
          author: TONY_PERSON,
          publisher: TONY_PERSON,
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://tonygreenberg.com/search?q={search_term_string}",
            },
            "query-input": "required name=search_term_string",
          },
          inLanguage: "en-US",
        },
        {
          ...TONY_PERSON,
          "@context": "https://schema.org",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": "https://tonygreenberg.com",
          },
        },
      ]);
    }

    document.head.appendChild(ldScript);

    return () => {
      const el = document.querySelector('script[data-seo-ld]');
      if (el) el.remove();
    };
  }, [title, description, path, image, type, publishDate, author, category, keywords, indexable]);

  return null;
}
