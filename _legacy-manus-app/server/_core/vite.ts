import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";
import { buildMetaTags } from "../seo-meta";
import { sanitizeCrawlerHtml } from "../ssrSanitizer";

// Article-specific OG meta injection for blog posts
// This ensures ALL user-agents (LinkedInBot, Twitterbot, WhatsApp, iMessage, etc.)
// receive the correct OG tags in the initial HTML response.
const CLARISSE_SLUG = "/blog/is-that-a-lot-clarisse-abelarde";
const MOAT_SLUG = "/blog/you-are-the-moat";
const MOAT_OG = {
  title: "You Are the Moat",
  description: "100 out of 40,000 undergraduates showed up to learn about the technology automating their future careers. 0.25%. The asset class that got you hired for two hundred years \u2014 competence \u2014 just hit zero. The new asset class is you.",
  image: "https://tonygreenberg.com/api/img/alison-zai-looming-feeling_d5f0e71d.png",
  url: "https://tonygreenberg.com/blog/you-are-the-moat",
};
const DECAF_SLUG = "/brewsoul/decaf";
const DECAF_OG = {
  title: "Swiss Water Decaf: Paint Stripper or Pure Water? | BrewSoul",
  description: "Swiss Water Process decaf vs methylene chloride vs supercritical CO\u2082. Carbon footprint comparison, 13 clean brands ranked, 10+ dirty brands exposed. The complete guide to chemical-free decaffeinated coffee.",
  image: "https://tonygreenberg.com" + "/api/img/" + "brewsoul-decaf-hero.jpg",
  url: "https://tonygreenberg.com/brewsoul/decaf",
};
const AKBAR_SLUG = "/akbar";
const AKBAR_OG = {
  title: "Los Angeles Is Losing Its Memory \u2014 Akbar Cuisine Refuses to Forget | Tony Greenberg",
  description: "While Los Angeles optimizes itself into a content factory, one restaurant on Washington Boulevard keeps doing the thing modern dining forgot: restore people. A field report on restoration economics.",
  image: "https://tonygreenberg.com/manus-storage/slider-1_2acbdfd3.jpg",
  url: "https://tonygreenberg.com/akbar",
};
const FRQNCY_SLUG = "/blog/frqncy-the-bus-that-restores-the-world";
const FRQNCY_OG = {
  title: "FRQNCY: The Bus That Restores the World",
  description: "TimoTree drives a bus. Inside: frequency healing, red light therapy, sound therapy, breathwork. A portable room of coherence the world can step inside. No app. No subscription. Just the bus, the field, and nervous systems finally unclenching.",
  image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663242884547/gXhndHxpF4hLjcgkrqbdCP/frqncy-hero-WhZ7bjvgjkK4pciAf4Kq3K.webp",
  url: "https://tonygreenberg.com/blog/frqncy-the-bus-that-restores-the-world",
};
const CLARISSE_OG = {
  title: "Is That A Lot? On Clarisse Abelarde\u2019s Magnificent Painting, a Cameo I Didn\u2019t Know I Was In, and What the Algorithm Tried to Hide",
  description: "975,900 views in three days. 626,000 on a single painting. Meta made $11,500 from her work. Clarisse Abelarde made $0. A sensitivity screen from Instagram. A thirty-thousand-year-old Venus figurine censored by Facebook. And my beloved asking if nearly a million people constitutes a meaningful number.",
  image: "https://tonygreenberg.com/api/img/8._ca5476c0.jpeg",
  url: "https://tonygreenberg.com/blog/is-that-a-lot-clarisse-abelarde",
};

function injectBlogOG(html: string, reqUrl: string): string {
  const cleanPath = reqUrl.split("?")[0].replace(/\/$/, "");
  // Determine which article's OG to inject
  let og: typeof CLARISSE_OG | typeof MOAT_OG | typeof DECAF_OG | typeof FRQNCY_OG | typeof AKBAR_OG | null = null;
  let articleTags: string = "";
  if (cleanPath === CLARISSE_SLUG) {
    og = CLARISSE_OG;
    articleTags = `
  <meta property="article:tag" content="Clarisse Abelarde" />
  <meta property="article:tag" content="Contemporary Art" />`;
  } else if (cleanPath === MOAT_SLUG) {
    og = MOAT_OG;
    articleTags = `
  <meta property="article:tag" content="Gen Z" />
  <meta property="article:tag" content="AI" />
  <meta property="article:tag" content="Future of Work" />`;
  } else if (cleanPath === FRQNCY_SLUG) {
    og = FRQNCY_OG;
    articleTags = `
  <meta property="article:tag" content="TimoTree" />
  <meta property="article:tag" content="FRQNCY" />
  <meta property="article:tag" content="frequency healing" />
  <meta property="article:tag" content="red light therapy" />
  <meta property="article:tag" content="community wellness" />
  <meta property="article:tag" content="sound therapy" />
  <meta name="keywords" content="TimoTree, FRQNCY bus, mobile frequency healing, red light therapy bus, community wellness bus, sound therapy breathwork" />`;
  } else if (cleanPath === AKBAR_SLUG) {
    og = AKBAR_OG;
    articleTags = `
  <meta property="article:tag" content="Akbar Cuisine" />
  <meta property="article:tag" content="Indian Restaurant" />
  <meta property="article:tag" content="Marina del Rey" />
  <meta property="article:tag" content="Restoration Economics" />
  <meta name="keywords" content="Akbar Cuisine of India, Indian restaurant Marina del Rey, restoration economics, tandoori, garlic naan, wine pairing Indian food" />`;
  } else if (cleanPath === DECAF_SLUG) {
    og = DECAF_OG;
    articleTags = `
  <meta property="article:tag" content="Swiss Water Process" />
  <meta property="article:tag" content="Swiss Water Decaf" />
  <meta property="article:tag" content="decaf coffee" />
  <meta property="article:tag" content="chemical-free decaf" />
  <meta property="article:tag" content="methylene chloride" />
  <meta property="article:tag" content="carbon footprint coffee" />
  <meta name="keywords" content="Swiss Water decaf, Swiss Water Process, chemical-free decaf, decaffeinated coffee, methylene chloride coffee, CO2 decaf, carbon footprint decaf, clean decaf brands, best decaf coffee" />`;
  }
  if (!og) return html;

  // Replace the default OG tags with article-specific ones
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${og.title}</title>`
  );
  html = html.replace(
    /<meta name="description" content="[^"]*" \/>/,
    `<meta name="description" content="${og.description}" \/>`
  );
  html = html.replace(
    /<meta property="og:title" content="[^"]*" \/>/,
    `<meta property="og:title" content="${og.title}" \/>`
  );
  html = html.replace(
    /<meta property="og:description" content="[^"]*" \/>/,
    `<meta property="og:description" content="${og.description}" \/>`
  );
  html = html.replace(
    /<meta property="og:type" content="[^"]*" \/>/,
    `<meta property="og:type" content="article" \/>`
  );
  html = html.replace(
    /<meta property="og:url" content="[^"]*" \/>/,
    `<meta property="og:url" content="${og.url}" \/>`
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${og.url}" \/>`
  );
  html = html.replace(
    /<meta name="twitter:card" content="[^"]*" \/>/,
    `<meta name="twitter:card" content="summary_large_image" \/>`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*" \/>/,
    `<meta name="twitter:title" content="${og.title}" \/>`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*" \/>/,
    `<meta name="twitter:description" content="${og.description}" \/>`
  );

  // Inject og:image, twitter:image, and supplementary social tags
  const ogImageTags = `
  <meta property="og:image" content="${og.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${og.title}" />
  <meta property="og:site_name" content="Tony Greenberg" />
  <meta property="og:locale" content="en_US" />
  <meta property="article:published_time" content="2026-05-23T00:00:00Z" />
  <meta property="article:author" content="https://tonygreenberg.com/about" />${articleTags}
  <meta name="twitter:site" content="@ThinkTony" />
  <meta name="twitter:creator" content="@ThinkTony" />
  <meta name="twitter:image" content="${og.image}" />
  <meta name="twitter:image:alt" content="${og.title}" />
  <meta name="robots" content="index, follow" />`;

  // Insert after the twitter:description meta tag
  html = html.replace(
    /(<meta name="twitter:description" content="[^"]*" \/>)/,
    `$1${ogImageTags}`
  );

  return html;
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");

      // Inject dynamic per-page SEO meta tags for ALL pages
      const reqPath = url.split("?")[0];
      const metaTags = buildMetaTags(reqPath);
      // Replace the seo-meta block (between comment markers) with dynamic per-page tags
      template = template.replace(
        /<!--seo-meta-start-->[\s\S]*?<!--seo-meta-end-->/,
        `<!--seo-meta-start-->\n  ${metaTags}\n  <!--seo-meta-end-->`
      );

      // Inject article-specific OG meta tags for blog posts (all UAs) — overrides dynamic for specific articles
      template = injectBlogOG(template, url);
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/entry-client.tsx?v=${nanoid()}"`
      );

      // Transform the HTML template through Vite (handles HMR, module transforms)
      let page = await vite.transformIndexHtml(url, template);

      // Attempt React 18 SSR: render the app to HTML and inject into the template
      try {
        const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
        const urlPath = url.split("?")[0];
        const appHtml = await render(urlPath);
        const crawlerSafeAppHtml = appHtml.replace(
          /https?:\/\/(?:private-us-east-1\.manuscdn\.com|files\.manuscdn\.com)[^"'\s<]*/gi,
          "https://tonygreenberg.com/api/img/tony-headshot_2d63de23.jpg",
        );
        page = page.replace("<!--ssr-outlet-->", crawlerSafeAppHtml);
      } catch (ssrErr) {
        // SSR render failed (browser-only component, etc.) — fall back to CSR shell
        console.warn("[SSR] render failed for", url, "— falling back to CSR:", (ssrErr as Error).message);
      }

      res.status(200).set({ "Content-Type": "text/html" }).end(sanitizeCrawlerHtml(page, `https://tonygreenberg.com${reqPath}`));
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath, { index: false }));

  // fall through to index.html if the file doesn't exist
  // Inject dynamic SEO meta tags + article-specific OG tags in production
  app.use("*", (req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    let html = fs.readFileSync(indexPath, "utf-8");
    const reqPath = req.originalUrl.split("?")[0];
    const metaTags = buildMetaTags(reqPath);
    html = html.replace(
      /<!--seo-meta-start-->[\s\S]*?<!--seo-meta-end-->/,
      `<!--seo-meta-start-->\n  ${metaTags}\n  <!--seo-meta-end-->`
    );
    html = injectBlogOG(html, req.originalUrl);
    res.status(200).set({ "Content-Type": "text/html" }).send(sanitizeCrawlerHtml(html, `https://tonygreenberg.com${reqPath}`));
  });
}
