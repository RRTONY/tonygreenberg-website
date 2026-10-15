import { beforeEach, describe, expect, it, vi } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import * as cs from "@/lib/admin/change-sets";
import { runAdminTool } from "@/lib/admin/tools";
import { getProjectRules } from "@/lib/admin/project-rules";
import { createAdminMcpServer } from "@/lib/admin/mcp-server";
import { PENDING_CHANGES_UI_URI } from "@/lib/admin/mcp-ui-widgets";
import { READ_ONLY_TOOLS, type McpUser } from "@/lib/admin/mcp-auth";

vi.mock("next/server", () => ({ after: vi.fn() }));
vi.mock("@/lib/admin/github-client", () => ({ getPRChecksDetail: vi.fn(), getPRHeadSha: vi.fn(), GITHUB_REPO: { owner: "RRTONY", repo: "tonygreenberg-website" } }));
vi.mock("@/lib/admin/mcp-tool-context", () => ({
  buildMcpToolContext: vi.fn(async () => ({ ctx: {}, auditLog: [], finalize: async () => ({ branch: null, prNumber: null, prUrl: null }) })),
}));
vi.mock("@/lib/admin/tools", async (orig) => ({ ...(await orig<typeof import("@/lib/admin/tools")>()), runAdminTool: vi.fn(async () => ({ output: { ok: true } })) }));
vi.mock("@/lib/admin/project-rules", async (orig) => ({
  ...(await orig<typeof import("@/lib/admin/project-rules")>()),
  getProjectRules: vi.fn(async () => ({ version: "rv-current", content: "# AGENTS", fullRules: "# CONTRIBUTING" })),
  getProjectGuides: vi.fn(async () => ({ taskGuide: "tg", projectStructure: "ps", migrationStatus: "ms" })),
  listKnowledgeBase: vi.fn(async () => ["docs/ai/README.md"]),
}));
vi.mock("@/lib/admin/change-sets", async (orig) => ({
  ...(await orig<typeof import("@/lib/admin/change-sets")>()),
  getChangeSet: vi.fn(),
  createChangeSet: vi.fn(),
  confirmChange: vi.fn(),
  markEdited: vi.fn(async () => {}),
  publishChange: vi.fn(async () => ({ ok: true, changeId: KEY, mergeSha: "m", published: [] })),
  discardChange: vi.fn(async () => ({ ok: true, changeId: KEY })),
  undoChange: vi.fn(),
  submitForReview: vi.fn(),
  listOpenChangeSets: vi.fn(async () => []),
  reconcileWithGitHub: vi.fn(async (o: unknown) => o),
  pendingOverview: vi.fn(async () => ({ changes: [], olderChanges: [], unrelatedDrafts: [] })),
  buildReview: vi.fn(),
  changeHistory: vi.fn(async () => []),
}));

const KEY = "20261016-abc123";
const users: Record<string, McpUser> = {
  read: { name: "Reader", email: "r@x.com", role: "read" },
  edit: { name: "Kim", email: "kim@x.com", role: "edit" },
  write: { name: "Tony", email: "tony@x.com", role: "write" },
};
const change = (over: Partial<cs.ChangeSet> = {}) => ({ key: KEY, title: "Fix typo", request: "r", status: "draft", requestedBy: { name: "Kim" }, createdAt: "t", branch: null, prNumber: null, content: [], ...over }) as cs.ChangeSet;

async function connect(user: McpUser) {
  const server = createAdminMcpServer(user, "https://tonygreenberg.com");
  const [a, b] = InMemoryTransport.createLinkedPair();
  const client = new Client({ name: "test", version: "1" });
  await Promise.all([server.connect(a), client.connect(b)]);
  const call = async (name: string, args: Record<string, unknown> = {}) => {
    const r = (await client.callTool({ name, arguments: args })) as { isError?: boolean; content: { text: string }[]; structuredContent?: Record<string, unknown>; _meta?: Record<string, unknown> };
    return { ...r, json: JSON.parse(r.content[0].text) };
  };
  return { client, call };
}

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.mocked(cs.getChangeSet).mockResolvedValue(change());
});

describe("tools/list", () => {
  it("read users only see read-only tools", async () => {
    const { client } = await connect(users.read);
    const { tools } = await client.listTools();
    expect(tools.length).toBeGreaterThan(5);
    for (const t of tools) expect(READ_ONLY_TOOLS.has(t.name), t.name).toBe(true);
    expect(tools.every((t) => t.annotations?.readOnlyHint === true)).toBe(true);
  });

  it("edit users don't see publish_changes; write users do", async () => {
    const edit = (await (await connect(users.edit)).client.listTools()).tools.map((t) => t.name);
    expect(edit).toContain("github_write_file");
    expect(edit).not.toContain("publish_changes");
    expect((await (await connect(users.write)).client.listTools()).tools.map((t) => t.name)).toContain("publish_changes");
  });

  it("gated tools require rules_version, edit tools require change_id, and publish is marked destructive", async () => {
    const { tools } = await (await connect(users.write)).client.listTools();
    const by = Object.fromEntries(tools.map((t) => [t.name, t]));
    expect(by.github_write_file.inputSchema.required).toEqual(expect.arrayContaining(["path", "change_id", "rules_version"]));
    expect(by.sanity_patch_document.inputSchema.required).toEqual(expect.arrayContaining(["change_id", "rules_version"]));
    expect(by.github_read_file.inputSchema.required).not.toContain("rules_version");
    expect(by.github_read_file.inputSchema.properties).toHaveProperty("change_id");
    expect(by.publish_changes.annotations).toMatchObject({ destructiveHint: true, openWorldHint: true, readOnlyHint: false });
    expect(by.github_write_file.description).toMatch(/Requires rules_version/);
  });
});

describe("resources", () => {
  it("serves the review card and refuses unknown resources", async () => {
    const { client } = await connect(users.read);
    const { contents } = await client.readResource({ uri: PENDING_CHANGES_UI_URI });
    expect(contents[0]).toMatchObject({ mimeType: "text/html;profile=mcp-app" });
    await expect(client.readResource({ uri: "ui://other" })).rejects.toThrow(/Unknown resource/);
    await expect(client.listResourceTemplates()).resolves.toMatchObject({ resourceTemplates: [] });
  });
});

describe("access and rules gating", () => {
  it("refuses a tool the role can't use, even if called directly", async () => {
    const { call } = await connect(users.read);
    const r = await call("github_write_file", { path: "a.ts", content: "x", change_id: KEY, rules_version: "rv-current" });
    expect(r.isError).toBe(true);
    expect(r.json.error).toMatch(/access level \(read\) doesn't allow github_write_file/);
    expect(runAdminTool).not.toHaveBeenCalled();
    const e = await (await connect(users.edit)).call("publish_changes", { change_id: KEY, rules_version: "rv-current", review_token: "t" });
    expect(e.isError).toBe(true);
    expect(cs.publishChange).not.toHaveBeenCalled();
  });

  it("get_project_rules returns the rules version and both rule files", async () => {
    const r = await (await connect(users.edit)).call("get_project_rules");
    expect(r.json).toMatchObject({ rulesVersion: "rv-current", rules: "# AGENTS", fullRules: "# CONTRIBUTING", you: { role: "edit" } });
  });

  it("blocks gated tools without, or with a stale, rules_version", async () => {
    const { call } = await connect(users.write);
    expect((await call("github_write_file", { path: "a.ts", content: "x", change_id: KEY })).json.error).toMatch(/call get_project_rules first/);
    expect((await call("github_write_file", { path: "a.ts", content: "x", change_id: KEY, rules_version: "old" })).json.error).toMatch(/rules changed since you read them/);
    expect((await call("publish_changes", { change_id: KEY, review_token: "t" })).isError).toBe(true);
    expect(runAdminTool).not.toHaveBeenCalled();
    expect(cs.publishChange).not.toHaveBeenCalled();
  });

  it("fails closed when the rules can't be loaded", async () => {
    vi.mocked(getProjectRules).mockRejectedValue(new Error("GitHub down"));
    const r = await (await connect(users.write)).call("github_write_file", { path: "a.ts", content: "x", change_id: KEY, rules_version: "rv-current" });
    expect(r.json.error).toMatch(/Could not load AGENTS.md.*was not made/);
    expect(runAdminTool).not.toHaveBeenCalled();
  });
});

describe("change rules", () => {
  const gated = { rules_version: "rv-current" };

  it("an edit needs a valid change_id", async () => {
    const { call } = await connect(users.edit);
    expect((await call("github_write_file", { path: "a.ts", content: "x", ...gated })).json.error).toMatch(/Every edit must belong to a change/);
    expect((await call("github_write_file", { path: "a.ts", content: "x", change_id: "../../main", ...gated })).json.error).toMatch(/isn't a valid change_id/);
    vi.mocked(cs.getChangeSet).mockResolvedValue(null);
    expect((await call("github_write_file", { path: "a.ts", content: "x", change_id: KEY, ...gated })).json.error).toMatch(/No change found/);
    expect(runAdminTool).not.toHaveBeenCalled();
  });

  it("refuses edits before the person confirmed, or after the change closed", async () => {
    const { call } = await connect(users.edit);
    vi.mocked(cs.getChangeSet).mockResolvedValue(change({ status: "awaiting_confirmation", understoodAs: "Change a word" }));
    expect((await call("github_write_file", { path: "a.ts", content: "x", change_id: KEY, ...gated })).json.error).toMatch(/hasn't confirmed what you understood yet \("Change a word"\)/);
    vi.mocked(cs.getChangeSet).mockResolvedValue(change({ status: "published" }));
    expect((await call("github_write_file", { path: "a.ts", content: "x", change_id: KEY, ...gated })).json.error).toMatch(/already published/);
    expect(runAdminTool).not.toHaveBeenCalled();
    expect(cs.markEdited).not.toHaveBeenCalled();
  });

  it("runs an allowed edit, marks the change edited and signs the commit message", async () => {
    const { call } = await connect(users.edit);
    const r = await call("github_write_file", { path: "src/app/about/page.tsx", content: "x", message: "Fix typo", change_id: `admin/mcp-${KEY}`, ...gated });
    expect(r.isError).toBeFalsy();
    expect(cs.markEdited).toHaveBeenCalled();
    expect(runAdminTool).toHaveBeenCalledWith("github_write_file", { path: "src/app/about/page.tsx", content: "x", message: "Fix typo [by Kim]" }, {});
  });

  it("publish passes the review token and the person", async () => {
    await (await connect(users.write)).call("publish_changes", { change_id: KEY, review_token: "tok", ...gated });
    expect(cs.publishChange).toHaveBeenCalledWith(KEY, "tok", users.write);
  });

  it("publish and discard need a change_id", async () => {
    const r = await (await connect(users.write)).call("discard_change", gated);
    expect(r.json.error).toMatch(/Say which change/);
    expect(cs.discardChange).not.toHaveBeenCalled();
  });

  it("start_change needs title, request and understood_as", async () => {
    const r = await (await connect(users.edit)).call("start_change", { title: "x", request: "y", ...gated });
    expect(r.json.error).toMatch(/understood_as/);
    expect(cs.createChangeSet).not.toHaveBeenCalled();
  });

  it("start_change with needs_confirmation tells the AI to stop and ask", async () => {
    vi.mocked(cs.createChangeSet).mockResolvedValue(change({ status: "awaiting_confirmation" }));
    const r = await (await connect(users.edit)).call("start_change", { title: "Fix typo", request: "fix it", understood_as: "Change teh to the on /about", needs_confirmation: true, ...gated });
    expect(r.json).toMatchObject({ view: "confirm", changeId: KEY, state: "awaiting_ok", youCanPublish: false, youCanDiscard: true });
    expect(r.json.next).toMatch(/^STOP: show the person exactly this/);
    expect(r._meta).toMatchObject({ rulesVersion: "rv-current" });
    expect(r.json.otherPendingNote).toMatch(/No other pending changes/);
  });

  it("request_upload_link refuses denied paths and unconfirmed changes, and signs a link otherwise", async () => {
    vi.stubEnv("MCP_OAUTH_SECRET", "s");
    const { call } = await connect(users.edit);
    expect((await call("request_upload_link", { path: "package.json", change_id: KEY, ...gated })).json.error).toMatch(/can't be changed from here/);
    vi.mocked(cs.getChangeSet).mockResolvedValue(change({ status: "awaiting_confirmation" }));
    expect((await call("request_upload_link", { path: "public/a.png", change_id: KEY, ...gated })).json.error).toMatch(/hasn't confirmed/);
    vi.mocked(cs.getChangeSet).mockResolvedValue(change());
    const ok = await call("request_upload_link", { path: "public/a.png", change_id: KEY, ...gated });
    expect(ok.json.uploadUrl).toMatch(/^https:\/\/tonygreenberg\.com\/api\/mcp\/upload\?t=tgmcp_up\./);
    vi.unstubAllEnvs();
  });

  it("unknown tools are refused", async () => {
    const r = await (await connect(users.write)).call("rm_rf", {});
    expect(r.isError).toBe(true);
  });
});
