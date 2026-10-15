import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as gh from "@/lib/admin/github-client";
import { client } from "@/lib/sanity/client";
import { createDraft, deleteDraft, getDocumentForEditing, patchDraft } from "@/lib/admin/sanity-content";
import { getAnalyticsSummary } from "@/lib/admin/ga4-client";
import { checkLighthouse } from "@/lib/admin/lighthouse-check";
import { inspectUrls } from "@/lib/admin/gsc-client";
import { ADMIN_TOOLS, normalizeRepoPath, runAdminTool, waitForChecks, type AdminToolContext } from "@/lib/admin/tools";
import { READ_ONLY_TOOLS } from "@/lib/admin/mcp-auth";
import { RULES_GATED_TOOLS } from "@/lib/admin/project-rules";

vi.mock("@/lib/admin/github-client", () => ({
  listDir: vi.fn(async () => []),
  getFile: vi.fn(async () => ({ content: "file body", sha: "s" })),
  putFile: vi.fn(async () => {}),
  putFileBase64: vi.fn(async () => {}),
  deleteFile: vi.fn(async () => {}),
  getPRChecksDetail: vi.fn(),
  getFailingCheckLogExcerpt: vi.fn(async () => "log tail"),
}));
vi.mock("@/lib/admin/sanity-content", () => ({
  createDraft: vi.fn(async () => ({ _id: "drafts.new1" })),
  deleteDraft: vi.fn(async () => {}),
  getDocumentForEditing: vi.fn(),
  patchDraft: vi.fn(async () => {}),
}));
vi.mock("@/lib/admin/seo-check", () => ({ checkPageSeo: vi.fn(async (p: string) => ({ url: p })) }));
vi.mock("@/lib/admin/code-check", () => ({ checkCode: vi.fn(async () => ({ eslint: { errorCount: 0 }, patternIssues: [] })) }));
vi.mock("@/lib/admin/lighthouse-check", () => ({ checkLighthouse: vi.fn(async () => ({ ok: 1 })) }));
vi.mock("@/lib/admin/ga4-client", () => ({ getAnalyticsSummary: vi.fn(async () => ({ ok: 1 })) }));
vi.mock("@/lib/admin/gsc-client", async (orig) => ({
  ...(await orig<typeof import("@/lib/admin/gsc-client")>()),
  getSearchPerformance: vi.fn(async () => ({})),
  inspectUrls: vi.fn(async () => ({})),
  listSitemaps: vi.fn(async () => ({})),
  listSites: vi.fn(async () => []),
}));

function makeCtx(over: Partial<AdminToolContext> = {}): AdminToolContext {
  return {
    getReadBranch: vi.fn(async () => "main"),
    ensureWriteBranch: vi.fn(async () => "admin/mcp-20261016-abc123"),
    getPRNumber: vi.fn(async () => null),
    log: vi.fn(),
    claimContent: vi.fn(async () => null),
    ...over,
  };
}
let ctx: AdminToolContext;
beforeEach(() => {
  ctx = makeCtx();
});

describe("tool list", () => {
  it("every tool has a unique name, a description and an object input schema", () => {
    const names = ADMIN_TOOLS.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
    for (const t of ADMIN_TOOLS) {
      expect(t.description.length, t.name).toBeGreaterThan(10);
      expect(t.input_schema.type).toBe("object");
    }
  });

  it("every tool that writes is rules-gated and not read-only", () => {
    for (const name of ["github_write_file", "github_delete_file", "github_write_binary_file", "sanity_patch_document", "sanity_create_document"]) {
      expect(ADMIN_TOOLS.some((t) => t.name === name), name).toBe(true);
      expect(RULES_GATED_TOOLS.has(name), name).toBe(true);
      expect(READ_ONLY_TOOLS.has(name), name).toBe(false);
    }
  });

  it("every tool is classified: read-only or rules-gated", () => {
    for (const t of ADMIN_TOOLS) expect(READ_ONLY_TOOLS.has(t.name) || RULES_GATED_TOOLS.has(t.name), t.name).toBe(true);
  });
});

describe("normalizeRepoPath", () => {
  it("strips quotes, ./ and slashes, and maps root placeholders to ''", () => {
    expect(normalizeRepoPath('"src/app"')).toBe("src/app");
    expect(normalizeRepoPath(`'"./src/app/"'`)).toBe("src/app");
    expect(normalizeRepoPath("/src/app")).toBe("src/app");
    for (const root of ['""', ".", "/", "ROOT", "", null, undefined]) expect(normalizeRepoPath(root)).toBe("");
  });
});

describe("repo file tools", () => {
  it("reads from the context's read branch", async () => {
    await expect(runAdminTool("github_read_file", { path: "src/app/page.tsx" }, ctx)).resolves.toEqual({ output: { content: "file body" } });
    expect(gh.getFile).toHaveBeenCalledWith("src/app/page.tsx", "main");
  });

  it("refuses to read secrets and admin code, but allows read-only build files", async () => {
    for (const path of [".env.local", "/src/lib/admin/mcp-auth.ts", "./pnpm-lock.yaml"]) {
      const r = await runAdminTool("github_read_file", { path }, ctx);
      expect(r.isError, path).toBe(true);
      expect(String((r.output as { error: string }).error)).toMatch(/off-limits/);
    }
    expect(gh.getFile).not.toHaveBeenCalled();
    expect((await runAdminTool("github_read_file", { path: "package.json" }, ctx)).isError).toBeUndefined();
  });

  it("reports a missing file and a missing path", async () => {
    vi.mocked(gh.getFile).mockResolvedValue(null);
    expect(await runAdminTool("github_read_file", { path: "nope.ts" }, ctx)).toEqual({ output: { error: "nope.ts does not exist" }, isError: true });
    expect((await runAdminTool("github_read_file", { path: "" }, ctx)).isError).toBe(true);
  });

  it("writes only to the change's own branch and logs it", async () => {
    const r = await runAdminTool("github_write_file", { path: "src/app/about/page.tsx", content: "x", message: "Fix typo" }, ctx);
    expect(r).toEqual({ output: { ok: true, path: "src/app/about/page.tsx", branch: "admin/mcp-20261016-abc123" } });
    expect(gh.putFile).toHaveBeenCalledWith("src/app/about/page.tsx", "x", "Fix typo", "admin/mcp-20261016-abc123");
    expect(ctx.log).toHaveBeenCalledWith(expect.stringContaining("Wrote src/app/about/page.tsx"));
  });

  it.each(["github_write_file", "github_delete_file", "github_write_binary_file"])("%s refuses denied paths before touching a branch", async (tool) => {
    for (const path of ["package.json", "src/proxy.ts", ".github/workflows/ci.yml", "netlify.toml", "src/lib/admin/tools.ts", "/.env"]) {
      const r = await runAdminTool(tool, { path, content: "x", base64Content: "AAAA" }, ctx);
      expect(r.isError, `${tool} ${path}`).toBe(true);
    }
    expect(ctx.ensureWriteBranch).not.toHaveBeenCalled();
    expect(gh.putFile).not.toHaveBeenCalled();
    expect(gh.deleteFile).not.toHaveBeenCalled();
  });

  it("a write fails when no change was started", async () => {
    ctx = makeCtx({ ensureWriteBranch: vi.fn(async () => { throw new Error("Start a change first"); }) });
    await expect(runAdminTool("github_write_file", { path: "a.ts", content: "x" }, ctx)).rejects.toThrow("Start a change first");
    expect(gh.putFile).not.toHaveBeenCalled();
  });

  it("binary writes check the bytes match the file type", async () => {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1]).toString("base64");
    const ok = await runAdminTool("github_write_binary_file", { path: "public/a.png", base64Content: png }, ctx);
    expect(ok.output).toMatchObject({ ok: true, sizeBytes: 9 });
    expect(gh.putFileBase64).toHaveBeenCalledWith("public/a.png", png, "MCP binary upload", "admin/mcp-20261016-abc123");
    const bad = await runAdminTool("github_write_binary_file", { path: "public/b.png", base64Content: Buffer.from("<html>").toString("base64") }, ctx);
    expect(bad.isError).toBe(true);
    expect(gh.putFileBase64).toHaveBeenCalledTimes(1);
  });
});

describe("sanity tools", () => {
  it("patch refuses a missing doc, a non-editable type and a refused claim", async () => {
    vi.mocked(getDocumentForEditing).mockResolvedValueOnce(undefined as never);
    expect((await runAdminTool("sanity_patch_document", { id: "x", patch: {} }, ctx)).isError).toBe(true);

    vi.mocked(getDocumentForEditing).mockResolvedValueOnce({ _id: "adminChange.1", _type: "adminChange" } as never);
    expect((await runAdminTool("sanity_patch_document", { id: "adminChange.1", patch: { status: "published" } }, ctx)).output).toEqual({ error: '"adminChange" documents are not editable by the MCP agent' });

    vi.mocked(getDocumentForEditing).mockResolvedValueOnce({ _id: "drafts.p1", _type: "post", title: "Five Cups" } as never);
    ctx = makeCtx({ claimContent: vi.fn(async () => "It belongs to another waiting change.") });
    expect((await runAdminTool("sanity_patch_document", { id: "p1", patch: {} }, ctx)).output).toEqual({ error: "It belongs to another waiting change." });
    expect(ctx.claimContent).toHaveBeenCalledWith({ id: "p1", type: "post", title: "Five Cups", isNew: false });
    expect(patchDraft).not.toHaveBeenCalled();
  });

  it("patch writes a draft once the claim succeeds", async () => {
    vi.mocked(getDocumentForEditing).mockResolvedValue({ _id: "p1", _type: "post", title: "T" } as never);
    await expect(runAdminTool("sanity_patch_document", { id: "p1", patch: { title: "New" } }, ctx)).resolves.toEqual({ output: { ok: true, id: "p1" } });
    expect(patchDraft).toHaveBeenCalledWith("p1", { title: "New" });
  });

  it("create refuses disallowed types and removes the draft when the claim is refused", async () => {
    expect((await runAdminTool("sanity_create_document", { docType: "adminChange", fields: {} }, ctx)).isError).toBe(true);
    expect(createDraft).not.toHaveBeenCalled();
    ctx = makeCtx({ claimContent: vi.fn(async () => "Start a change first") });
    expect((await runAdminTool("sanity_create_document", { docType: "post", fields: { title: "New" } }, ctx)).output).toEqual({ error: "Start a change first" });
    expect(deleteDraft).toHaveBeenCalledWith("drafts.new1");
  });

  it("create returns the new draft id", async () => {
    await expect(runAdminTool("sanity_create_document", { docType: "redirect", fields: { source: "/a" } }, ctx)).resolves.toEqual({ output: { ok: true, id: "drafts.new1" } });
    expect(ctx.claimContent).toHaveBeenCalledWith({ id: "new1", type: "redirect", title: "New item", isNew: true });
  });

  it("query uses the read-only client", async () => {
    vi.mocked(client.fetch).mockResolvedValue([{ _id: "a" }] as never);
    await expect(runAdminTool("sanity_query", { groq: '*[_type=="post"][0...1]' }, ctx)).resolves.toEqual({ output: [{ _id: "a" }] });
  });
});

describe("checks and Google tools", () => {
  afterEach(() => {
    vi.useRealTimers();
  });
  it("check_pr_status says so when there's no PR", async () => {
    expect((await runAdminTool("check_pr_status", {}, ctx)).output).toMatchObject({ status: "no_pending_change" });
  });

  it("waitForChecks polls while pending, then gives up with a note", async () => {
    vi.useFakeTimers();
    vi.mocked(gh.getPRChecksDetail).mockResolvedValue({ status: "pending", previewUrl: null, failingChecks: [] });
    const p = waitForChecks(4);
    await vi.advanceTimersByTimeAsync(25_000);
    const r = await p;
    expect(r.note).toMatch(/Still pending after waiting ~\d+s/);
    expect(vi.mocked(gh.getPRChecksDetail).mock.calls.length).toBeGreaterThan(2);
  });

  it("waitForChecks returns as soon as checks finish", async () => {
    vi.mocked(gh.getPRChecksDetail).mockResolvedValue({ status: "success", previewUrl: null, failingChecks: [] });
    await expect(waitForChecks(4)).resolves.toEqual({ status: "success", previewUrl: null, failingChecks: [] });
    expect(gh.getPRChecksDetail).toHaveBeenCalledTimes(1);
  });

  it("get_check_log_excerpt needs a number", async () => {
    expect((await runAdminTool("get_check_log_excerpt", { checkRunId: "abc" }, ctx)).isError).toBe(true);
    expect((await runAdminTool("get_check_log_excerpt", { checkRunId: "12" }, ctx)).output).toEqual({ log: "log tail" });
  });

  it("clamps analytics days and defaults lighthouse to mobile", async () => {
    await runAdminTool("check_analytics", { days: 9999 }, ctx);
    await runAdminTool("check_analytics", { days: -1 }, ctx);
    expect(vi.mocked(getAnalyticsSummary).mock.calls).toEqual([[365], [7]]);
    await runAdminTool("lighthouse_check_page", { path: "/x", strategy: "tablet" }, ctx);
    expect(checkLighthouse).toHaveBeenCalledWith("/x", "mobile");
  });

  it("turns Google errors into tool errors", async () => {
    vi.mocked(getAnalyticsSummary).mockRejectedValue(new Error("GA4_PROPERTY_ID_TONYGREENBERG is not configured"));
    await expect(runAdminTool("check_analytics", {}, ctx)).resolves.toEqual({ output: { error: "GA4_PROPERTY_ID_TONYGREENBERG is not configured" }, isError: true });
  });

  it("inspect needs urls; a single url is accepted", async () => {
    expect((await runAdminTool("search_console_inspect_url", {}, ctx)).isError).toBe(true);
    await runAdminTool("search_console_inspect_url", { url: "https://tonygreenberg.com/" }, ctx);
    expect(inspectUrls).toHaveBeenCalledWith(undefined, ["https://tonygreenberg.com/"]);
  });

  it("unknown tools are refused", async () => {
    await expect(runAdminTool("rm_rf", {}, ctx)).resolves.toEqual({ output: { error: 'Unknown tool "rm_rf"' }, isError: true });
  });
});
