import { describe, expect, it } from "vitest";
import {
  describeContent,
  describeFile,
  describeFiles,
  factsLine,
  goesLiveList,
  newChangeKey,
  normalizeAppliesTo,
  normalizeChangeKey,
  normalizeConversationUrl,
  reviewChecks,
  reviewOutcome,
  reviewToken,
  sanityBeforeAfter,
  STATUS_LABELS,
  valueToPlain,
  type CheckRow,
} from "@/lib/admin/change-describe";

describe("describeFile", () => {
  it.each([
    ["src/app/page.tsx", { label: "Home page", route: "/", shared: false }],
    ["src/app/(marketing)/about/page.tsx", { label: "/about page", route: "/about", shared: false }],
    ["src/app/blog/[slug]/page.tsx", { label: "Every /blog/[slug] page", route: null, shared: true }],
    ["src/app/brewsoul/layout.tsx", { label: "Frame around the /brewsoul pages", route: "/brewsoul", shared: true }],
    ["src/app/brewsoul/_components/hero.tsx", { label: "/brewsoul page", route: "/brewsoul", shared: false }],
    ["src/components/site-header.tsx", { label: "Site header (every page)", route: null, shared: true }],
    ["src/app/globals.css", { label: "Site-wide styles (every page)", route: null, shared: true }],
    ["src/app/layout.tsx", { label: "Frame around every page", route: null, shared: true }],
    ["next.config.ts", { label: "Site settings (redirects)", route: null, shared: true }],
    ["src/lib/content/kava.ts", { label: 'Site data "kava" (quizzes, directories, page text)', route: null, shared: true }],
    ["src/components/blog/gem-spark-card.tsx", { label: 'Shared section "gem-spark-card" (may appear on several pages)', route: null, shared: true }],
    ["public/images/a.png", { label: "Image or file: images/a.png", route: null, shared: false }],
    ["src/app/api/search/route.ts", { label: "Behind-the-scenes file: src/app/api/search/route.ts", route: null, shared: false }],
  ])("%s", (path, expected) => {
    expect(describeFile(path)).toEqual(expected);
  });

  it("describeFiles de-duplicates by label", () => {
    expect(describeFiles(["src/app/about/page.tsx", "src/app/about/hero.tsx", "src/app/globals.css"]).map((a) => a.label)).toEqual(["/about page", "Site-wide styles (every page)"]);
  });

  it("describeContent labels Sanity types", () => {
    expect(describeContent("post", "Five Cups")).toBe("Blog post: Five Cups");
    expect(describeContent("mystery", "X")).toBe("Content: X");
  });
});

describe("valueToPlain / sanityBeforeAfter", () => {
  it("renders values in plain words", () => {
    expect(valueToPlain(undefined)).toBe("(empty)");
    expect(valueToPlain("")).toBe("(empty)");
    expect(valueToPlain(3)).toBe("3");
    expect(valueToPlain(false)).toBe("false");
    expect(valueToPlain([{ _type: "block", children: [{ text: "Hello " }, { text: "world" }] }, { _type: "block", children: [{ text: "Two" }] }])).toBe("Hello world\nTwo");
    expect(valueToPlain({ _type: "image", asset: {} })).toBe("(an image)");
    expect(valueToPlain({ _type: "slug", current: "five-cups" })).toBe("five-cups");
    expect(valueToPlain({ a: 1 })).toBe('{"a":1}');
    const long = valueToPlain("x".repeat(400));
    expect(long).toHaveLength(280);
    expect(long.endsWith("…")).toBe(true);
  });

  it("compares field by field, one level into plain objects, skipping system fields", () => {
    const before = { _rev: "1", title: "Old", seo: { _type: "seo", metaTitle: "A", noIndex: false }, tags: ["x"] };
    const after = { _rev: "2", title: "New", seo: { _type: "seo", metaTitle: "B", noIndex: false }, tags: ["x"] };
    expect(sanityBeforeAfter(before, after)).toEqual([
      { label: "Title", before: "Old", after: "New" },
      { label: "Seo › Meta Title", before: "A", after: "B" },
    ]);
  });

  it("marks new and removed documents", () => {
    expect(sanityBeforeAfter(null, { title: "T" })).toEqual([{ label: "Title", before: "(new)", after: "T" }]);
    expect(sanityBeforeAfter({ title: "T" }, null)).toEqual([{ label: "Title", before: "T", after: "(removed)" }]);
  });
});

describe("reviewToken", () => {
  it("is stable regardless of draft order and changes with anything reviewed", () => {
    const t = reviewToken("sha1", [{ id: "b", rev: "2" }, { id: "a", rev: "1" }]);
    expect(t).toMatch(/^[0-9a-f]{16}$/);
    expect(reviewToken("sha1", [{ id: "a", rev: "1" }, { id: "b", rev: "2" }])).toBe(t);
    expect(reviewToken("sha2", [{ id: "a", rev: "1" }, { id: "b", rev: "2" }])).not.toBe(t);
    expect(reviewToken("sha1", [{ id: "a", rev: "1" }, { id: "b", rev: "3" }])).not.toBe(t);
    expect(reviewToken("sha1", [{ id: "a", rev: "1" }])).not.toBe(t);
    expect(reviewToken(null, [])).toBe(reviewToken(null, []));
  });
});

describe("factsLine / goesLiveList", () => {
  const areas = [{ label: "/about page", route: "/about", shared: false }];
  it("says what's in and that other changes are not", () => {
    expect(factsLine({ areas, content: ["Blog post: X"], checkStatus: "failure", otherPendingCount: 2 })).toBe(
      "Changes: /about page; Blog post: X. 2 other waiting changes are NOT included. Site check failed, this needs a fix before it can go live.",
    );
    expect(factsLine({ areas: [], content: [], checkStatus: "unknown", otherPendingCount: 0 })).toBe("Nothing has been changed yet. No other changes are included.");
  });

  it("goesLiveList ends with what is not included", () => {
    expect(goesLiveList({ summary: "Fix typo", appliesTo: "mobile", areas, content: ["Blog post: X"], otherPendingCount: 1 })).toEqual([
      "Fix typo",
      "Page: /about page",
      "Blog post: X",
      "Applies to: Mobile only (desktop unchanged)",
      "1 other waiting change is NOT included",
    ]);
  });
});

describe("change keys and inputs", () => {
  it("newChangeKey is date-suffix and round-trips through normalizeChangeKey", () => {
    const key = newChangeKey(new Date("2026-10-16T00:00:00Z"));
    expect(key).toMatch(/^20261016-[a-z0-9]{6}$/);
    expect(normalizeChangeKey(key)).toBe(key);
    expect(normalizeChangeKey(`adminChange.${key}`)).toBe(key);
    expect(normalizeChangeKey(`admin/mcp-${key}`)).toBe(key);
  });

  it("normalizeChangeKey refuses anything else", () => {
    for (const bad of ["", null, "2026-ab", "20261016-ABCDEF", "20261016-abc123x", "../20261016-abc123", "drafts.20261016-abc123"]) {
      expect(normalizeChangeKey(bad)).toBeNull();
    }
  });

  it("normalizeConversationUrl keeps only real https chat links", () => {
    expect(normalizeConversationUrl(" https://claude.ai/chat/abc ")).toBe("https://claude.ai/chat/abc");
    expect(normalizeConversationUrl("https://chatgpt.com/c/123")).toBe("https://chatgpt.com/c/123");
    for (const bad of ["https://claude.ai/", "http://claude.ai/chat/x", "https://evil.com/chat", "https://claude.ai.evil.com/x", "javascript:alert(1)", 5]) {
      expect(normalizeConversationUrl(bad)).toBeNull();
    }
  });

  it("normalizeAppliesTo defaults to both", () => {
    expect(normalizeAppliesTo("desktop")).toBe("desktop");
    expect(normalizeAppliesTo("tablet")).toBe("both");
    expect(STATUS_LABELS.awaiting_confirmation).toBe("Waiting for your OK");
  });
});

const base = { hasCode: true, build: "success" as const, buildStuck: false, ci: "success" as const, headSha: "h1", lint: { headSha: "h1", files: [] }, devices: null };
const byKey = (rows: CheckRow[]) => Object.fromEntries(rows.map((r) => [r.key, r.state]));

describe("reviewChecks", () => {
  it("content-only changes need no checks", () => {
    expect(reviewChecks({ ...base, hasCode: false }).every((c) => c.state === "not_needed" && !c.required)).toBe(true);
  });

  it("all green", () => {
    expect(byKey(reviewChecks(base))).toEqual({ build: "passed", typecheck: "passed", lint: "passed", ci: "passed", devices: "not_run" });
  });

  it("type check follows the build", () => {
    expect(byKey(reviewChecks({ ...base, build: "failure" })).typecheck).toBe("failed");
    expect(byKey(reviewChecks({ ...base, build: "pending" })).typecheck).toBe("running");
    expect(byKey(reviewChecks({ ...base, build: "pending", buildStuck: true }))).toMatchObject({ build: "timed_out", typecheck: "timed_out" });
  });

  it("lint for an older version doesn't count", () => {
    expect(byKey(reviewChecks({ ...base, lint: { headSha: "old", files: [] } })).lint).toBe("not_run");
  });

  it("lint errors fail, warnings only flag, and a broken run is could-not-run", () => {
    const lint = (files: { path: string; errors: number; warnings: number; couldNotRun?: string | null }[]) => reviewChecks({ ...base, lint: { headSha: "h1", files } }).find((c) => c.key === "lint")!;
    expect(lint([{ path: "a", errors: 2, warnings: 0 }])).toMatchObject({ state: "failed", detail: expect.stringMatching(/^2 errors/) });
    expect(lint([{ path: "a", errors: 0, warnings: 1 }])).toMatchObject({ state: "issues", detail: expect.stringMatching(/^1 warning in/) });
    expect(lint([{ path: "a", errors: 0, warnings: 0, couldNotRun: "Cannot find module" }])).toMatchObject({ state: "could_not_run", detail: "Cannot find module" });
  });

  it("CI failing, running, stuck or absent", () => {
    const ci = (over: object) => reviewChecks({ ...base, ...over }).find((c) => c.key === "ci")!;
    expect(ci({ ci: "failure", ciFailing: ["lint"] })).toMatchObject({ state: "failed", detail: expect.stringMatching(/^Failed: lint/) });
    expect(ci({ ci: "pending", ciWaiting: ["tests"] })).toMatchObject({ state: "running", detail: expect.stringMatching(/Running: tests/) });
    expect(ci({ ci: "pending", buildStuck: true }).state).toBe("timed_out");
    expect(ci({ ci: null })).toMatchObject({ state: "not_needed", required: false });
  });

  it("device screenshots are optional and only count for the current version", () => {
    const dev = (devices: object | null) => reviewChecks({ ...base, devices: devices as never }).find((c) => c.key === "devices")!;
    expect(dev({ headSha: "h1", phone: "ok", laptop: "ok" })).toMatchObject({ state: "passed", required: false });
    expect(dev({ headSha: "h1", phone: "timed_out", laptop: "ok" })).toMatchObject({ state: "timed_out", detail: "Phone screenshot timed out. Retry usually works." });
    expect(dev({ headSha: "h1", phone: "failed", laptop: "failed" }).detail).toMatch(/^Phone and Laptop screenshot didn't load/);
    expect(dev({ headSha: "old", phone: "ok", laptop: "ok" }).state).toBe("not_run");
  });
});

describe("reviewOutcome: Publish only unlocks when everything required passed", () => {
  const outcome = (over: object, checks = reviewChecks(base), problems: string[] = []) =>
    reviewOutcome({ status: "ready_for_review", checks, hasPreview: true, problems, ...over });

  it("ready: publish, preview and discard", () => {
    expect(outcome({})).toMatchObject({ state: "ready", label: "Ready for review", actions: { preview: true, discard: true, publish: true, retry: false } });
  });

  it("warnings and missing screenshots don't block", () => {
    const checks = reviewChecks({ ...base, lint: { headSha: "h1", files: [{ path: "a", errors: 0, warnings: 3 }] } });
    expect(outcome({}, checks).actions.publish).toBe(true);
  });

  it.each([
    ["build failed", { build: "failure" }, "failed"],
    ["lint errors", { lint: { headSha: "h1", files: [{ path: "a", errors: 1, warnings: 0 }] } }, "failed"],
    ["lint could not run", { lint: { headSha: "h1", files: [{ path: "a", errors: 0, warnings: 0, couldNotRun: "x" }] } }, "failed"],
    ["CI failed", { ci: "failure" }, "failed"],
    ["stuck", { build: "pending", buildStuck: true }, "stuck"],
    ["still building", { build: "pending" }, "checking"],
    ["lint not run on the latest version", { lint: null }, "checking"],
  ])("%s blocks publishing", (_name, over, state) => {
    const o = outcome({}, reviewChecks({ ...base, ...over } as never));
    expect(o.state).toBe(state);
    expect(o.actions.publish).toBe(false);
  });

  it("a non-check problem blocks publishing", () => {
    const o = outcome({}, reviewChecks(base), ["Nothing has been changed yet."]);
    expect(o).toMatchObject({ state: "failed", actions: { publish: false, retry: true } });
    expect(o.nextStep).toMatch(/^Nothing has been changed yet\./);
  });

  it.each(["published", "discarded", "awaiting_confirmation", "draft"] as const)("status %s never offers Publish", (status) => {
    expect(outcome({ status }).actions.publish).toBe(false);
  });

  it("awaiting confirmation only allows discard; draft allows preview and discard", () => {
    expect(outcome({ status: "awaiting_confirmation" }).actions).toEqual({ preview: false, discard: true, publish: false, retry: false });
    expect(outcome({ status: "draft" }).actions).toEqual({ preview: true, discard: true, publish: false, retry: false });
  });

  it("without a preview, Ready says to look at what goes live", () => {
    expect(outcome({ hasPreview: false }).nextStep).toMatch(/^Look over what will go live/);
  });
});
