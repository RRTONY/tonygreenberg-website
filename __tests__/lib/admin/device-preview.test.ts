import { afterEach, describe, expect, it, vi } from "vitest";
import { captureDevices, deviceOutcome, liveTarget, parseScreenshot, previewTarget, warmDevices } from "@/lib/admin/device-preview";

const PREVIEW = "https://deploy-preview-12--tonygreenberg-website.netlify.app";
const IMG = "data:image/jpeg;base64,AAAA";
const psi = (data?: string) => ({ lighthouseResult: { audits: { "final-screenshot": { details: { data } } } } });

afterEach(() => {

  vi.unstubAllEnvs();

});
describe("liveTarget / previewTarget", () => {
  it("builds live and preview URLs, defaulting to /", () => {
    expect(liveTarget("blog/x")).toBe("https://tonygreenberg.com/blog/x");
    expect(liveTarget(undefined)).toBe("https://tonygreenberg.com/");
    expect(previewTarget(PREVIEW, "/about")).toBe(`${PREVIEW}/about`);
  });

  it("refuses any preview origin that isn't this site's Netlify deploy preview", () => {
    for (const origin of [
      "https://deploy-preview-12--other-site.netlify.app",
      "https://evil.com",
      `${PREVIEW}.evil.com`,
      "http://deploy-preview-12--tonygreenberg-website.netlify.app",
      `${PREVIEW}/`,
    ]) {
      expect(previewTarget(origin, "/")).toBeNull();
    }
    expect(previewTarget(null, "/")).toBeNull();
  });

  it("refuses paths with traversal, queries, @ or other odd characters", () => {
    for (const p of ["/../etc", "/a?b=1", "/@evil.com", "/a b", "/a#x", "/<script>"]) {
      expect(liveTarget(p)).toBeNull();
      expect(previewTarget(PREVIEW, p)).toBeNull();
    }
  });
});

describe("parseScreenshot", () => {
  it("returns phone and laptop sizes for a real image", () => {
    expect(parseScreenshot(psi(IMG), "phone")).toEqual({ device: "phone", version: "after", image: IMG, width: 412, height: 823 });
    expect(parseScreenshot(psi(IMG), "laptop", "before")).toEqual({ device: "laptop", version: "before", image: IMG, width: 1350, height: 940 });
  });

  it("reports a missing or non-image screenshot", () => {
    expect(parseScreenshot({}, "phone").error).toBe("No screenshot came back");
    expect(parseScreenshot(psi("https://x/a.jpg"), "phone").image).toBeNull();
  });
});

describe("captureDevices / warmDevices", () => {
  it("shoots after (and before when there's a live URL) for each device, with the right strategy", async () => {
    vi.stubEnv("GOOGLE_API_KEY", "k");
    const fetchMock = vi.fn(async () => new Response(JSON.stringify(psi(IMG))));
    vi.stubGlobal("fetch", fetchMock);
    const shots = await captureDevices(`${PREVIEW}/`, "https://tonygreenberg.com/");
    expect(shots.map((s) => `${s.device}:${s.version}`)).toEqual(["phone:after", "phone:before", "laptop:after", "laptop:before"]);
    const urls = fetchMock.mock.calls.map((c) => new URL((c as unknown as [string])[0]).searchParams);
    expect(urls.map((p) => p.get("strategy"))).toEqual(["mobile", "mobile", "desktop", "desktop"]);
    expect(urls[0].get("url")).toBe(`${PREVIEW}/`);
    expect(urls[0].get("key")).toBe("k");
  });

  it("only shoots the requested devices, with no before when there's no live URL", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify(psi(IMG)))));
    expect((await captureDevices(`${PREVIEW}/`, null, ["laptop"])).map((s) => s.version)).toEqual(["after"]);
  });

  it("turns HTTP errors, network errors and timeouts into readable errors", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 500 })));
    expect((await captureDevices(PREVIEW, null, ["phone"]))[0].error).toBe("Google returned 500");

    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("ECONNRESET"); }));
    expect((await captureDevices(PREVIEW, null, ["phone"]))[0]).toMatchObject({ timedOut: false, error: "Couldn't load the page" });

    const abort = Object.assign(new Error("aborted"), { name: "AbortError" });
    vi.stubGlobal("fetch", vi.fn(async () => { throw abort; }));
    expect((await captureDevices(PREVIEW, null, ["phone"]))[0]).toMatchObject({ timedOut: true, error: expect.stringMatching(/Took too long/) });
  });

  it("warmDevices requests all four shots and resolves to nothing", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify(psi(IMG))));
    vi.stubGlobal("fetch", fetchMock);
    await expect(warmDevices(PREVIEW, "https://tonygreenberg.com/")).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });
});

describe("deviceOutcome", () => {
  it("is ok, timed_out or failed based on the after shot", () => {
    const shots = [
      { device: "phone", version: "after", image: IMG, width: 1, height: 1 },
      { device: "laptop", version: "after", image: null, width: null, height: null, timedOut: true },
      { device: "laptop", version: "before", image: IMG, width: 1, height: 1 },
    ] as const;
    expect(deviceOutcome([...shots], "phone")).toBe("ok");
    expect(deviceOutcome([...shots], "laptop")).toBe("timed_out");
    expect(deviceOutcome([], "phone")).toBe("failed");
  });
});
