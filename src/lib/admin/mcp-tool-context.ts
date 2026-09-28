import * as gh from "@/lib/admin/github-client";
import { ADMIN_BRANCH_PREFIX } from "@/lib/admin/guardrails";
import type { AdminToolContext } from "@/lib/admin/tools";

function newBranchName(): string {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${ADMIN_BRANCH_PREFIX}${stamp}-${suffix}`;
}

export interface McpToolCallResult {
  ctx: AdminToolContext;
  auditLog: string[];
  // Opens the PR the moment a branch has its first commit (GitHub rejects a
  // PR with no diff from base, so this can't happen any earlier than that),
  // and reports the branch/PR this call ended up on either way. Call once,
  // after running the tool. Without this, a later independent tool call —
  // which resolves "the pending change" via findOpenAdminPR, see below —
  // would never find this branch, and every write would silently start a
  // new orphan branch of its own.
  finalize: () => Promise<{
    branch: string | null;
    prNumber: number | null;
    prUrl: string | null;
  }>;
}

// Each MCP tool call is an independent HTTP request, and Netlify Functions
// guarantee no memory between invocations — so instead of session state,
// every call resolves "the pending change" fresh by asking GitHub whether an
// admin branch/PR is already open (single-operator assumption: only one edit
// in flight at a time). No cookies or session store needed.
// GitHub is only asked about the pending branch/PR the first time a tool
// actually needs it — Sanity, SEO and code-check tools never touch GitHub, so
// they keep working without GITHUB_TOKEN (or during a GitHub outage).
export async function buildMcpToolContext(): Promise<McpToolCallResult> {
  let resolved: Promise<void> | null = null;
  let defaultBranch = "";
  let branch: string | null = null;
  let prNumber: number | null = null;
  const resolve = () =>
    (resolved ??= (async () => {
      const [base, existing] = await Promise.all([gh.getDefaultBranch(), gh.findOpenAdminPR(ADMIN_BRANCH_PREFIX)]);
      defaultBranch = base;
      branch = existing?.branch ?? null;
      prNumber = existing?.number ?? null;
    })());

  const auditLog: string[] = [];

  const ctx: AdminToolContext = {
    getReadBranch: async () => {
      await resolve();
      return branch ?? defaultBranch;
    },
    ensureWriteBranch: async () => {
      await resolve();
      if (branch) return branch;
      branch = newBranchName();
      await gh.createBranch(branch);
      auditLog.push(`Created branch ${branch}`);
      return branch;
    },
    getPRNumber: async () => {
      await resolve();
      return prNumber;
    },
    log: (entry) => auditLog.push(entry),
  };

  return {
    ctx,
    auditLog,
    finalize: async () => {
      if (!resolved) return { branch: null, prNumber: null, prUrl: null };
      await resolved;
      let prUrl: string | null = null;
      if (branch && !prNumber) {
        const pr = await gh.openPR(
          branch,
          "MCP: site edits",
          "Opened automatically via the tonygreenberg.com MCP server. Review the diff and the Netlify deploy preview before publishing.",
        );
        prNumber = pr.number;
        prUrl = pr.url;
        auditLog.push(`Opened PR #${pr.number}`);
      } else if (prNumber) {
        prUrl = `https://github.com/${gh.GITHUB_REPO.owner}/${gh.GITHUB_REPO.repo}/pull/${prNumber}`;
      }
      return { branch, prNumber, prUrl };
    },
  };
}
