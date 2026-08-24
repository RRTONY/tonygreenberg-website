const auditBaseUrl = process.env.AUDIT_BASE || "https://tonygreenberg.com";
const urls = [
  "https://tonygreenberg.com/blog/more-ignorance-or-indignance-in-the-wake-of-covid-19",
  "https://tonygreenberg.com/blog/molecule-as-mirror-5-escape-and-meaning",
  "https://tonygreenberg.com/blog/6-act-of-speech-speaking-as-a-tool",
  "https://tonygreenberg.com/blog/the-bottle-that-quietly-ends-an-entire-civilization",
  "https://tonygreenberg.com/published",
  "https://tonygreenberg.com/blog/high-hells-demise-of-powerful-femininity",
  "https://tonygreenberg.com/blog/the-cios-guide-to-smarter-vendor-negotiation",
  "https://tonygreenberg.com/blog/gratitude-in-action",
  "https://tonygreenberg.com/engine-room",
  "https://tonygreenberg.com/find-your-therapy",
  "https://tonygreenberg.com/assessments/consciousness-scale",
  "https://tonygreenberg.com/quiz_25q",
  "https://tonygreenberg.com/clock-keeper-part-2",
  "https://tonygreenberg.com/rip-peptide-sciences",
  "https://tonygreenberg.com/test-your-peptides",
  "https://tonygreenberg.com/whats-legal",
  "https://tonygreenberg.com/community",
  "https://tonygreenberg.com/find-your-spirit",
  "https://tonygreenberg.com/assessments/grant-study",
  "https://tonygreenberg.com/peptide-supply-chain",
  "https://tonygreenberg.com/framework",
  "https://tonygreenberg.com/start-here",
  "https://tonygreenberg.com/self-portrait",
  "https://tonygreenberg.com/the-territory",
  "https://tonygreenberg.com/assessments/dharma-finder",
  "https://tonygreenberg.com/about",
  "https://tonygreenberg.com/price-tracker",
  "https://tonygreenberg.com/protecting-your-business",
  "https://tonygreenberg.com/amplifier",
  "https://tonygreenberg.com/engage",
  "https://tonygreenberg.com/peptide-hall-of-shame",
  "https://tonygreenberg.com/invest",
  "https://tonygreenberg.com/the-web",
  "https://tonygreenberg.com/blog/clout-v-klout-differences-and-never-be-the-same",
  "https://tonygreenberg.com/blog/psychedelics-could-become-extractive-capitalism",
  "https://tonygreenberg.com/recent-creations",
  "https://tonygreenberg.com/blog/productivity-apps-that-rocked-my-world-in-2024",
].map((url) => url.replace("https://tonygreenberg.com", auditBaseUrl));

const sitemap = await fetch(`${auditBaseUrl}/sitemap.xml`, {
  headers: { "user-agent": "Googlebot" },
}).then((r) => r.text());
const blogData = JSON.parse(
  await (await import("node:fs/promises")).readFile(
    new URL("../client/src/data/blogData.json", import.meta.url),
    "utf8",
  ),
);

const get = (html, pattern) => html.match(pattern)?.[1]?.trim() || "";
const thematicArticleCovers = {
  "Business & Capital": "/api/img/article-cover-business-capital_3823c08d.jpg?w=900&q=75",
  "Systems & Innovation": "/api/img/article-cover-systems-innovation_21e7d6b6.jpg?w=900&q=75",
  "Enterprise Technology & AI": "/api/img/article-cover-systems-innovation_21e7d6b6.jpg?w=900&q=75",
  "Culture & Communication": "/api/img/article-cover-culture-communication_e988720b.jpg?w=900&q=75",
  "Psychedelic Medicine": "/api/img/article-cover-culture-communication_e988720b.jpg?w=900&q=75",
  "Living Well": "/api/img/article-cover-living-well_3a8dcbd6.jpg?w=900&q=75",
  "Impact & Purpose": "/api/img/article-cover-impact-purpose_dcff7724.jpg?w=900&q=75",
  "Conscious Capital": "/api/img/article-cover-impact-purpose_dcff7724.jpg?w=900&q=75",
  "The Crusades": "/api/img/article-cover-crusades_7fc4bc27.jpg?w=900&q=75",
};
const resolveCover = (post) => {
  const image = post?.image || "";
  const unusable = !image || /placeholder|og-default|tony-headshot|manuscdn\.com/i.test(image);
  if (unusable) return thematicArticleCovers[post?.category] || thematicArticleCovers["Systems & Innovation"];
  if (image.startsWith("/api/img/")) return `${image}?w=900&q=75`;
  if (image.startsWith("/manus-storage/")) return `/api/img/${image.replace("/manus-storage/", "")}?w=900&q=75`;
  if (image.includes("manus-storage/")) return `/api/img/${image.match(/manus-storage\/([^?]+)/)?.[1]}?w=900&q=75`;
  return image;
};
const rows = [];

for (const url of urls) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: { "user-agent": "Googlebot" },
    });
    const html = await response.text();
    const images = [...html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)].map((m) => m[1]);
    rows.push({
      path: new URL(url).pathname,
      status: response.status,
      finalUrl: response.url,
      title: get(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
      description: get(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i),
      canonical: get(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i),
      robots: get(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i),
      h1Count: (html.match(/<h1\b/gi) || []).length,
      jsonLdCount: (html.match(/application\/ld\+json/gi) || []).length,
      sitemap: sitemap.includes(`<loc>${url.replace(auditBaseUrl, "https://tonygreenberg.com")}</loc>`),
      imageCount: images.length,
      sessionScopedImages: images.filter((src) => src.includes("manuscdn.com")).length,
      ssrTextLength: html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/gi, " ").replace(/\s+/g, " ").trim().length,
    });
  } catch (error) {
    rows.push({ path: new URL(url).pathname, error: String(error) });
  }
}

const blogImageChecks = [];
for (const url of urls.filter((item) => item.includes("/blog/"))) {
  const slug = url.split("/").pop();
  const post = blogData.find((item) => item.slug === slug) || null;
  const cover = resolveCover(post);
  const imageResponse = await fetch(new URL(cover, auditBaseUrl)).catch(() => null);
  blogImageChecks.push({ slug, category: post?.category || "missing", cover, status: imageResponse?.status || 0 });
}

const failures = rows.filter((row) =>
  row.error || row.status !== 200 || !row.title || !row.description || !row.canonical || /noindex/i.test(row.robots) || row.h1Count !== 1 || !row.sitemap || row.sessionScopedImages > 0,
);

console.log(JSON.stringify({
  summary: { audited: rows.length, failures: failures.length },
  failures,
  blogImageChecks,
  rows,
}, null, 2));
