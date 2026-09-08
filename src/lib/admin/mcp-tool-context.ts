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
  finalize: () => Promise<{ branch: string | null; prNumber: number | null; prUrl: string | null }>;
}

// Each MCP tool call is an independent HTTP request with no session state
// to lean on (this route runs on Netlify Functions, which guarantee no
// memory between invocations) — so instead of session state, every call
// resolves "the pending change" fresh by asking GitHub whether an MCP
// branch/PR is already open (single-operator assumption: only one edit in
// flight at a time). This also means the server needs no cookies or
// session store at all.
export async function buildMcpToolContext(): Promise<McpToolCallResult> {
  const defaultBranch = await gh.getDefaultBranch();
  const existing = await gh.findOpenAdminPR(ADMIN_BRANCH_PREFIX);
  let branch: string | null = existing?.branch ?? null;
  let prNumber: number | null = existing?.number ?? null;

  const auditLog: string[] = [];

  const ctx: AdminToolContext = {
    getReadBranch: () => branch ?? defaultBranch,
    ensureWriteBranch: async () => {
      if (branch) return branch;
      branch = newBranchName();
      await gh.createBranch(branch);
      auditLog.push(`Created branch ${branch}`);
      return branch;
    },
    getPRNumber: () => prNumber,
    log: (entry) => auditLog.push(entry),
  };

  return {
    ctx,
    auditLog,
    finalize: async () => {
      let prUrl: string | null = null;
      if (branch && !prNumber) {
        const pr = await gh.openPR(branch, "MCP: site edits", "Opened automatically via the code MCP server. Review the diff before merging.");
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
