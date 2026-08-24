import { mkdir, writeFile } from "node:fs/promises";

const baseUrl = process.env.AUDIT_BASE || "https://tonygreenberg.com";
const productionBase = "https://tonygreenberg.com";
const concurrency = Number(process.env.AUDIT_CONCURRENCY || 10);
const requestPauseMs = Number(process.env.AUDIT_REQUEST_PAUSE_MS || 0);

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const entityDecode = (value = "") => value
  .replace(/&amp;/g, "&")
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/&#x27;/gi, "'")
  .replace(/&apos;/g, "'")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">");

const stripHtml = (html) => entityDecode(html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/\s+/g, " ")
  .trim());

const attribute = (html, expression) => {
  const match = html.match(expression);
  return (match?.[2] || match?.[1] || "").trim();
};

const pool = async (items, worker) => {
  const output = [];
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      output[index] = await worker(items[index]);
    }
  }));
  return output;
};

const fetchText = async (url) => {
  try {
    if (requestPauseMs) await pause(requestPauseMs);
    const response = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": "Googlebot/2.1 (+http://www.google.com/bot.html)" },
    });
    return { response, html: await response.text() };
  } catch (error) {
    return { response: null, html: "", error: error instanceof Error ? error.message : String(error) };
  }
};

const sitemapUrl = `${baseUrl}/sitemap.xml`;
const sitemapFetch = await fetchText(sitemapUrl);
if (!sitemapFetch.response?.ok) throw new Error(`Could not load sitemap: ${sitemapFetch.response?.status || sitemapFetch.error}`);

const sitemapUrls = [...sitemapFetch.html.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => entityDecode(match[1]))
  .filter((url) => url.startsWith(productionBase));

const auditUrls = sitemapUrls.map((url) => url.replace(productionBase, baseUrl));
const routeSet = new Set(sitemapUrls.map((url) => url.replace(productionBase, "")));
routeSet.add("/");

const pageResults = await pool(auditUrls, async (auditedUrl) => {
  const { response, html, error } = await fetchText(auditedUrl);
  const productionUrl = auditedUrl.replace(baseUrl, productionBase);
  const path = new URL(auditedUrl).pathname;
  const title = attribute(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = attribute(html, /<meta\b(?=[^>]*\bname=["']description["'])[^>]*\bcontent=(["'])([\s\S]*?)\1/i)
    || attribute(html, /<meta\b(?=[^>]*\bcontent=(["']))[^>]*\bname=["']description["'][^>]*\bcontent=(["'])([\s\S]*?)\3/i);
  const canonical = attribute(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)
    || attribute(html, /<link[^>]+href=["']([^"']*)["'][^>]+rel=["']canonical["']/i);
  const robots = attribute(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i)
    || attribute(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']robots["']/i);
  const ogImage = attribute(html, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i)
    || attribute(html, /<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:image["']/i);
  const htmlImageSources = [...html.matchAll(/<(?:img|source)[^>]+(?:src|srcset)=["']([^"']+)["']/gi)]
    .map((match) => match[1].split(",")[0].trim().split(" ")[0])
    .filter(Boolean);
  const cssText = [
    ...[...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((match) => match[1]),
    ...[...html.matchAll(/\bstyle=(["'])([\s\S]*?)\1/gi)].map((match) => match[2]),
  ].join(" ");
  const cssImageSources = [...cssText.matchAll(/url\(["']?([^"')]+)["']?\)/gi)]
    .map((match) => entityDecode(match[1]).trim().replace(/^["']|["']$/g, ""))
    .filter((url) => !url.startsWith("data:"));
  const imageSources = [...htmlImageSources, ...cssImageSources];
  const renderedHtml = html.replace(/<script[\s\S]*?<\/script>/gi, " ");
  const hasSessionImage = /private-us-east-1\.manuscdn\.com|files\.manuscdn\.com|sessionFile/i.test(renderedHtml);
  const textLength = stripHtml(html).length;
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const jsonLdCount = (html.match(/application\/ld\+json/gi) || []).length;
  const issues = [];
  if (!response?.ok) issues.push(`status:${response?.status || "network"}`);
  if (!title || title.length < 15) issues.push("title");
  if (!description || description.length < 70) issues.push("description");
  if (canonical !== productionUrl) issues.push("canonical");
  if (!/index/i.test(robots) || /noindex/i.test(robots)) issues.push("robots");
  if (h1Count !== 1) issues.push(`h1:${h1Count}`);
  if (jsonLdCount < 1) issues.push("jsonld");
  if (textLength < 500) issues.push(`ssrText:${textLength}`);
  if (!ogImage) issues.push("ogImage");
  if (hasSessionImage) issues.push("sessionImage");
  if (!routeSet.has(path)) issues.push("sitemap");

  return {
    path,
    status: response?.status || 0,
    finalPath: response ? new URL(response.url).pathname : "",
    redirected: Boolean(response?.redirected),
    titleLength: title.length,
    descriptionLength: description.length,
    canonical,
    robots,
    h1Count,
    jsonLdCount,
    ssrTextLength: textLength,
    ogImage,
    imageSources,
    issues,
    error,
  };
});

const uniqueImageUrls = [...new Set(pageResults.flatMap((page) => [page.ogImage, ...page.imageSources])
  .filter((url) => url && !url.startsWith("data:") && !url.startsWith("#")))]
  .map((url) => new URL(url, baseUrl).toString());

const imageResults = await pool(uniqueImageUrls, async (url) => {
  try {
    if (requestPauseMs) await pause(requestPauseMs);
    const response = await fetch(url, { redirect: "follow", headers: { "user-agent": "Googlebot-Image/1.0" } });
    const contentType = response.headers.get("content-type") || "";
    const binaryImage = contentType === "application/octet-stream" && /\.(?:avif|gif|jpe?g|png|webp)(?:$|[?#])/i.test(url);
    return { url, status: response.status, contentType, ok: response.ok && (contentType.startsWith("image/") || binaryImage) };
  } catch (error) {
    return { url, status: 0, contentType: "", ok: false, error: error instanceof Error ? error.message : String(error) };
  }
});

const failedPages = pageResults.filter((page) => page.issues.length);
const failedImages = imageResults.filter((image) => !image.ok);
const issueCounts = Object.fromEntries(
  [...new Set(failedPages.flatMap((page) => page.issues.map((issue) => issue.split(":")[0])))]
    .sort()
    .map((issue) => [issue, failedPages.filter((page) => page.issues.some((entry) => entry.split(":")[0] === issue)).length]),
);
const report = {
  generatedAt: new Date().toISOString(),
  auditBase: baseUrl,
  productionCanonicalBase: productionBase,
  summary: {
    sitemapUrls: sitemapUrls.length,
    pagesChecked: pageResults.length,
    pageFailures: failedPages.length,
    imageResourcesChecked: imageResults.length,
    imageFailures: failedImages.length,
    issueCounts,
  },
  failures: failedPages,
  failedImages,
  pages: pageResults,
  images: imageResults,
};

await mkdir(new URL("../audit-reports/", import.meta.url), { recursive: true });
await writeFile(new URL("../audit-reports/full-site-seo-audit.json", import.meta.url), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report.summary));
if (failedPages.length || failedImages.length) process.exitCode = 1;
