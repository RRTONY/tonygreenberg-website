// Phone and laptop screenshots of a change's preview page (ported from
// ramprate-ui, 2026-10-02). Returned as MCP image blocks, which Claude and
// ChatGPT show in the chat (and in the review card). Uses Google's PageSpeed Insights API (same key and service as
// lighthouse-check.ts): it loads the page in a real phone-sized and a real
// laptop-sized browser and returns the first screenful of each as a JPEG.
//
// "Before" is the same page on the live site, so the person can compare the
// two side by side. Only Netlify deploy-preview addresses for this site and
// tonygreenberg.com itself are accepted, so the tool can't be pointed at
// arbitrary websites.
//
// Reliability: Google's first run on a page is the slow one (often over
// 20s, mostly for the phone), later runs are quick because Google caches
// the page. So once a change's preview has built, warmDevices() asks Google
// for every screenshot in the background (after the reply has gone out),
// and by the time the person asks to see them they usually come back in a
// few seconds. A retry only re-takes the screenshots that failed.

export type Device = "phone" | "laptop";
export type Version = "before" | "after";

export interface DeviceShot {
  device: Device;
  version: Version;
  image: string | null; // data:image/jpeg;base64,...
  width: number | null;
  height: number | null;
  error?: string;
  timedOut?: boolean;
}

const PREVIEW_ORIGIN = /^https:\/\/deploy-preview-\d+--tonygreenberg-website\.netlify\.app$/;
const LIVE_ORIGIN = "https://tonygreenberg.com";
// Google can take 15-30s per page (measured 2026-10-06: ~26s every time for
// a laptop-size run of the preview home page, cached or not). Netlify's
// synchronous function limit is 60s (it used to be 26s, which is where an
// older 22s cap came from), so 45s leaves room to answer with a clear
// "try again" instead of a dead request.
const TIMEOUT_MS = 45_000;
// Background warm-up runs after the reply, so it can wait longer.
const WARM_TIMEOUT_MS = 55_000;

function cleanPath(path: unknown): string | null {
  let p = typeof path === "string" && path.trim() ? path.trim() : "/";
  if (!p.startsWith("/")) p = `/${p}`;
  if (!/^\/[A-Za-z0-9\-._~/]*$/.test(p) || p.includes("..")) return null;
  return p;
}

export function liveTarget(path: unknown): string | null {
  const p = cleanPath(path);
  return p ? `${LIVE_ORIGIN}${p}` : null;
}

export function previewTarget(
  previewUrl: string | null,
  path: unknown,
): string | null {
  if (!previewUrl || !PREVIEW_ORIGIN.test(previewUrl)) return null;
  const p = cleanPath(path);
  return p ? `${previewUrl}${p}` : null;
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
  device: Device,
  version: Version = "after",
): DeviceShot {
  const image =
    data.lighthouseResult?.audits?.["final-screenshot"]?.details?.data ?? null;
  if (!image || !image.startsWith("data:image/")) {
    return {
      device,
      version,
      image: null,
      width: null,
      height: null,
      error: "No screenshot came back",
    };
  }
  return device === "phone"
    ? { device, version, image, width: 412, height: 823 }
    : { device, version, image, width: 1350, height: 940 };
}

async function shoot(
  url: string,
  device: Device,
  version: Version,
  timeoutMs = TIMEOUT_MS,
): Promise<DeviceShot> {
  const params = new URLSearchParams({
    url,
    strategy: device === "phone" ? "mobile" : "desktop",
    category: "performance",
  });
  if (process.env.GOOGLE_API_KEY) params.set("key", process.env.GOOGLE_API_KEY);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`,
      { signal: controller.signal },
    );
    if (!res.ok) {
      return {
        device,
        version,
        image: null,
        width: null,
        height: null,
        error: `Google returned ${res.status}`,
      };
    }
    return parseScreenshot(
      (await res.json()) as PsiScreenshot,
      device,
      version,
    );
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "AbortError";
    return {
      device,
      version,
      image: null,
      width: null,
      height: null,
      timedOut,
      error: timedOut
        ? "Took too long, try again (it's usually quicker the second time)"
        : "Couldn't load the page",
    };
  } finally {
    clearTimeout(timer);
  }
}

export async function captureDevices(
  previewUrl: string,
  liveUrl: string | null,
  devices: Device[] = ["phone", "laptop"],
): Promise<DeviceShot[]> {
  const jobs: Array<Promise<DeviceShot>> = [];
  for (const device of devices) {
    jobs.push(shoot(previewUrl, device, "after"));
    if (liveUrl) jobs.push(shoot(liveUrl, device, "before"));
  }
  return Promise.all(jobs);
}

// Fire-and-forget warm-up (see top of file). Results are thrown away; the
// point is only that Google has the pages cached for the real request.
export async function warmDevices(
  previewUrl: string,
  liveUrl: string | null,
): Promise<void> {
  const jobs: Array<Promise<DeviceShot>> = [];
  for (const device of ["phone", "laptop"] as const) {
    jobs.push(shoot(previewUrl, device, "after", WARM_TIMEOUT_MS));
    if (liveUrl) jobs.push(shoot(liveUrl, device, "before", WARM_TIMEOUT_MS));
  }
  await Promise.all(jobs);
}

export function deviceOutcome(
  shots: DeviceShot[],
  device: Device,
): "ok" | "timed_out" | "failed" {
  const after = shots.find((s) => s.device === device && s.version === "after");
  if (after?.image) return "ok";
  return after?.timedOut ? "timed_out" : "failed";
}
