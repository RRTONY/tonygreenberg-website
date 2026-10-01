// Phone and laptop screenshots of a change's preview page (ported from
// ramprate-ui, 2026-10-02). Returned as MCP image blocks, which Claude and
// ChatGPT show in the chat (this server has no review-card widget). Uses Google's PageSpeed Insights API (same key and service as
// lighthouse-check.ts): it loads the page in a real phone-sized and a real
// laptop-sized browser and returns the first screenful of each as a JPEG.
//
// Only Netlify deploy-preview addresses for this site are accepted, so the
// tool can't be pointed at arbitrary websites.

export interface DeviceShot {
  device: "phone" | "laptop";
  image: string | null; // data:image/jpeg;base64,...
  width: number | null;
  height: number | null;
  error?: string;
}

const PREVIEW_ORIGIN = /^https:\/\/deploy-preview-\d+--tonygreenberg-website\.netlify\.app$/;
// Google can take 15-30s per page. Stay under the serverless function's time
// limit so a slow run gives a clear "try again" instead of a dead request.
const TIMEOUT_MS = 22_000;

export function previewTarget(
  previewUrl: string | null,
  path: unknown,
): string | null {
  if (!previewUrl || !PREVIEW_ORIGIN.test(previewUrl)) return null;
  let p = typeof path === "string" && path.trim() ? path.trim() : "/";
  if (!p.startsWith("/")) p = `/${p}`;
  if (!/^\/[A-Za-z0-9\-._~/]*$/.test(p) || p.includes("..")) return null;
  return `${previewUrl}${p}`;
}

interface PsiScreenshot {
  lighthouseResult?: {
    audits?: {
      "final-screenshot"?: {
        details?: { data?: string };
      };
    };
    fullPageScreenshot?: unknown;
  };
}

export function parseScreenshot(
  data: PsiScreenshot,
  device: DeviceShot["device"],
): DeviceShot {
  const image =
    data.lighthouseResult?.audits?.["final-screenshot"]?.details?.data ?? null;
  if (!image || !image.startsWith("data:image/")) {
    return {
      device,
      image: null,
      width: null,
      height: null,
      error: "No screenshot came back",
    };
  }
  return device === "phone"
    ? { device, image, width: 412, height: 823 }
    : { device, image, width: 1350, height: 940 };
}

async function shoot(
  url: string,
  device: DeviceShot["device"],
): Promise<DeviceShot> {
  const params = new URLSearchParams({
    url,
    strategy: device === "phone" ? "mobile" : "desktop",
    category: "performance",
  });
  if (process.env.GOOGLE_API_KEY) params.set("key", process.env.GOOGLE_API_KEY);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`,
      { signal: controller.signal },
    );
    if (!res.ok) {
      return {
        device,
        image: null,
        width: null,
        height: null,
        error: `Google returned ${res.status}`,
      };
    }
    return parseScreenshot((await res.json()) as PsiScreenshot, device);
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "AbortError";
    return {
      device,
      image: null,
      width: null,
      height: null,
      error: timedOut
        ? "Took too long, try again (it's usually quicker the second time)"
        : "Couldn't load the page",
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function captureDevices(url: string): Promise<DeviceShot[]> {
  return Promise.all([shoot(url, "phone"), shoot(url, "laptop")]);
}
