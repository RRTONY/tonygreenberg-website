import "dotenv/config";
import express from "express";
import serverless from "serverless-http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "../../server/_core/oauth";
import { appRouter } from "../../server/routers";
import { createContext } from "../../server/_core/context";
import { verifyWebhookSignature, handleWebhookEvent } from "../../server/stripe";

const app = express();

// Stripe Webhook (raw body for signature verification)
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
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
      console.error("Stripe webhook error:", err.message);
      res.status(400).json({ error: err.message });
    }
  }
);

// JSON body parser for everything else
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// OAuth routes
registerOAuthRoutes(app);

// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Sitemap
app.get("/api/sitemap.xml", (_req, res) => {
  const baseUrl = process.env.URL || "https://tonygreenb-gxhndhxp.manus.space";
  const staticPages = [
    "/", "/the-letter", "/about", "/start-here", "/the-territory",
    "/engine-room", "/the-body", "/the-nightstand", "/the-web",
    "/pick-up-the-phone", "/blog", "/journeys", "/built-on-manus",
    "/intel", "/the-open-door", "/the-index", "/ecosystem",
    "/published", "/clients", "/series",
  ];
  let blogSlugs: string[] = [];
  try {
    const blogData = require("../../client/src/data/blogData.json");
    blogSlugs = blogData.map((p: any) => p.slug);
  } catch { /* ignore */ }
  const urls = [
    ...staticPages.map(
      (p) =>
        `  <url><loc>${baseUrl}${p}</loc><changefreq>weekly</changefreq><priority>${p === "/" ? "1.0" : "0.7"}</priority></url>`
    ),
    ...blogSlugs.map(
      (s) =>
        `  <url><loc>${baseUrl}/blog/${s}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>`
    ),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
  res.set("Content-Type", "application/xml");
  res.send(xml);
});

export const handler = serverless(app);
