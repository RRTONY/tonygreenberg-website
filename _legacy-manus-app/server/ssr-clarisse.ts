/**
 * Server-Side Rendering for the Clarisse Abelarde article.
 * Serves full HTML (article prose, JSON-LD, OG tags) to search engine bots
 * and AI crawlers so the content is indexable and quotable.
 */
import fs from "fs";
import path from "path";
import { marked } from "marked";

// The one open-access article slug
const OPEN_SLUG = "is-that-a-lot-clarisse-abelarde";
const BASE_URL = "https://tonygreenberg.com";
const OG_IMAGE = `${BASE_URL}/api/img/8._ca5476c0.jpeg`;

// Bot user-agents that should receive SSR content
const BOT_UA_PATTERNS = [
  /googlebot/i, /bingbot/i, /yandexbot/i, /duckduckbot/i,
  /slurp/i, /baiduspider/i, /facebookexternalhit/i,
  /twitterbot/i, /linkedinbot/i, /whatsapp/i,
  /telegrambot/i, /discordbot/i, /slackbot/i,
  /applebot/i, /pinterestbot/i,
  /gptbot/i, /chatgpt-user/i, /claudebot/i, /anthropic-ai/i,
  /claude-webfetch/i, /claude-searchbot/i, /anthropic/i,
  /perplexitybot/i, /cohere-ai/i, /google-extended/i,
  /ia_archiver/i, /archive\.org_bot/i,
  /curl/i, /wget/i, /python-requests/i, /node-fetch/i, /httpx/i,
  /webfetch/i, /aiohttp/i, /go-http-client/i, /okhttp/i,
  /petalbot/i, /semrushbot/i, /ahrefsbot/i, /mj12bot/i,
];

/** Check if a user-agent is a bot/crawler */
export function isBotUA(ua: string): boolean {
  return BOT_UA_PATTERNS.some(pattern => pattern.test(ua));
}

/** Check if the request path is the open-access article */
export function isOpenArticlePath(reqPath: string): boolean {
  const cleaned = reqPath.replace(/\/$/, ""); // strip trailing slash
  return cleaned === `/blog/${OPEN_SLUG}`;
}

/** Load and render the article content */
function getArticleData(): { title: string; summary: string; date: string; author: string; content: string; htmlContent: string } | null {
  try {
    const blogDataPath = path.resolve(import.meta.dirname, "../client/src/data/blogData.json");
    const blogData = JSON.parse(fs.readFileSync(blogDataPath, "utf-8"));
    const article = blogData.find((p: any) => p.slug === OPEN_SLUG);
    if (!article) return null;

    // Convert markdown content to HTML
    const htmlContent = marked.parse(article.content, { async: false }) as string;

    return {
      title: article.title,
      summary: article.summary,
      date: article.date || "May 21, 2026",
      author: article.author || "Tony Greenberg",
      content: article.content,
      htmlContent,
    };
  } catch (e) {
    console.error("[SSR] Failed to load article data:", e);
    return null;
  }
}

/** Generate the full SSR HTML page for the Clarisse article */
export function renderClarisseArticleHTML(): string | null {
  const article = getArticleData();
  if (!article) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    image: OG_IMAGE,
    author: {
      "@type": "Person",
      name: "Tony Greenberg",
      url: `${BASE_URL}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: "Tony Greenberg",
      url: BASE_URL,
    },
    datePublished: "2026-05-21",
    dateModified: new Date().toISOString().split("T")[0],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${OPEN_SLUG}`,
    },
    articleSection: "Culture & Communication",
    keywords: ["Clarisse Abelarde", "contemporary art", "figurative painting", "Instagram censorship", "palette knife painting", "Cam Roll II", "art world", "viral art"],
  };

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${article.title}</title>
  <meta name="description" content="${escapeAttr(article.summary)}" />
  <meta name="author" content="${article.author}" />
  <meta name="robots" content="index, follow, archive, imageindex" />
  <meta name="googlebot" content="index, follow" />
  <link rel="canonical" href="${BASE_URL}/blog/${OPEN_SLUG}" />

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeAttr(article.title)}" />
  <meta property="og:description" content="${escapeAttr(article.summary)}" />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta property="og:image:width" content="4500" />
  <meta property="og:image:height" content="3620" />
  <meta property="og:image:alt" content="Cam Roll II by Clarisse Abelarde — oil on canvas, palette knife, 22x13 inches — a grid of camera roll moments rendered in thick impasto" />
  <meta property="og:url" content="${BASE_URL}/blog/${OPEN_SLUG}" />
  <meta property="og:site_name" content="Tony Greenberg" />
  <meta property="og:locale" content="en_US" />
  <meta property="article:published_time" content="2026-05-21T00:00:00Z" />
  <meta property="article:author" content="https://tonygreenberg.com/about" />
  <meta property="article:section" content="Culture & Communication" />
  <meta property="article:tag" content="Clarisse Abelarde" />
  <meta property="article:tag" content="Contemporary Art" />
  <meta property="article:tag" content="Instagram Censorship" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@ThinkTony" />
  <meta name="twitter:creator" content="@ThinkTony" />
  <meta name="twitter:title" content="${escapeAttr(article.title)}" />
  <meta name="twitter:description" content="${escapeAttr(article.summary)}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />
  <meta name="twitter:image:alt" content="Cam Roll II by Clarisse Abelarde — oil on canvas, palette knife, 22x13 inches" />

  <!-- JSON-LD Structured Data -->
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>

  <style>
    body { font-family: 'Source Sans 3', 'Source Sans Pro', -apple-system, sans-serif; max-width: 720px; margin: 0 auto; padding: 2rem 1rem; line-height: 1.7; color: #1a1a1a; background: #FAFAF7; }
    h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 2.2rem; line-height: 1.2; margin-bottom: 0.5rem; }
    h2 { font-family: 'Playfair Display', Georgia, serif; font-size: 1.6rem; margin-top: 2.5rem; }
    img { max-width: 100%; height: auto; border-radius: 4px; margin: 1.5rem 0; }
    a { color: #8B6914; }
    .meta { color: #666; font-size: 0.9rem; margin-bottom: 2rem; }
    blockquote { border-left: 3px solid #D4B96A; padding-left: 1rem; margin-left: 0; font-style: italic; color: #444; }
    hr { border: none; border-top: 1px solid #e0e0e0; margin: 2.5rem 0; }
    .article-footer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid #e0e0e0; font-size: 0.9rem; color: #666; }
  </style>
  <!-- Google Search Console Verification -->
  <meta name="google-site-verification" content="LQaaihFDlOKA7Ss4kjGxfoxV4lESbtBfDANA92BMM9k" />
  <meta name="google-site-verification" content="2hxApw8im70U8QDy4paYiyez268CR69g97hfCWoDMGs" />
</head>
<body>
  <article>
    <header>
      <h1>${article.title}</h1>
      <p class="meta">By <a href="${BASE_URL}/about">${article.author}</a> · Published ${article.date} · <a href="${BASE_URL}/blog/${OPEN_SLUG}">Read on tonygreenberg.com</a></p>
      <figure>
        <img src="${OG_IMAGE}" alt="Cam Roll II by Clarisse Abelarde — oil on canvas, palette knife, 22x13 inches — a grid of camera roll moments rendered in thick impasto" width="4500" height="3620" sizes="(max-width: 768px) 100vw, 1200px" loading="lazy" />
        <figcaption>Cam Roll II by Clarisse Abelarde. Oil on canvas, palette knife. 22×13 inches.</figcaption>
      </figure>
    </header>
    <section id="article-body">
      ${article.htmlContent}
    </section>
    <footer class="article-footer">
      <p><strong>${article.author}</strong> is Founder & CEO of <a href="https://ramprate.com">RampRate</a> and Founder of <a href="https://impactsoul.is">ImpactSoul</a>.</p>
      <p><a href="${BASE_URL}/blog/${OPEN_SLUG}">View the full interactive version →</a></p>
    </footer>
  </article>
</body>
</html>`;

  return html;
}

function escapeAttr(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
