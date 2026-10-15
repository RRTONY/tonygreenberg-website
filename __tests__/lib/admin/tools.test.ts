import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as gh from "@/lib/admin/github-client";
import { client } from "@/lib/sanity/client";
import { createDraft, deleteDraft, getDocumentForEditing, patchDraft } from "@/lib/admin/sanity-content";
import { getAnalyticsSummary } from "@/lib/admin/ga4-client";
import { checkLighthouse } from "@/lib/admin/lighthouse-check";
import { getSearchPerformance, inspectUrls, listSitemaps, listSites } from "@/lib/admin/gsc-client";
import { checkPageSeo } from "@/lib/admin/seo-check";
import { checkCode } from "@/lib/admin/code-check";
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

describe("more repo file tools", () => {
  it("github_list_dir normalises the path and lists from the read branch", async () => {
    vi.mocked(gh.listDir).mockResolvedValue([{ name: "app", type: "dir" }] as never);
    await expect(runAdminTool("github_list_dir", { path: '"./src/"' }, ctx)).resolves.toEqual({ output: [{ name: "app", type: "dir" }] });
    expect(gh.listDir).toHaveBeenCalledWith("src", "main");
    await runAdminTool("github_list_dir", { path: "ROOT" }, ctx);
    expect(gh.listDir).toHaveBeenLastCalledWith("", "main");
  });

  it("github_write_file needs a path and defaults the commit message", async () => {
    expect(await runAdminTool("github_write_file", { path: "/", content: "x" }, ctx)).toEqual({ output: { error: "A repo-relative file path is required." }, isError: true });
    expect(ctx.ensureWriteBranch).not.toHaveBeenCalled();
    await runAdminTool("github_write_file", { path: "src/a.ts" }, ctx);
    expect(gh.putFile).toHaveBeenCalledWith("src/a.ts", "", "MCP edit", "admin/mcp-20261016-abc123");
  });

  it("github_delete_file deletes on the change's branch with a default message, and needs a path", async () => {
    expect((await runAdminTool("github_delete_file", {}, ctx)).isError).toBe(true);
    const r = await runAdminTool("github_delete_file", { path: "src/app/old/page.tsx" }, ctx);
    expect(r).toEqual({ output: { ok: true, path: "src/app/old/page.tsx", branch: "admin/mcp-20261016-abc123" } });
    expect(gh.deleteFile).toHaveBeenCalledWith("src/app/old/page.tsx", "MCP delete", "admin/mcp-20261016-abc123");
    expect(ctx.log).toHaveBeenCalledWith("Deleted src/app/old/page.tsx on admin/mcp-20261016-abc123: MCP delete");
  });

  it("github_write_binary_file needs a path and a file, and never opens a branch for a bad upload", async () => {
    expect((await runAdminTool("github_write_binary_file", { base64Content: "AAAA" }, ctx)).output).toEqual({ error: "A repo-relative file path is required." });
    const none = await runAdminTool("github_write_binary_file", { path: "public/a.png" }, ctx);
    expect(none.isError).toBe(true);
    expect(String((none.output as { error: string }).error)).toMatch(/No file was sent/);
    expect(ctx.ensureWriteBranch).not.toHaveBeenCalled();
  });

  it("github_write_binary_file downloads a source_url over fetch and commits the bytes", async () => {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 7, 7]);
    const fetchMock = vi.fn(async () => new Response(png, { status: 200, headers: { "content-type": "image/png" } }));
    vi.stubGlobal("fetch", fetchMock);
    const r = await runAdminTool("github_write_binary_file", { path: "public/logo.png", source_url: " https://images.example.com/logo.png ", message: "Add logo" }, ctx);
    expect(r.output).toMatchObject({ ok: true, path: "public/logo.png", sizeBytes: 10 });
    expect(String((fetchMock.mock.calls[0] as unknown[])[0])).toBe("https://images.example.com/logo.png");
    expect((fetchMock.mock.calls[0] as unknown[])[1]).toMatchObject({ redirect: "manual" });
    expect(gh.putFileBase64).toHaveBeenCalledWith("public/logo.png", png.toString("base64"), "Add logo", "admin/mcp-20261016-abc123");
    expect(ctx.log).toHaveBeenCalledWith("Wrote binary file public/logo.png on admin/mcp-20261016-abc123: Add logo");
  });

  it("github_write_binary_file refuses a non-https source_url without fetching", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const r = await runAdminTool("github_write_binary_file", { path: "public/logo.png", source_url: "http://127.0.0.1/logo.png" }, ctx);
    expect(r).toEqual({ output: { error: "Only public https links can be downloaded." }, isError: true });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(gh.putFileBase64).not.toHaveBeenCalled();
  });
});

describe("check tools", () => {
  it("seo_check_page defaults to / and turns a failure into a tool error", async () => {
    await expect(runAdminTool("seo_check_page", {}, ctx)).resolves.toEqual({ output: { url: "/" } });
    vi.mocked(checkPageSeo).mockRejectedValueOnce(new Error("timeout"));
    expect(await runAdminTool("seo_check_page", { path: "/about" }, ctx)).toEqual({ output: { error: "timeout" }, isError: true });
    vi.mocked(checkPageSeo).mockRejectedValueOnce("weird");
    expect(await runAdminTool("seo_check_page", { path: "/about" }, ctx)).toEqual({ output: { error: "Fetch failed" }, isError: true });
  });

  it("check_code_quality passes the normalised path and content, and reports failures", async () => {
    await expect(runAdminTool("check_code_quality", { path: "./src/a.tsx", content: "let a" }, ctx)).resolves.toEqual({ output: { eslint: { errorCount: 0 }, patternIssues: [] } });
    expect(checkCode).toHaveBeenCalledWith("src/a.tsx", "let a");
    vi.mocked(checkCode).mockRejectedValueOnce(new Error("eslint crashed"));
    expect(await runAdminTool("check_code_quality", { path: "a.ts" }, ctx)).toEqual({ output: { error: "eslint crashed" }, isError: true });
    vi.mocked(checkCode).mockRejectedValueOnce(42);
    expect(await runAdminTool("check_code_quality", { path: "a.ts" }, ctx)).toEqual({ output: { error: "Code check failed" }, isError: true });
  });

  it("check_pr_status waits on the change's PR and reports GitHub errors", async () => {
    ctx = makeCtx({ getPRNumber: vi.fn(async () => 7) });
    vi.mocked(gh.getPRChecksDetail).mockResolvedValue({ status: "success", previewUrl: "https://p", failingChecks: [] });
    expect((await runAdminTool("check_pr_status", {}, ctx)).output).toEqual({ status: "success", previewUrl: "https://p", failingChecks: [] });
    expect(gh.getPRChecksDetail).toHaveBeenCalledWith(7);
    vi.mocked(gh.getPRChecksDetail).mockRejectedValue(new Error("Bad credentials"));
    expect(await runAdminTool("check_pr_status", {}, ctx)).toEqual({ output: { error: "Bad credentials" }, isError: true });
    vi.mocked(gh.getPRChecksDetail).mockRejectedValue(null);
    expect(await runAdminTool("check_pr_status", {}, ctx)).toEqual({ output: { error: "Failed to check status" }, isError: true });
  });

  it("get_check_log_excerpt reports a failed log fetch", async () => {
    vi.mocked(gh.getFailingCheckLogExcerpt).mockRejectedValueOnce(new Error("404"));
    expect(await runAdminTool("get_check_log_excerpt", { checkRunId: 5 }, ctx)).toEqual({ output: { error: "404" }, isError: true });
    expect(gh.getFailingCheckLogExcerpt).toHaveBeenCalledWith(5);
    vi.mocked(gh.getFailingCheckLogExcerpt).mockRejectedValueOnce(undefined);
    expect(await runAdminTool("get_check_log_excerpt", { checkRunId: 5 }, ctx)).toEqual({ output: { error: "Failed to fetch log" }, isError: true });
  });

  it("lighthouse accepts desktop and defaults the path", async () => {
    await runAdminTool("lighthouse_check_page", { strategy: "desktop" }, ctx);
    expect(checkLighthouse).toHaveBeenCalledWith("/", "desktop");
    vi.mocked(checkLighthouse).mockRejectedValueOnce("nope");
    expect(await runAdminTool("lighthouse_check_page", {}, ctx)).toEqual({ output: { error: "Lighthouse check failed" }, isError: true });
  });
});

describe("Search Console tools", () => {
  it("search_console_sites wraps the list", async () => {
    vi.mocked(listSites).mockResolvedValue([{ siteUrl: "sc-domain:tonygreenberg.com" }] as never);
    expect(await runAdminTool("search_console_sites", {}, ctx)).toEqual({ output: { sites: [{ siteUrl: "sc-domain:tonygreenberg.com" }] } });
  });

  it("search_console_performance maps every input to the query it sends", async () => {
    await runAdminTool(
      "search_console_performance",
      { site: "  ", days: "28", startDate: "2026-09-01", endDate: " 2026-09-30 ", dimensions: ["query", 3], rowLimit: "50", searchType: "web", filters: [{ dimension: "page", operator: "contains", expression: "/blog" }, null], compare: true },
      ctx,
    );
    expect(getSearchPerformance).toHaveBeenCalledWith({
      site: undefined,
      days: 28,
      startDate: "2026-09-01",
      endDate: "2026-09-30",
      dimensions: ["query", "3"],
      rowLimit: 50,
      searchType: "web",
      filters: [
        { dimension: "page", operator: "contains", expression: "/blog" },
        { dimension: "", operator: undefined, expression: "" },
      ],
      compare: true,
    });
    await runAdminTool("search_console_performance", {}, ctx);
    expect(getSearchPerformance).toHaveBeenLastCalledWith({ site: undefined, days: undefined, startDate: undefined, endDate: undefined, dimensions: undefined, rowLimit: undefined, searchType: undefined, filters: undefined, compare: false });
  });

  it("search_console_performance turns an error into a tool error", async () => {
    vi.mocked(getSearchPerformance).mockRejectedValueOnce(new Error("User does not have sufficient permission"));
    expect(await runAdminTool("search_console_performance", {}, ctx)).toEqual({ output: { error: "User does not have sufficient permission" }, isError: true });
  });

  it("inspect accepts an array of urls and a site", async () => {
    await runAdminTool("search_console_inspect_url", { urls: ["https://tonygreenberg.com/a", "https://tonygreenberg.com/b"], site: "sc-domain:tonygreenberg.com" }, ctx);
    expect(inspectUrls).toHaveBeenCalledWith("sc-domain:tonygreenberg.com", ["https://tonygreenberg.com/a", "https://tonygreenberg.com/b"]);
  });

  it("search_console_sitemaps lists for the given site", async () => {
    vi.mocked(listSitemaps).mockResolvedValue({ sitemaps: [] } as never);
    expect(await runAdminTool("search_console_sitemaps", { site: "sc-domain:tonygreenberg.com" }, ctx)).toEqual({ output: { sitemaps: [] } });
    expect(listSitemaps).toHaveBeenCalledWith("sc-domain:tonygreenberg.com");
  });
});

describe("sanity_get_document and create titles", () => {
  it("returns the document, or an error when it's missing", async () => {
    vi.mocked(getDocumentForEditing).mockResolvedValueOnce({ _id: "p1", _type: "post" } as never);
    expect(await runAdminTool("sanity_get_document", { id: "p1" }, ctx)).toEqual({ output: { _id: "p1", _type: "post" } });
    vi.mocked(getDocumentForEditing).mockResolvedValueOnce(null as never);
    expect(await runAdminTool("sanity_get_document", { id: "gone" }, ctx)).toEqual({ output: { error: "No document found for gone" }, isError: true });
    expect(getDocumentForEditing).toHaveBeenLastCalledWith("gone");
  });

  it("patch claims by the published id with name or id as the title", async () => {
    vi.mocked(getDocumentForEditing).mockResolvedValueOnce({ _id: "drafts.a1", _type: "author", name: "Tony" } as never);
    await runAdminTool("sanity_patch_document", { id: "a1", patch: { bio: "x" } }, ctx);
    expect(ctx.claimContent).toHaveBeenLastCalledWith({ id: "a1", type: "author", title: "Tony", isNew: false });
    vi.mocked(getDocumentForEditing).mockResolvedValueOnce({ _id: "c1", _type: "category" } as never);
    await runAdminTool("sanity_patch_document", { id: "c1" }, ctx);
    expect(ctx.claimContent).toHaveBeenLastCalledWith({ id: "c1", type: "category", title: "c1", isNew: false });
    expect(patchDraft).toHaveBeenLastCalledWith("c1", {});
  });

  it("create logs the new draft and uses name as the title", async () => {
    await runAdminTool("sanity_create_document", { docType: "author", fields: { name: "Kim" } }, ctx);
    expect(ctx.claimContent).toHaveBeenCalledWith({ id: "new1", type: "author", title: "Kim", isNew: true });
    expect(ctx.log).toHaveBeenCalledWith("Created Sanity draft drafts.new1 (author)");
    expect(deleteDraft).not.toHaveBeenCalled();
  });
});
