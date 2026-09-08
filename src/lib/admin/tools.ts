import * as gh from "@/lib/admin/github-client";
import { isPathDenied } from "@/lib/admin/guardrails";
import { checkCode } from "@/lib/admin/code-check";

// Tool schemas kept as plain objects (matching both the Anthropic Messages
// API's tool shape and, via a straight passthrough, the MCP SDK's
// inputSchema) — scoped to exactly what this server is for: code changes,
// code review, and deploy/checks status. No Sanity content tools, no
// analytics/SEO/email/task-tracker tools — this server is deliberately
// code-only; a separate on-site FauxTony chatbot (Phase 10) handles
// content questions for site visitors.
export const ADMIN_TOOLS = [
  {
    name: "github_list_dir",
    description: 'List files and subdirectories at a path in the repo, relative to repo root. Use an empty string for the repo root.',
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string", description: 'e.g. "src/app/about". Use "" (empty string) for the repo root — not "." or "/".' },
      },
      required: ["path"],
    },
  },
  {
    name: "github_read_file",
    description: "Read the current contents of a file in the repo. Always do this before editing a file.",
    input_schema: {
      type: "object" as const,
      properties: { path: { type: "string", description: "e.g. src/app/about/page.tsx" } },
      required: ["path"],
    },
  },
  {
    name: "github_write_file",
    description:
      "Create or update a file with new content. Committed to this session's own working branch — never to main directly. Pass the FULL new file content, not a diff. Call check_code_quality on the content first.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string" },
        content: { type: "string" },
        message: { type: "string", description: "Short commit message describing the change." },
      },
      required: ["path", "content", "message"],
    },
  },
  {
    name: "github_delete_file",
    description: "Delete a file. Committed to this session's own working branch — never to main directly.",
    input_schema: {
      type: "object" as const,
      properties: { path: { type: "string" }, message: { type: "string" } },
      required: ["path", "message"],
    },
  },
  {
    name: "github_write_binary_file",
    description: "Write a binary file (image, PDF, etc.) to the repo from base64 content. Committed to this session's own working branch, never to main directly.",
    input_schema: {
      type: "object" as const,
      properties: { path: { type: "string" }, base64Content: { type: "string" }, message: { type: "string" } },
      required: ["path", "base64Content", "message"],
    },
  },
  {
    name: "check_code_quality",
    description:
      "Check proposed file content BEFORE writing it: runs ESLint plus this repo's own house rules from CONTRIBUTING.md (no inline style outside components/ui, no raw <img>, no framer-motion, canonical Tailwind class names, write-client.ts server-only boundary). Always call this on .ts/.tsx content before github_write_file and fix anything it flags first.",
    input_schema: {
      type: "object" as const,
      properties: { path: { type: "string", description: "The file path this content is for, e.g. src/app/about/page.tsx" }, content: { type: "string" } },
      required: ["path", "content"],
    },
  },
  {
    name: "check_pr_status",
    description:
      "Check the real, current status of every automatic check on the pending change (Netlify's deploy-preview build, plus GitHub Actions checks if this repo ever adds any) — call this any time the user asks about a failing check or before saying something is ready to publish. If checks are still running, this call itself waits up to ~20s for them before returning — if the result still comes back with status \"pending\" and a `note` field, just call this again rather than saying you'll wait or check back later. Returns each check's name and pass/fail/running state, with a failed check's id (for get_check_log_excerpt) and a link.",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "get_check_log_excerpt",
    description: "Get the tail of the real log output for one failed GitHub Actions check, by its id from check_pr_status's failingChecks.",
    input_schema: {
      type: "object" as const,
      properties: { checkRunId: { type: "number", description: "The id field from a failingChecks entry." } },
      required: ["checkRunId"],
    },
  },
];

export interface AdminToolContext {
  getReadBranch: () => string;
  ensureWriteBranch: () => Promise<string>;
  getPRNumber: () => number | null;
  log: (entry: string) => void;
}

export interface ToolCallResult {
  output: unknown;
  isError?: boolean;
}

function denied(path: string): ToolCallResult {
  return { output: { error: `"${path}" is off-limits to this MCP server and cannot be read or modified.` }, isError: true };
}

// A connected model sometimes hands us a path that's been JSON-quoted
// (`""`, `"src/app"`), prefixed (`./`, `/`), or given a placeholder (`.`,
// `root`) for the repo root. Normalize all of it to a clean repo-relative
// path (`""` === root) before it reaches the GitHub API.
function normalizeRepoPath(raw: unknown): string {
  let p = String(raw ?? "").trim();
  while (p.length >= 2 && ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'")))) {
    p = p.slice(1, -1).trim();
  }
  p = p.replace(/^\.?\/+/, "").replace(/\/+$/, "");
  if (p === "." || p === "/" || p.toLowerCase() === "root") return "";
  return p;
}

function pathRequired(): ToolCallResult {
  return { output: { error: "A repo-relative file path is required." }, isError: true };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// A plain chat client (Claude Desktop, ChatGPT) has no way to "wait 60s and
// check again" on its own — it only acts on conversation turns. Doing the
// waiting here instead means a single call gives an honest, current
// answer: either it resolved within this window, or the result says so
// explicitly and the caller should call again.
const CHECK_WAIT_BUDGET_MS = 20_000;
const CHECK_POLL_INTERVAL_MS = 3_000;

export async function waitForChecks(prNumber: number): Promise<gh.PRChecksDetail & { note?: string }> {
  const start = Date.now();
  let detail = await gh.getPRChecksDetail(prNumber);
  while (detail.status === "pending" && Date.now() - start < CHECK_WAIT_BUDGET_MS) {
    await sleep(CHECK_POLL_INTERVAL_MS);
    detail = await gh.getPRChecksDetail(prNumber);
  }
  if (detail.status === "pending") {
    return { ...detail, note: `Still pending after waiting ~${Math.round((Date.now() - start) / 1000)}s. Call check_pr_status again.` };
  }
  return detail;
}

export async function runAdminTool(name: string, input: Record<string, unknown>, ctx: AdminToolContext): Promise<ToolCallResult> {
  switch (name) {
    case "github_list_dir": {
      const path = normalizeRepoPath(input.path);
      const entries = await gh.listDir(path, ctx.getReadBranch());
      return { output: entries };
    }

    case "github_read_file": {
      const path = normalizeRepoPath(input.path);
      if (!path) return pathRequired();
      if (isPathDenied(path)) return denied(path);
      const file = await gh.getFile(path, ctx.getReadBranch());
      if (!file) return { output: { error: `${path} does not exist` }, isError: true };
      return { output: { content: file.content } };
    }

    case "github_write_file": {
      const path = normalizeRepoPath(input.path);
      const content = String(input.content ?? "");
      const message = String(input.message ?? "MCP edit");
      if (!path) return pathRequired();
      if (isPathDenied(path)) return denied(path);
      const branch = await ctx.ensureWriteBranch();
      await gh.putFile(path, content, message, branch);
      ctx.log(`Wrote ${path} on ${branch}: ${message}`);
      return { output: { ok: true, path, branch } };
    }

    case "github_delete_file": {
      const path = normalizeRepoPath(input.path);
      const message = String(input.message ?? "MCP delete");
      if (!path) return pathRequired();
      if (isPathDenied(path)) return denied(path);
      const branch = await ctx.ensureWriteBranch();
      await gh.deleteFile(path, message, branch);
      ctx.log(`Deleted ${path} on ${branch}: ${message}`);
      return { output: { ok: true, path, branch } };
    }

    case "github_write_binary_file": {
      const path = normalizeRepoPath(input.path);
      const base64Content = String(input.base64Content ?? "");
      const message = String(input.message ?? "MCP binary upload");
      if (!path) return pathRequired();
      if (isPathDenied(path)) return denied(path);
      const branch = await ctx.ensureWriteBranch();
      await gh.putFileBase64(path, base64Content, message, branch);
      ctx.log(`Wrote binary file ${path} on ${branch}: ${message}`);
      return { output: { ok: true, path, branch } };
    }

    case "check_code_quality": {
      const path = normalizeRepoPath(input.path);
      const content = String(input.content ?? "");
      try {
        const result = await checkCode(path, content);
        return { output: result };
      } catch (err) {
        return { output: { error: err instanceof Error ? err.message : "Code check failed" }, isError: true };
      }
    }

    case "check_pr_status": {
      const prNumber = ctx.getPRNumber();
      if (!prNumber) {
        return { output: { status: "no_pending_change", message: "There's no pending change with checks running yet." } };
      }
      try {
        const detail = await waitForChecks(prNumber);
        return { output: detail };
      } catch (err) {
        return { output: { error: err instanceof Error ? err.message : "Failed to check status" }, isError: true };
      }
    }

    case "get_check_log_excerpt": {
      const checkRunId = Number(input.checkRunId);
      if (!Number.isFinite(checkRunId)) {
        return { output: { error: "A numeric checkRunId is required." }, isError: true };
      }
      try {
        const log = await gh.getFailingCheckLogExcerpt(checkRunId);
        return { output: { log } };
      } catch (err) {
        return { output: { error: err instanceof Error ? err.message : "Failed to fetch log" }, isError: true };
      }
    }

    default:
      return { output: { error: `Unknown tool "${name}"` }, isError: true };
  }
}
