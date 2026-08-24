/**
 * Server-Side Rendering for "The Molecule as Mirror: From Substance to Service"
 * Serves full semantic HTML (article prose, JSON-LD, OG tags) to search engine bots
 * and AI crawlers so the content is indexable, quotable, and machine-legible.
 *
 * PERMANENT RULE: Every page unblocked for indexing MUST have server-rendered HTML.
 * Content must be visible in View Source without JavaScript execution.
 */
import fs from "fs";
import path from "path";
import { marked } from "marked";

const BASE_URL = "https://tonygreenberg.com";
const SLUG = "the-molecule-as-mirror-from-substance-to-service";
const CANONICAL = `${BASE_URL}/blog/${SLUG}`;

function getArticleData() {
  try {
    const blogDataPath = path.resolve(import.meta.dirname, "../client/src/data/blogData.json");
    const blogData = JSON.parse(fs.readFileSync(blogDataPath, "utf-8"));
    const article = blogData.find((p: any) => p.slug === SLUG);
    if (!article) return null;
    const content = article.originalContent || article.updatedContent || article.content || "";
    const htmlContent = marked.parse(content, { async: false }) as string;
    return {
      title: article.title,
      summary: article.summary,
      date: article.date || "February 15, 2026",
      author: article.author || "Tony Greenberg",
      category: article.category || "Living Well",
      keywords: article.keywords || [],
      heroImage: article.heroImage || article.image || "",
      htmlContent,
    };
  } catch (e) {
    console.error("[SSR] Failed to load Molecule as Mirror data:", e);
    return null;
  }
}

function escapeAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function renderMoleculeMirrorHTML(): string | null {
  const article = getArticleData();
  if (!article) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    image: article.heroImage,
    author: {
      "@type": "Person",
      name: "Tony Greenberg",
      url: `${BASE_URL}/about`,
    },
    publisher: {
      "@type": "Person",
      name: "Tony Greenberg",
      url: BASE_URL,
    },
    datePublished: "2026-02-15",
    dateModified: new Date().toISOString().split("T")[0],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": CANONICAL,
    },
    articleSection: article.category,
    keywords: article.keywords,
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeAttr(article.title)} — Tony Greenberg</title>
  <meta name="description" content="${escapeAttr(article.summary)}" />
  <meta name="author" content="Tony Greenberg" />
  <meta name="robots" content="index, follow, archive, imageindex" />
  <meta name="googlebot" content="index, follow" />
  <link rel="canonical" href="${CANONICAL}" />
  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeAttr(article.title)}" />
  <meta property="og:description" content="${escapeAttr(article.summary)}" />
  <meta property="og:image" content="${article.heroImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${escapeAttr(article.title)}" />
  <meta property="og:url" content="${CANONICAL}" />
  <meta property="og:site_name" content="Tony Greenberg" />
  <meta property="og:locale" content="en_US" />
  <meta property="article:published_time" content="2026-02-15T00:00:00Z" />
  <meta property="article:author" content="https://tonygreenberg.com/about" />
  <meta property="article:section" content="${escapeAttr(article.category)}" />
  ${article.keywords.slice(0, 5).map((k: string) => `<meta property="article:tag" content="${escapeAttr(k)}" />`).join("\n  ")}
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@ThinkTony" />
  <meta name="twitter:creator" content="@ThinkTony" />
  <meta name="twitter:title" content="${escapeAttr(article.title)}" />
  <meta name="twitter:description" content="${escapeAttr(article.summary)}" />
  <meta name="twitter:image" content="${article.heroImage}" />
  <meta name="twitter:image:alt" content="${escapeAttr(article.title)}" />
  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  <style>
    body { font-family: 'Source Sans 3', 'Source Sans Pro', -apple-system, sans-serif; max-width: 720px; margin: 0 auto; padding: 2rem 1rem; line-height: 1.7; color: #1a1a1a; background: #FAFAF7; }
    h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 2.2rem; line-height: 1.2; margin-bottom: 0.5rem; }
    h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.6rem; margin-top: 2.5rem; }
    h3 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.3rem; margin-top: 2rem; }
    img { max-width: 100%; height: auto; border-radius: 4px; margin: 1.5rem 0; }
    a { color: #8B6914; }
    .meta { color: #666; font-size: 0.9rem; margin-bottom: 2rem; }
    blockquote { border-left: 3px solid #D4B96A; padding-left: 1rem; margin-left: 0; font-style: italic; color: #444; }
    hr { border: none; border-top: 1px solid #e0e0e0; margin: 2.5rem 0; }
    .article-footer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #e0e0e0; font-size: 0.9rem; color: #666; }
    ul, ol { padding-left: 1.5rem; }
    li { margin-bottom: 0.5rem; }
    code { background: #f0f0f0; padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.9em; }
  </style>
  <!-- Google Search Console Verification -->
  <meta name="google-site-verification" content="LQaaihFDlOKA7Ss4kjGxfoxV4lESbtBfDANA92BMM9k" />
  <meta name="google-site-verification" content="2hxApw8im70U8QDy4paYiyez268CR69g97hfCWoDMGs" />
</head>
<body>
  <article>
    <header>
      <h1>${escapeAttr(article.title)}</h1>
      <p class="meta">By <a href="${BASE_URL}/about">Tony Greenberg</a> · ${article.date} · ${article.category} · <a href="${CANONICAL}">Read on tonygreenberg.com</a></p>
      ${article.heroImage ? `<img src="${article.heroImage}" alt="${escapeAttr(article.title)}" sizes="(max-width: 768px) 100vw, 1200px" loading="lazy" />` : ""}
    </header>
    <section id="article-body">
      ${article.htmlContent}
    </section>
    <footer class="article-footer">
      <p><strong>Tony Greenberg</strong> is Founder &amp; CEO of <a href="https://ramprate.com">RampRate</a> and Founder of <a href="https://impactsoul.is">ImpactSoul</a>. He is an investor in MycoMedica Life Sciences (Paul Stamets's patent portfolio company) and has spoken alongside Ray Kurzweil on the future of human augmentation.</p>
      <p><a href="${CANONICAL}">View the full interactive version →</a></p>
    </footer>
  </article>
</body>
</html>`;
  return html;
}
