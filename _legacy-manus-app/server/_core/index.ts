import "dotenv/config";
import express from "express";
import { createServer } from "http";
import fs from "fs";
import net from "net";
import path from "path";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { imageProxyRouter } from "../imageProxy";
import { sanitizeCrawlerHtml } from "../ssrSanitizer";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { verifyWebhookSignature, handleWebhookEvent } from "../stripe";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // ── Stripe Webhook (MUST be before express.json() for signature verification) ──
  app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    if (!sig) {
      res.status(400).json({ error: "Missing stripe-signature header" });
      return;
    }
    try {
      const event = verifyWebhookSignature(req.body, sig);
      const result = await handleWebhookEvent(event);
      res.json(result);
    } catch (err: any) {
      console.error("[Stripe Webhook] Error:", err.message);
      res.status(400).json({ error: err.message });
    }
  });

  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Trust proxy (required for rate limiting behind reverse proxy)
  app.set("trust proxy", 1);


  // ── Spam Inbound Email Webhook ──
  const { registerSpamInboundWebhook } = await import("../spam-inbound-webhook");
  registerSpamInboundWebhook(app);

  // ── Rate limiting (anti-scraping) ──
  const { rateLimit } = await import("express-rate-limit");
  const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 300, // 300 requests per minute per IP (generous for SPA with many assets)
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests. Slow down.",
    skip: (req) => {
      // Skip rate limiting for app API calls and static assets
      if (req.path.startsWith("/api/")) return true;
      if (req.path.startsWith("/src/")) return true; // Vite dev assets
      if (req.path.startsWith("/@")) return true; // Vite internal
      if (req.path.startsWith("/node_modules/")) return true;
      if (req.path.match(/\.(js|css|png|jpg|jpeg|webp|svg|ico|woff2?|ttf|eot|map)$/)) return true;
      return false;
    },
  });
  app.use(limiter);

  // ── Redirect manus.space → tonygreenberg.com ──
  // Check multiple header sources since platform/Cloudflare may rewrite Host
  app.use((req, res, next) => {
    const hostSources = [
      req.hostname,
      req.headers.host,
      req.headers["x-forwarded-host"] as string,
      req.headers["x-original-host"] as string,
    ].filter(Boolean).map(h => (h as string).toLowerCase());
    
    const isManusSpace = hostSources.some(h => h.includes("manus.space"));
    
    if (isManusSpace) {
      // Exception: allow API routes (OAuth, webhooks, tRPC)
      if (req.path.startsWith("/api/")) return next();
      const target = `https://tonygreenberg.com${req.originalUrl}`;
      // Send HTML redirect that browsers always follow (not plain text)
      return res.status(301).set({
        "Location": target,
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
      }).send(`<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${target}"><link rel="canonical" href="${target}"></head><body><script>window.location.replace("${target}")</script></body></html>`);
    }
    next();
  });

  // ── X-Robots-Tag for tonygreenberg.com ──
  // ALL pages are now open for indexing by search engines and AI agents.
  // Content protection is handled by bot-blocking middleware, not X-Robots-Tag.
  // API routes and internal paths get noindex to prevent crawling.
  app.use((req, res, next) => {
    if (req.path.startsWith("/api/") || req.path.startsWith("/.well-known/") || req.path.startsWith("/admin")) {
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
    } else {
      res.setHeader("X-Robots-Tag", "index, follow, archive, imageindex");
    }
    next();
  });

  // ── Honeypot trap: bans IPs that follow hidden links ──
  const bannedIPs = new Set<string>();
  // Load banned IPs from database on startup
  (async () => {
    try {
      const { getDb } = await import("../db");
      const { honeypotBans } = await import("../../drizzle/schema");
      const db = await getDb();
      if (!db) return;
      const rows = await db.select({ ip: honeypotBans.ip }).from(honeypotBans);
      rows.forEach((r: { ip: string }) => bannedIPs.add(r.ip));
      console.log(`[Honeypot] Loaded ${bannedIPs.size} banned IPs`);
    } catch (e) { /* table may not exist yet */ }
  })();

  // Block banned IPs immediately
  app.use((req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || "";
    if (bannedIPs.has(ip)) {
      return res.status(403).end();
    }
    next();
  });

  // Honeypot endpoint — hidden link that only bots follow
  app.get("/.well-known/admin-portal", async (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || "";
    bannedIPs.add(ip);
    // Persist to database
    try {
      const { getDb } = await import("../db");
      const { honeypotBans } = await import("../../drizzle/schema");
      const db = await getDb();
      if (!db) return;
      await db.insert(honeypotBans).values({
        ip,
        userAgent: req.headers["user-agent"] || "",
        path: req.path,
      }).onDuplicateKeyUpdate({ set: { userAgent: req.headers["user-agent"] || "" } });
    } catch (e) { /* best effort */ }
    console.log(`[Honeypot] Banned IP: ${ip}`);
    res.status(403).send("Access denied.");
  });

  // ── Bot/Scraper blocking middleware (allows bots on open-access articles) ──
  // ── AI Agents: ALLOWED to read content (Claude, ChatGPT, Perplexity, etc.) ──
  const AI_AGENTS = [
    /gptbot/i, /chatgpt-user/i, /oai-searchbot/i,
    /anthropic-ai/i, /claudebot/i, /claude-web/i,
    /perplexitybot/i, /perplexity-user/i,
    /cohere-ai/i, /google-extended/i,
    /meta-externalagent/i,
  ];

  // ── Scrapers & SEO bots: BLOCKED from non-open paths ──
  const BLOCKED_BOTS = [
    /mj12bot/i, /ahrefsbot/i, /semrushbot/i, /dotbot/i,
    /rogerbot/i, /screaming frog/i,
    /bytespider/i, /petalbot/i, /sogou/i,
    /httrack/i, /scrapy/i, /go-http-client/i,
    /java/i, /libwww-perl/i, /mechanize/i,
  ];
  // CCBot (Common Crawl) is allowed — feeds AI training datasets

  // ── Search engines: ALLOWED everywhere (needed for SEO) ──
  const SEARCH_ENGINES = [
    /googlebot/i, /bingbot/i, /yandexbot/i, /baiduspider/i,
    /duckduckbot/i, /slurp/i, /applebot/i,
  ];

  // Open-access paths that ALL bots are allowed to crawl
  // ALL paths are open — AI agents and search engines are allowed through
  // the middleware above. The BLOCKED_BOTS list handles bad actors.
  // This list is kept for legacy compatibility but effectively everything is open.
  const OPEN_ACCESS_PATHS = [
    "/", // Homepage
    "/blog/", // All blog posts
    "/humanos", // Human OS 2.0
    "/living-declaration", "/manifesto", // The Manifesto
    "/psychedelic-readiness-index",
    "/akbar",
    "/brewsoul", // BrewSoul coffee
    "/kava", // Kava section
    "/find-your-coffee",
    "/find-your-sake",
    "/about",
    "/articles", // Article archive
    "/impact-futurism", // Impact Futurism category page
    "/the-philosophy", // Philosophy page
    "/bio", // Redirects to /about
    "/impact-dashboard",
    "/attention-theft",
    "/alex-azzi",
    "/manus-storage/",
    "/api/img/",
    "/sitemap.xml",
    "/robots.txt",
    "/google6881a0411c48b301.html", // Google Search Console verification
  ];
  app.use((req, res, next) => {
    const ua = req.headers["user-agent"] || "";
    // Allow ALL bots on open-access paths
    if (OPEN_ACCESS_PATHS.some(p => req.path === p || req.path.startsWith(p))) {
      return next();
    }
    // Always allow AI agents (Claude, ChatGPT, Perplexity, etc.)
    if (AI_AGENTS.some(bot => bot.test(ua))) {
      return next();
    }
    // Always allow search engines (Google, Bing, etc.)
    if (SEARCH_ENGINES.some(bot => bot.test(ua))) {
      return next();
    }
    // Block known scrapers and SEO tools
    if (BLOCKED_BOTS.some(bot => bot.test(ua))) {
      return res.status(403).send("Access denied.");
    }
    next();
  });

  // ── SSR: Serve full article HTML to bots for open-access articles ──
  const { isBotUA, isOpenArticlePath, renderClarisseArticleHTML } = await import("../ssr-clarisse");
  const { renderAkbarArticleHTML } = await import("../ssr-akbar");
  const { renderMoleculeMirrorHTML } = await import("../ssr-molecule-mirror");
  const { renderPRIHTML } = await import("../ssr-pri");
  const { isIndexedBlogSlug, renderBlogPostHTML } = await import("../ssr-blog-batch");
  const { renderBrewSoulHTML } = await import("../ssr-brewsoul");
  const {
    renderSupplierIntakeHTML,
    renderFindYourPeptideHTML,
    renderPeptideQuiz25HTML,
    renderWhatsLegalHTML,
    renderEngageHTML,
    renderCommunityHTML,
    renderFindYourTherapyHTML,
    renderFindYourMeHTML,
    renderDharmaFinderHTML,
    renderGrantStudyHTML,
    renderLifeAssessmentHTML,
    renderSoulScoreHTML,
    renderProtectingYourBusinessHTML,
    renderCharityScorecardHTML,
  } = await import("../ssr-forms");

  app.get("/blog/is-that-a-lot-clarisse-abelarde", (req, res, next) => {
    const ua = req.headers["user-agent"] || "";
    if (!isBotUA(ua)) return next(); // Regular users get the SPA
    const renderedHtml = renderClarisseArticleHTML();
    if (!renderedHtml) return next();
    const html = sanitizeCrawlerHtml(renderedHtml, `https://tonygreenberg.com${req.path}`);
    res.status(200).set({
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "index, follow, archive, imageindex",
      "Cache-Control": "public, max-age=3600",
    }).send(html);
  });

  app.get("/akbar", (req, res, next) => {
    const ua = req.headers["user-agent"] || "";
    if (!isBotUA(ua)) return next(); // Regular users get the SPA
    const renderedHtml = renderAkbarArticleHTML();
    if (!renderedHtml) return next();
    const html = sanitizeCrawlerHtml(renderedHtml, `https://tonygreenberg.com${req.path}`);
    res.status(200).set({
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "index, follow, archive, imageindex",
      "Cache-Control": "public, max-age=3600",
    }).send(html);
  });

  app.get("/blog/the-molecule-as-mirror-from-substance-to-service", (req, res, next) => {
    const ua = req.headers["user-agent"] || "";
    if (!isBotUA(ua)) return next(); // Regular users get the SPA
    const renderedHtml = renderMoleculeMirrorHTML();
    if (!renderedHtml) return next();
    const html = sanitizeCrawlerHtml(renderedHtml, `https://tonygreenberg.com${req.path}`);
    res.status(200).set({
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "index, follow, archive, imageindex",
      "Cache-Control": "public, max-age=3600",
    }).send(html);
  });

  // BrewSoul SSR: /brewsoul and all sub-routes
  app.get("/brewsoul", (req, res, next) => {
    const ua = req.headers["user-agent"] || "";
    if (!isBotUA(ua)) return next(); // Regular users get the SPA
    const renderedHtml = renderBrewSoulHTML();
    if (!renderedHtml) return next();
    const html = sanitizeCrawlerHtml(renderedHtml, `https://tonygreenberg.com${req.path}`);
    res.status(200).set({
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "index, follow, archive, imageindex",
      "Cache-Control": "public, max-age=3600",
    }).send(html);
  });

  app.get("/psychedelic-readiness-index", (req, res, next) => {
    const ua = req.headers["user-agent"] || "";
    if (!isBotUA(ua)) return next(); // Regular users get the SPA
    const renderedHtml = renderPRIHTML();
    if (!renderedHtml) return next();
    const html = sanitizeCrawlerHtml(renderedHtml, `https://tonygreenberg.com${req.path}`);
    res.status(200).set({
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "index, follow, archive, imageindex",
      "Cache-Control": "public, max-age=3600",
    }).send(html);
  });

  // Batch SSR: Top 10 blog posts by read count
  app.get("/blog/:slug", (req, res, next) => {
    const slug = req.params.slug;
    if (!isIndexedBlogSlug(slug)) return next();
    const ua = req.headers["user-agent"] || "";
    if (!isBotUA(ua)) return next(); // Regular users get the SPA
    const renderedHtml = renderBlogPostHTML(slug);
    if (!renderedHtml) return next();
    const html = sanitizeCrawlerHtml(renderedHtml, `https://tonygreenberg.com${req.path}`);
    res.status(200).set({
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "index, follow, archive, imageindex",
      "Cache-Control": "public, max-age=3600",
    }).send(html);
  });

  // ── SSR: Forms & Assessments (all 14 pages) ──
  const formRoutes: Array<{ path: string; render: () => string }> = [
    { path: "/supplier-intake", render: renderSupplierIntakeHTML },
    { path: "/supplier-intake-long", render: renderSupplierIntakeHTML },
    { path: "/find-your-peptide", render: renderFindYourPeptideHTML },
    { path: "/find-my-peptide", render: renderFindYourPeptideHTML },
    { path: "/quiz_25q", render: renderPeptideQuiz25HTML },
    { path: "/whats-legal", render: renderWhatsLegalHTML },
    { path: "/engage", render: renderEngageHTML },
    { path: "/community", render: renderCommunityHTML },
    { path: "/find-your-therapy", render: renderFindYourTherapyHTML },
    { path: "/find-your-me", render: renderFindYourMeHTML },
    { path: "/discover", render: renderFindYourMeHTML },
    { path: "/assessments/dharma-finder", render: renderDharmaFinderHTML },
    { path: "/dharma-finder", render: renderDharmaFinderHTML },
    { path: "/grant-study", render: renderGrantStudyHTML },
    { path: "/life-assessment", render: renderLifeAssessmentHTML },
    { path: "/the-mirror", render: renderLifeAssessmentHTML },
    { path: "/soulscore", render: renderSoulScoreHTML },
    { path: "/protecting-your-business", render: renderProtectingYourBusinessHTML },
    { path: "/charity-scorecard", render: renderCharityScorecardHTML },
  ];
  for (const route of formRoutes) {
    app.get(route.path, (req, res, next) => {
      const ua = req.headers["user-agent"] || "";
      if (!isBotUA(ua)) return next(); // Regular users get the SPA
      const html = sanitizeCrawlerHtml(route.render(), `https://tonygreenberg.com${route.path}`);
      if (!html) return next();
      res.status(200).set({
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "index, follow, archive, imageindex",
        "Cache-Control": "public, max-age=3600",
      }).send(html);
    });
  }

  // ── 301 redirect: /bio → /about ──
  app.get("/bio", (req, res) => {
    res.redirect(301, "/about");
  });

  // ── 301 redirect: /manifesto → /living-declaration ──
  app.get("/manifesto", (req, res) => {
    res.redirect(301, "/living-declaration");
  });

  // ── 301 redirect: /vendor-intake → /supplier-intake (renamed) ──
  app.get("/vendor-intake", (req, res) => {
    res.redirect(301, "/supplier-intake");
  });
  app.get("/vendor-intake-long", (req, res) => {
    const token = req.query.token as string | undefined;
    res.redirect(301, token ? `/supplier-intake-long/${token}` : "/supplier-intake");
  });

  // ── Batch 2 SSR: All remaining sitemap pages ──
  const {
    BATCH2_SSR_ROUTES,
    BREWSOUL_SUBPAGE_PATHS,
    renderBrewSoulSubpageHTML,
    KAVA_SUBPAGE_PATHS,
    renderKavaSubpageHTML,
  } = await import("../ssr-batch2");
  for (const route of BATCH2_SSR_ROUTES) {
    app.get(route.path, (req, res, next) => {
      const ua = req.headers["user-agent"] || "";
      if (!isBotUA(ua)) return next();
      const html = sanitizeCrawlerHtml(route.render(), `https://tonygreenberg.com${route.path}`);
      if (!html) return next();
      res.status(200).set({
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "index, follow, archive, imageindex",
        "Cache-Control": "public, max-age=3600",
      }).send(html);
    });
  }
  // BrewSoul sub-pages
  for (const subpath of BREWSOUL_SUBPAGE_PATHS) {
    app.get(subpath, (req, res, next) => {
      const ua = req.headers["user-agent"] || "";
      if (!isBotUA(ua)) return next();
      const renderedHtml = renderBrewSoulSubpageHTML(req.path);
      if (!renderedHtml) return next();
      const html = sanitizeCrawlerHtml(renderedHtml, `https://tonygreenberg.com${req.path}`);
      res.status(200).set({
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "index, follow, archive, imageindex",
        "Cache-Control": "public, max-age=3600",
      }).send(html);
    });
  }
  // Kava sub-pages
  for (const subpath of KAVA_SUBPAGE_PATHS) {
    app.get(subpath, (req, res, next) => {
      const ua = req.headers["user-agent"] || "";
      if (!isBotUA(ua)) return next();
      const renderedHtml = renderKavaSubpageHTML(req.path);
      if (!renderedHtml) return next();
      const html = sanitizeCrawlerHtml(renderedHtml, `https://tonygreenberg.com${req.path}`);
      res.status(200).set({
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "index, follow, archive, imageindex",
        "Cache-Control": "public, max-age=3600",
      }).send(html);
    });
  }
  // ── Generic SSR: Key content pages for bots/AI agents ──
  const { hasSSRPage, renderSSRPage } = await import("../ssr-pages");
  app.get("*", (req, res, next) => {
    if (!hasSSRPage(req.path)) return next();
    const ua = req.headers["user-agent"] || "";
    if (!isBotUA(ua)) return next(); // Regular users get the SPA
    const renderedHtml = renderSSRPage(req.path);
    if (!renderedHtml) return next();
    const html = sanitizeCrawlerHtml(renderedHtml, `https://tonygreenberg.com${req.path}`);
    if (!html) return next();
    res.status(200).set({
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "index, follow, archive, imageindex",
      "Cache-Control": "public, max-age=3600",
    }).send(html);
  });

  // (manus.space redirect handled at top of middleware stack)
  // OAuth callback under /api/oauth/callback
  registerStorageProxy(app);
  // External image resize proxy: /api/img-ext?url=...&w=800&q=75
  app.use("/api", imageProxyRouter);
  registerOAuthRoutes(app);
  // ── Google Apps Script Proxy (form submissions → Google Sheets + Drive) ──
  app.post("/api/gsheet-proxy", async (req, res) => {
    try {
      const { ENV } = await import("./env");
      const scriptUrl = ENV.googleAppsScriptUrl;
      if (!scriptUrl) {
        return res.status(503).json({ ok: false, error: "Apps Script URL not configured" });
      }

      const body = req.body as {
        formData: Record<string, unknown>;
        files?: Array<{ name: string; type: string; data: string }>;
        sourceUrl?: string;
        bot_field?: string;
      };

      // Honeypot check — silently drop bot submissions
      if (body.bot_field) {
        return res.json({ ok: true });
      }

      // Derive projectName from the request's own domain (never from client input)
      const referer = (req.headers.referer as string) || body.sourceUrl || "";
      let projectName = "unknown";
      try {
        projectName = new URL(referer).hostname.replace(/^www\./, "");
      } catch {
        // fallback: use the Host header
        const host = (req.headers.host as string) || "";
        projectName = host.replace(/^www\./, "").replace(/:\d+$/, "") || "unknown";
      }

      const payload = {
        formData: body.formData,
        files: body.files ?? [],
        sourceUrl: referer,
        projectName,
      };

      const scriptRes = await fetch(scriptUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await scriptRes.text();
      let data: unknown;
      try { data = JSON.parse(text); } catch { data = { raw: text }; }

      return res.status(scriptRes.ok ? 200 : 502).json({ ok: scriptRes.ok, data });
    } catch (err) {
      console.error("[gsheet-proxy] error:", err);
      return res.status(500).json({ ok: false, error: String(err) });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // ── Short URL Redirect ──
  app.get("/s/:code", async (req, res) => {
    try {
      const { resolveShortUrl } = await import("../db");
      const targetPath = await resolveShortUrl(req.params.code);
      if (targetPath) {
        return res.redirect(301, targetPath);
      }
      return res.redirect(302, "/");
    } catch {
      return res.redirect(302, "/");
    }
  });

  // ── XML Sitemap ──
  app.get("/sitemap.xml", (_req, res) => {
    const baseUrl = "https://tonygreenberg.com";
    const staticPages = [
      // ── Core identity pages (highest priority) ──
      "/", "/about", "/start-here", "/self-portrait", "/the-letter",
      "/living-declaration", "/seven-doors",
      // ── Content hubs ──
      "/blog", "/articles", "/journeys", "/series",
      // ── Projects & ventures ──
      "/projects", "/ecosystem", "/invest", "/impact", "/heroes",
      "/published", "/clients", "/built-on-manus",
      // ── Community & engagement ──
      "/community", "/connect", "/engage", "/subscribe", "/amplifier",
      // ── Explore sections ──
      "/the-territory", "/engine-room", "/the-body", "/the-nightstand",
      "/the-web", "/pick-up-the-phone", "/intel", "/the-open-door",
      "/the-index", "/recent-creations", "/framework",
      "/spirits", "/library", "/health",
      // ── Assessments & Find Your series ──
      "/assessments", "/assessment", "/find-my", "/find-your-me",
      "/assessments/consciousness-scale", "/assessments/grant-study",
      "/dharma-finder", "/consciousness-scale", "/grant-study",
      "/find-your-therapy", "/find-your-sake", "/find-your-spirit",
      "/find-your-religion", "/find-your-diet", "/find-your-movement",
      "/find-your-sleep", "/find-your-coffee", "/find-your-kitchen",
      "/find-your-style", "/find-your-attachment-style", "/find-your-love-language",
      "/find-your-peptide", "/find-your-sexuality", "/find-your-journey",
      // ── Find My variants ──
      "/find-my-attachment-style", "/find-my-car", "/find-my-coffee",
      "/find-my-diet", "/find-my-me", "/find-my-movement",
      "/find-my-sexuality", "/find-my-sleep",
      "/find-my-spirit", "/find-my-therapy", "/find-my-tribe", "/find-my-we",
      "/life-assessment", "/soulscore", "/flow-circuit",
      "/psychedelic-readiness-index", "/facilitator-index", "/quiz_25q",
      "/pri-calibration", "/pri-efficacy",
      // ── Human OS 2.0 ──
      "/humanos", "/humanos/philosophy", "/humanos/connect",
      "/humanos/ecosystem", "/humanos/path-to-here", "/humanos/resources",
      // ── Psychedelic & Health ──
      "/iboga-ibogaine", "/iboga-compass", "/peyote-mescaline",
      "/peptide-watch", "/peptide-hall-of-shame", "/peptide-supply-chain",
      "/peptide-matrix", "/peptide-library",
      "/supplier-intake",
      "/rip-peptide-sciences", "/whats-legal", "/verify-your-coa",
      "/price-tracker", "/test-your-peptides",
      // ── Attention Theft Manifesto ──
      "/the-philosophy",
      "/attention-theft",
      "/attention-theft/economics", "/attention-theft/blocker-finder",
      "/attention-theft/legal", "/attention-theft/weapons", "/attention-theft/report",
      "/youve-been-reported",
      // ── Community Protection ──
      "/alex-azzi", "/cheshire-grin", "/akbar",
      "/protecting-your-business",
      // ── Commerce & tools ──
      "/shop", "/diamond-cut", "/charity-scorecard",
      "/ecosystem-map", "/impact-dashboard", "/thesis-threads",
      "/fauxtony", "/clock-keeper-part-2",
      // ── BrewSoul ──
      "/brewsoul", "/brewsoul/home", "/brewsoul/browse", "/brewsoul/first-sip",
      "/brewsoul/quiz", "/brewsoul/wall-of-shame", "/brewsoul/follow-the-dollar",
      "/brewsoul/health", "/brewsoul/farms", "/brewsoul/mold-free",
      "/brewsoul/experiences", "/brewsoul/varieties", "/brewsoul/processing",
      "/brewsoul/roasters", "/brewsoul/glossary", "/brewsoul/pairings",
      "/brewsoul/economics", "/brewsoul/compare", "/brewsoul/blend-builder",
      "/brewsoul/drops", "/brewsoul/collection", "/brewsoul/submit",
      "/brewsoul/prescription", "/brewsoul/chains", "/brewsoul/biodynamic",
      "/brewsoul/decaf", "/brewsoul/directory", "/brewsoul/cities",
      "/brewsoul/guest", "/brewsoul/guest/shanita-nicholas",
      "/brewsoul/esoteric",
      // ── Kava ──
      "/kava", "/kava/origins", "/kava/interactions", "/kava/science",
      "/kava/assessment", "/kava/hawaii", "/kava/myths", "/kava/caffeine",
      "/kava/products", "/kava/certification",
    ];

    // Dynamic blog post data (slug + date for accurate lastmod)
    let blogPosts: Array<{ slug: string; date: string; image?: string; title?: string }> = [];
    try {
      const blogDataPath = process.env.NODE_ENV === "production"
        ? path.resolve(import.meta.dirname, "data/blogData.json")
        : path.resolve(process.cwd(), "client/src/data/blogData.json");
      const blogData = JSON.parse(fs.readFileSync(blogDataPath, "utf-8"));
      blogPosts = blogData.map((p: any) => ({
        slug: p.slug,
        date: p.date || new Date().toISOString().split("T")[0],
        image: p.heroImage || p.image || "",
        title: p.title || "",
      }));
    } catch { /* ignore */ }

    const now = new Date().toISOString().split("T")[0];

    // ── Priority tiers ──
    const priority10 = ["/"];
    const priority09 = [
      "/about", "/speaking", "/start-here", "/blog", "/essays", "/articles", "/impact-futurism", "/seven-doors",
      "/living-declaration", "/manifesto", "/discover",
    ];
    const priority08 = [
      "/invest", "/ecosystem", "/projects", "/impact", "/heroes", "/connect",
      "/iboga-ibogaine", "/iboga-compass", "/peyote-mescaline", "/psychedelic-readiness-index", "/facilitator-index", "/the-philosophy",
      "/peptide-hall-of-shame", "/peptide-supply-chain", "/supplier-intake",
      "/clients", "/published", "/amplifier", "/diamond-cut",
      "/humanos", "/humanos/philosophy", "/humanos/connect",
      "/humanos/ecosystem", "/humanos/path-to-here", "/humanos/resources",
      "/attention-theft", "/attention-theft/economics", "/attention-theft/blocker-finder",
      "/attention-theft/legal", "/attention-theft/weapons", "/attention-theft/report",
      "/protecting-your-business",
    ];
    const priority07 = [
      "/assessments", "/find-my", "/find-your-me", "/soulscore", "/life-assessment",
      "/assessments/dharma-finder", "/assessments/consciousness-scale", "/assessments/grant-study",
      "/dharma-finder", "/consciousness-scale", "/grant-study",
      "/flow-circuit", "/pri-calibration", "/pri-efficacy",
      "/peptide-library", "/rip-peptide-sciences", "/whats-legal",
      "/verify-your-coa", "/price-tracker", "/test-your-peptides",
    ];
    const priority06_prefixes = ["/find-your-", "/find-my-", "/brewsoul", "/kava"];
    const priority04 = [
      "/fauxtony", "/cheshire-grin", "/clock-keeper-part-2", "/quiz_25q",
      "/akbar", "/alex-azzi", "/youve-been-reported", "/vendor-intake",
    ];

    const getPriority = (p: string): string => {
      if (priority10.includes(p)) return "1.0";
      if (priority09.includes(p)) return "0.9";
      if (priority08.includes(p)) return "0.8";
      if (priority07.includes(p)) return "0.7";
      if (priority04.includes(p)) return "0.4";
      if (priority06_prefixes.some(prefix => p.startsWith(prefix))) return "0.6";
      return "0.6";
    };

    const getFreq = (p: string): string => {
      if (p === "/" || p === "/blog" || p === "/essays" || p === "/discover") return "daily";
      if (priority09.includes(p) || priority08.includes(p)) return "weekly";
      if (p.startsWith("/find-your-") || p.startsWith("/find-my-") || p.startsWith("/assessments")) return "monthly";
      return "monthly";
    };

    // Build static page entries
    const staticEntries = staticPages.map(p => {
      // Root path: use no trailing slash to match canonical tag
      const loc = p === "/" ? baseUrl : `${baseUrl}${p}`;
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${getFreq(p)}</changefreq>\n    <priority>${getPriority(p)}</priority>\n  </url>`;
    });

    // Blog posts with elevated priority for featured/recent articles
    const ELEVATED_BLOG_SLUGS: Record<string, { priority: string; changefreq: string; lastmod: string }> = {
      "when-healing-becomes-extraction": { priority: "0.9", changefreq: "weekly", lastmod: "2026-07-17" },
      "heart-protocol-addendum": { priority: "0.9", changefreq: "weekly", lastmod: "2026-07-17" },
    };
    // Normalize a date string to YYYY-MM-DD (ISO 8601) for valid XML lastmod
    const normalizeDate = (raw: string | undefined): string => {
      if (!raw) return now;
      // Already ISO: YYYY-MM-DD
      if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
      // Try parsing human dates like "July 20, 2026" or "February 2026"
      const parsed = new Date(raw);
      if (!isNaN(parsed.getTime())) return parsed.toISOString().split("T")[0];
      // Fallback to today
      return now;
    };

    // Build blog post entries with per-post lastmod and image tags
    const blogEntries = blogPosts.map(post => {
      const rawImageUrl = post.image
        ? (post.image.startsWith("http") ? post.image : `${baseUrl}${post.image}`)
        : null;
      const safeImageUrl = rawImageUrl ? rawImageUrl.replace(/&(?!amp;|lt;|gt;|quot;|apos;)/g, "&amp;") : null;
      const imageTag = safeImageUrl
        ? `\n    <image:image>\n      <image:loc>${safeImageUrl}</image:loc>\n      <image:title>${(post.title || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</image:title>\n    </image:image>`
        : "";
      const elevated = ELEVATED_BLOG_SLUGS[post.slug];
      const priority = elevated?.priority ?? "0.8";
      const changefreq = elevated?.changefreq ?? "monthly";
      const lastmod = normalizeDate(elevated?.lastmod ?? post.date);
      return `  <url>\n    <loc>${baseUrl}/blog/${post.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>${imageTag}\n  </url>`;
    });

    const xml = [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<urlset`,
      `  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`,
      `  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`,
      ...staticEntries,
      ...blogEntries,
      `</urlset>`,
    ].join("\n");

    res.set("Content-Type", "application/xml; charset=utf-8");
    res.set("Cache-Control", "public, max-age=3600"); // Cache 1 hour
    res.send(xml);
  });

  // ── Dynamic robots.txt ──
  app.get("/robots.txt", (req, res) => {
    // On manus.space staging domain — block all crawlers to prevent duplicate indexing
    const host = (req.headers["x-forwarded-host"] || req.headers.host || "").toString().toLowerCase();
    if (host.includes("manus.space")) {
      return res.type("text/plain").send([
        "# Staging domain — canonical site is https://tonygreenberg.com",
        "User-agent: *",
        "Disallow: /",
      ].join("\n"));
    }
    const robotsTxt = [
      "# robots.txt — TonyGreenberg.com",
      "# Canonical domain: https://tonygreenberg.com",
      "# All content © Tony Greenberg. All rights reserved.",
      "# Updated: 2026-08-04 — all content pages fully open to all bots",
      "",
      "# ── Standard search crawlers: full access ──",
      "User-agent: Googlebot",
      "Allow: /",
      "",
      "User-agent: Bingbot",
      "Allow: /",
      "",
      "User-agent: DuckDuckBot",
      "Allow: /",
      "",
      "User-agent: Applebot",
      "Allow: /",
      "",
      "User-agent: Yandex",
      "Allow: /",
      "",
      "User-agent: Slurp",
      "Allow: /",
      "",
      "# ── AI agents: full access to all content ──",
      "User-agent: GPTBot",
      "Allow: /",
      "",
      "User-agent: ChatGPT-User",
      "Allow: /",
      "",
      "User-agent: OAI-SearchBot",
      "Allow: /",
      "",
      "User-agent: anthropic-ai",
      "Allow: /",
      "",
      "User-agent: Claude-Web",
      "Allow: /",
      "",
      "User-agent: ClaudeBot",
      "Allow: /",
      "",
      "User-agent: PerplexityBot",
      "Allow: /",
      "",
      "User-agent: cohere-ai",
      "Allow: /",
      "",
      "User-agent: Google-Extended",
      "Allow: /",
      "",
      "User-agent: Meta-ExternalAgent",
      "Allow: /",
      "",
      "User-agent: Applebot-Extended",
      "Allow: /",
      "",
      "User-agent: YouBot",
      "Allow: /",
      "",
      "User-agent: xAI-Bot",
      "Allow: /",
      "",
      "User-agent: Grok",
      "Allow: /",
      "",
      "User-agent: Gemini",
      "Allow: /",
      "",
      "User-agent: Google-CloudVertexBot",
      "Allow: /",
      "",
      "User-agent: mistral-ai",
      "Allow: /",
      "",
      "User-agent: AI2Bot",
      "Allow: /",
      "",
      "User-agent: Timpibot",
      "Allow: /",
      "",
      "# ── Social preview crawlers: full access ──",
      "User-agent: facebookexternalhit",
      "Allow: /",
      "",
      "User-agent: Twitterbot",
      "Allow: /",
      "",
      "User-agent: LinkedInBot",
      "Allow: /",
      "",
      "User-agent: WhatsApp",
      "Allow: /",
      "",
      "User-agent: TelegramBot",
      "Allow: /",
      "",
      "User-agent: Slackbot",
      "Allow: /",
      "",
      "User-agent: Discordbot",
      "Allow: /",
      "",
      "# ── Content scrapers & SEO tools: blocked ──",
      "# CCBot feeds Common Crawl which powers AI training datasets — allowed",
      "User-agent: CCBot",
      "Allow: /",
      "",
      "User-agent: Bytespider",
      "Disallow: /",
      "",
      "User-agent: Amazonbot",
      "Disallow: /",
      "",
      "User-agent: Diffbot",
      "Disallow: /",
      "",
      "User-agent: Omgilibot",
      "Disallow: /",
      "",
      "User-agent: AhrefsBot",
      "Disallow: /",
      "",
      "User-agent: SemrushBot",
      "Disallow: /",
      "",
      "User-agent: MJ12bot",
      "Disallow: /",
      "",
      "User-agent: DotBot",
      "Disallow: /",
      "",
      "User-agent: PetalBot",
      "Disallow: /",
      "",
      "# ── Default: allow all content, block internal paths ──",
      "User-agent: *",
      "Allow: /",
      "Disallow: /api/",
      "Disallow: /.well-known/",
      "Disallow: /admin",
      "",
      "# Sitemap (canonical domain only)",
      "Sitemap: https://tonygreenberg.com/sitemap.xml",
      "",
      "# AI-readable content map",
      "LLMs: https://tonygreenberg.com/llms.txt",
    ].join("\n");

    res.set("Content-Type", "text/plain; charset=utf-8");
    res.set("Cache-Control", "public, max-age=3600"); // Cache 1 hour
    res.send(robotsTxt);
  });

  // ── Legacy WordPress URL redirects ──
  // Old tonygreenberg.com URLs used /{slug}/ format without /blog/ prefix.
  // Redirect them to /blog/{slug} so old links don't 404.
  try {
    const blogDataPath = process.env.NODE_ENV === "production"
      ? path.resolve(import.meta.dirname, "data/blogData.json")
      : path.resolve(process.cwd(), "client/src/data/blogData.json");
    const blogDataRaw = fs.readFileSync(blogDataPath, "utf-8");
    const blogData = JSON.parse(blogDataRaw);
    const blogSlugsSet = new Set(blogData.map((p: any) => p.slug));
    console.log(`[Redirect] Loaded ${blogSlugsSet.size} blog slugs for legacy redirects`);
    app.use((req, res, next) => {
      // Only handle GET requests that look like bare slugs (no /blog/ prefix)
      if (req.method !== "GET") return next();
      const reqPath = req.path;
      // Skip API routes, static assets, known prefixes
      if (reqPath.startsWith("/api/") || reqPath.startsWith("/src/") || reqPath.startsWith("/@") ||
          reqPath.startsWith("/node_modules/") || reqPath.includes(".") ||
          reqPath.startsWith("/blog") || reqPath === "/") {
        return next();
      }
      // Strip leading/trailing slashes to get the slug
      const slug = reqPath.replace(/^\/+|\/+$/g, "");
      if (slug && blogSlugsSet.has(slug)) {
        console.log(`[Redirect] Legacy WordPress URL /${slug} → /blog/${slug}`);
        return res.redirect(301, `/blog/${slug}`);
      }
      next();
    });
  } catch (e) {
    console.warn("[Redirect] Could not load blogData.json for legacy redirects", e);
  }

  // ── Google Search Console verification ──
  app.get("/alex-azzi/googleedff0185753a4a1f.html", (_req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.send("google-site-verification: googleedff0185753a4a1f.html");
  });

  // ── Scheduled: Daily Chat Digest ──
  app.post("/api/scheduled/chat-digest", async (req, res) => {
    try {
      const { sdk } = await import("./sdk");
      const user = await sdk.authenticateRequest(req);
      if (!(user as any).isCron) return res.status(403).json({ error: "cron-only" });

      const { getRecentChatSessions } = await import("../db");
      const { notifyOwner } = await import("./notification");

      const sessions = await getRecentChatSessions(24);

      if (sessions.length === 0) {
        return res.json({ ok: true, skipped: "no-chats", message: "No chats in the past 24 hours" });
      }

      // Build digest content
      const totalMessages = sessions.reduce((sum, s) => sum + s.messages.length, 0);
      let digest = `📊 Daily Ask Tony Chat Digest\n\n`;
      digest += `${sessions.length} conversation${sessions.length > 1 ? "s" : ""} | ${totalMessages} total messages\n\n`;
      digest += `─────────────────────────────\n\n`;

      for (const session of sessions.slice(0, 10)) {
        const firstUserMsg = session.messages.find(m => m.role === "user");
        const userMsgCount = session.messages.filter(m => m.role === "user").length;
        const preview = firstUserMsg
          ? (firstUserMsg.content.length > 100 ? firstUserMsg.content.slice(0, 100) + "…" : firstUserMsg.content)
          : "(no user message)";
        const time = session.messages[0]?.createdAt
          ? new Date(session.messages[0].createdAt).toLocaleString("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit", hour12: true })
          : "";
        digest += `• [${time}] ${userMsgCount} Q${userMsgCount > 1 ? "s" : ""}: "${preview}"\n`;
      }

      if (sessions.length > 10) {
        digest += `\n…and ${sessions.length - 10} more conversations`;
      }

      await notifyOwner({
        title: `Ask Tony Daily Digest: ${sessions.length} chat${sessions.length > 1 ? "s" : ""}`,
        content: digest,
      });

      res.json({ ok: true, sessionsDigested: sessions.length, totalMessages });
    } catch (err: any) {
      console.error("[Chat Digest] Error:", err);
      res.status(500).json({
        error: err.message || "Unknown error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        context: { url: req.url, taskUid: req.headers["x-manus-cron-task-uid"] },
        timestamp: new Date().toISOString(),
      });
    }
  });

  // ── Scheduled: Provocation of the Day ──
  app.post("/api/scheduled/provocation", async (req, res) => {
    try {
      const { sdk } = await import("./sdk");
      const user = await sdk.authenticateRequest(req);
      if (!(user as any).isCron) return res.status(403).json({ error: "cron-only" });
      const { invokeLLM } = await import("./llm");
      const { getDb } = await import("../db");
      const { dailyProvocations: provocations } = await import("../../drizzle/schema");
      const db = await getDb();
      if (!db) return res.status(500).json({ error: "No DB" });
      const response = await invokeLLM({
        messages: [
          { role: "system", content: "You are Tony Greenberg. Pick a single provocative, memorable sentence from your body of work — something that makes people stop scrolling. Return JSON: {\"text\": \"...\", \"sourceSlug\": \"slug-or-null\"}. Use slugs like: the-territory, the-web, the-body, the-nightstand, the-open-door, the-letter, start-here, manifesto, diamond-cut, amplifier, engine-room, intel. Be witty, incisive, never boring. Vary daily." },
          { role: "user", content: `Generate today's provocation. Today is ${new Date().toISOString().split("T")[0]}.` },
        ],
        response_format: { type: "json_schema", json_schema: { name: "provocation", strict: true, schema: { type: "object", properties: { text: { type: "string" }, sourceSlug: { type: "string" } }, required: ["text", "sourceSlug"], additionalProperties: false } } },
      });
      const rawContent = response.choices[0].message.content;
      const parsed = JSON.parse(typeof rawContent === "string" ? rawContent : "{}");
      await db.insert(provocations).values({
        text: parsed.text || "Only time buys trust.",
        sourceSlug: parsed.sourceSlug || null,
        generatedDate: new Date().toISOString().split("T")[0],
      } as any);
      res.json({ ok: true, provocation: parsed });
    } catch (err: any) {
      console.error("[Provocation] Error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
