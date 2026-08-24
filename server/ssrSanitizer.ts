const SITE = "https://tonygreenberg.com";
const DEFAULT_IMAGE = `${SITE}/api/img/tony-headshot_2d63de23.jpg`;

const escapeHtml = (value: string) => value
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const stripTags = (value: string) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

/**
 * Final safety layer for bot-visible HTML. It never changes the interactive page;
 * it makes server output coherent when a legacy renderer omitted modern SEO fields.
 */
export function sanitizeCrawlerHtml(html: string, canonical: string): string {
  const title = stripTags(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "Tony Greenberg");
  const rawDescription = html.match(/<meta\b(?=[^>]*\bname=["']description["'])[^>]*\bcontent=(["'])([\s\S]*?)\1/i)?.[2] || "";
  const description = rawDescription.trim().length >= 70 && !rawDescription.includes("Explore Tony Greenberg's work on systems")
    ? rawDescription.trim()
    : `${title}. Explore Tony Greenberg's public work, essays, tools, and research on systems, trust, capital, impact, and human potential.`;

  html = html
    .replace(/https?:\/\/(?:private-us-east-1|files)\.manuscdn\.com[^"'\s<)]*/gi, DEFAULT_IMAGE)
    .replace(/(?:https?:\/\/tonygreenberg\.com)?\/manus-storage\/([^"'\s<)]+)/gi, `${SITE}/api/img/$1`)
    .replace(/(?:\$\{BASE_URL\}|https?:\/\/tonygreenberg\.com)\/og-default\.jpg/gi, DEFAULT_IMAGE);

  if (/<meta[^>]+name=["']description["']/i.test(html)) {
    html = html.replace(/(<meta\b(?=[^>]*\bname=["']description["'])[^>]*\bcontent=)(["'])([\s\S]*?)\2/i, (_match, prefix, quote) => `${prefix}${quote}${escapeHtml(description)}${quote}`);
  } else {
    html = html.replace("</head>", `  <meta name="description" content="${escapeHtml(description)}" />\n</head>`);
  }

  html = html
    .replace(/(<meta\b(?=[^>]*\bproperty=["']og:description["'])[^>]*\bcontent=)(["'])([\s\S]*?)\2/i, (_match, prefix, quote) => `${prefix}${quote}${escapeHtml(description)}${quote}`)
    .replace(/(<meta\b(?=[^>]*\bname=["']twitter:description["'])[^>]*\bcontent=)(["'])([\s\S]*?)\2/i, (_match, prefix, quote) => `${prefix}${quote}${escapeHtml(description)}${quote}`);

  const imageTags = `  <meta property="og:image" content="${DEFAULT_IMAGE}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${escapeHtml(title)}" />
  <meta name="twitter:image" content="${DEFAULT_IMAGE}" />`;
  if (!/<meta[^>]+property=["']og:image["']/i.test(html)) {
    html = html.replace("</head>", `${imageTags}\n</head>`);
  }

  if (!/application\/ld\+json/i.test(html)) {
    const schema = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: canonical,
      isPartOf: { "@type": "WebSite", name: "Tony Greenberg", url: SITE },
      author: { "@type": "Person", name: "Tony Greenberg", url: `${SITE}/about` },
    });
    html = html.replace("</head>", `  <script type="application/ld+json">${schema}</script>\n</head>`);
  }

  let headingCount = 0;
  html = html.replace(/<h1([^>]*)>([\s\S]*?)<\/h1>/gi, (_match, attrs, content) => {
    headingCount += 1;
    return headingCount === 1 ? `<h1${attrs}>${content}</h1>` : `<h2${attrs}>${content}</h2>`;
  });
  if (headingCount === 0) {
    html = html.replace(/<body([^>]*)>/i, `<body$1>\n  <h1>${escapeHtml(title)}</h1>`);
  }

  const textLength = stripTags(html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "")).length;
  if (textLength < 500) {
    const context = `<section data-crawler-context="true"><h2>What this page covers</h2><p>${escapeHtml(description)}</p><p>This public Tony Greenberg page is part of a connected body of work on technology, capital, health, impact, and human potential. The interactive version contains the complete tools, references, and pathways for readers.</p></section>`;
    html = html.replace("</body>", `${context}\n</body>`);
  }
  return html;
}
