import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import * as gh from "@/lib/admin/github-client";
import { ADMIN_BRANCH_PREFIX } from "@/lib/admin/guardrails";
import { ADMIN_TOOLS, runAdminTool, waitForChecks } from "@/lib/admin/tools";
import { buildMcpToolContext } from "@/lib/admin/mcp-tool-context";

const SESSION_TOOLS = [
  {
    name: "list_pending_changes",
    description:
      "Show the current pending change, if any: which files differ from the live site and the pull request's automatic check status. Call this before merge_changes. If checks are still running, this call itself waits up to ~20s before returning — if the result still comes back with checkStatus \"pending\" and a `note` field, just call this again rather than saying you'll wait or check back later.",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "merge_changes",
    description:
      "Merge the pending pull request into main (only if its automatic checks are passing) — Netlify auto-deploys main on every push, so this is what actually ships the change to the live site. Always call list_pending_changes first and confirm with the user what's about to go live before calling this.",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
];

const MCP_TOOLS = [...ADMIN_TOOLS, ...SESSION_TOOLS];

function toResult(output: unknown, isError = false) {
  return { content: [{ type: "text" as const, text: JSON.stringify(output, null, 2) }], isError };
}

async function listPendingChanges() {
  const existing = await gh.findOpenAdminPR(ADMIN_BRANCH_PREFIX);
  if (!existing) {
    return { branch: null, prNumber: null, prUrl: null, checkStatus: "unknown", failingChecks: [], files: [], canMerge: false };
  }

  const [compare, checks] = await Promise.all([gh.compareToDefaultBranch(existing.branch), waitForChecks(existing.number)]);

  return {
    branch: existing.branch,
    prNumber: existing.number,
    prUrl: `https://github.com/${gh.GITHUB_REPO.owner}/${gh.GITHUB_REPO.repo}/pull/${existing.number}`,
    previewUrl: checks.previewUrl,
    checkStatus: checks.status,
    ...(checks.note ? { note: checks.note } : {}),
    failingChecks: checks.failingChecks,
    files: compare.files,
    canMerge: compare.files.length > 0 && checks.status !== "failure" && checks.status !== "pending",
  };
}

async function mergeChanges() {
  const existing = await gh.findOpenAdminPR(ADMIN_BRANCH_PREFIX);
  if (!existing) return { error: "Nothing pending to merge" };

  const status = await gh.getPRCombinedStatus(existing.number);
  if (status === "failure") return { error: "The pull request's build checks are failing. Fix the issue before merging." };
  if (status === "pending") return { error: "The pull request's build checks are still running. Try again in a moment." };

  const merged = await gh.mergePR(existing.number);
  if (!merged.merged) return { error: "GitHub could not merge the pull request." };

  try {
    await gh.deleteBranch(existing.branch);
  } catch {
    // Branch may already be auto-deleted by GitHub's merge settings — not fatal.
  }

  return { ok: true, mergeSha: merged.sha, note: "Netlify will auto-deploy main now (see netlify.toml)." };
}

// Sent to every connecting client during the MCP handshake, per the MCP
// spec's `instructions` field — the one place a quality bar reaches every
// client equally, including a session with no access to this repo's real
// CONTRIBUTING.md/AGENTS.md. Deliberately doesn't restate those files'
// full rule set here (design tokens, page patterns, etc.) — that lives in
// exactly one place and drifts if duplicated. Read the real files instead.
const SERVER_INSTRUCTIONS = `This server lets you read and change the tonygreenberg.com Next.js site's code — nothing else. It has no Sanity content tools (that's a separate concern) and no admin dashboard.

Before writing or changing anything, read CONTRIBUTING.md and AGENTS.md (github_read_file) if you haven't already this session — they're the authoritative source for this project's real coding rules, design system, and page patterns (Next.js 16 breaking changes, Tailwind v4 canonical classes, no inline style outside components/ui, no framer-motion, Server Components by default, etc). Don't assume generic Next.js/React defaults where those files are specific.

Workflow: github_read_file before any edit. check_code_quality on new/changed .ts/.tsx content before github_write_file, and fix anything it flags. list_pending_changes to see the real diff and check status. check_pr_status (waits up to ~20s for checks) before telling the user something is ready. merge_changes only after confirming with the user what's about to go live — this is the ONLY way a change reaches the real site (Netlify auto-deploys main on push).

General bar for any change: responsive at every breakpoint, reuse existing components/classes/tokens before introducing new ones, real semantic HTML and accessible contrast, no new npm dependency without asking first, next/image for user-visible images, cover loading/empty/error states for anything dynamic, never write secrets into code or commit messages.`;

// One fresh Server per request (see mcp-handler.ts) — cheap to construct,
// and keeps this stateless like everything else this server touches.
export function createCodeMcpServer(): Server {
  const server = new Server(
    { name: "tonygreenberg-code", version: "1.0.0" },
    { capabilities: { tools: {} }, instructions: SERVER_INSTRUCTIONS },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: MCP_TOOLS.map((t) => ({ name: t.name, description: t.description, inputSchema: t.input_schema })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: rawArgs } = request.params;
    const input = (rawArgs ?? {}) as Record<string, unknown>;

    if (name === "list_pending_changes") return toResult(await listPendingChanges());
    if (name === "merge_changes") return toResult(await mergeChanges());
    if (!ADMIN_TOOLS.some((t) => t.name === name)) {
      return toResult({ error: `Unknown tool "${name}"` }, true);
    }

    const { ctx, auditLog, finalize } = await buildMcpToolContext();
    const result = await runAdminTool(name, input, ctx);
    const session = await finalize();

    // Only append session/audit info when THIS call actually did something
    // (ensureWriteBranch/log calls push into auditLog) — not just because
    // a branch happens to already be open from an earlier call, which is
    // true for most calls once any change is pending.
    const isPlainObject = result.output && typeof result.output === "object" && !Array.isArray(result.output);
    const output = isPlainObject && auditLog.length > 0 ? { ...(result.output as object), ...session, mcpAuditLog: auditLog } : result.output;

    return toResult(output, result.isError);
  });

  return server;
}
