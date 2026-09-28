import * as gh from "@/lib/admin/github-client";
import { isPathDenied, isPathReadDenied, isSanityTypeAllowed } from "@/lib/admin/guardrails";
// Read-only admin lookups, not a page render — sanityFetch()'s revalidation
// tags (CONTRIBUTING.md rule 9) don't apply to an ad-hoc GROQ query here.
import { client as sanityReadClient } from "@/lib/sanity/client";
import { createDraft, getDocumentForEditing, patchDraft } from "@/lib/admin/sanity-content";
import { checkPageSeo } from "@/lib/admin/seo-check";
import { checkCode } from "@/lib/admin/code-check";

// Core tool set ported from ramprate-ui's src/lib/admin/tools.ts: repo file
// tools (always on an admin/mcp-* branch, never the default branch), Sanity
// draft tools, and checks. ramprate's analytics/Search Console/Lighthouse/
// ClickUp/email/report tools are intentionally not ported.
// Plain JSON-schema objects, handed straight to the MCP SDK's tools/list.
export const ADMIN_TOOLS = [
  {
    name: "github_list_dir",
    description:
      "List files and subdirectories at a path in the repo, relative to repo root. Use an empty string for the repo root.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description:
            'e.g. "src/app/about". Use "" (empty string) for the repo root — do not pass quotes, "." or "/".',
        },
      },
      required: ["path"],
    },
  },
  {
    name: "github_read_file",
    description:
      "Read the current contents of a file in the repo. Always do this before editing a file.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string", description: "e.g. src/app/about/page.tsx" },
      },
      required: ["path"],
    },
  },
  {
    name: "github_write_file",
    description:
      "Create or update a file with new content. Committed to the pending change's working branch (admin/mcp-*), never the default branch directly. Pass the FULL new file content, not a diff.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string" },
        content: { type: "string" },
        message: {
          type: "string",
          description: "Short commit message describing the change.",
        },
      },
      required: ["path", "content", "message"],
    },
  },
  {
    name: "github_delete_file",
    description:
      "Delete a file. Committed to the pending change's working branch (admin/mcp-*), never the default branch directly.",
    input_schema: {
      type: "object" as const,
      properties: { path: { type: "string" }, message: { type: "string" } },
      required: ["path", "message"],
    },
  },
  {
    name: "github_write_binary_file",
    description:
      "Write a binary file to the repo from base64 content. Committed to the pending change's working branch, never the default branch. Content images belong in Sanity, not the repo — public/ is for site-chrome assets only (favicon, brand marks).",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string" },
        base64Content: { type: "string" },
        message: { type: "string" },
      },
      required: ["path", "base64Content", "message"],
    },
  },
  {
    name: "seo_check_page",
    description:
      "Fetch a live page on the deployed site and report its title, meta description, canonical URL, OG tags, H1s, and JSON-LD block count — a quick SEO health check. Checks the LIVE production site, not the working branch.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: { type: "string", description: "Site route, e.g. /growth or /" },
      },
      required: ["path"],
    },
  },
  {
    name: "check_code_quality",
    description:
      "Check proposed file content BEFORE writing it: runs ESLint and flags this project's house-rule violations from CONTRIBUTING.md (inline style={{}}, <img> instead of next/image, framer-motion, non-canonical Tailwind classes, Manus URLs, ellipsis loading text, write-client in a Client Component). Always call this on .ts/.tsx content before github_write_file, and fix anything it flags first.",
    input_schema: {
      type: "object" as const,
      properties: {
        path: {
          type: "string",
          description:
            "The file path this content is for, e.g. src/app/about/page.tsx",
        },
        content: { type: "string" },
      },
      required: ["path", "content"],
    },
  },
  {
    name: "check_pr_status",
    description:
      "Check the real, current status of every automatic check on the pending change (the Netlify deploy-preview build, plus any GitHub Actions checks) — call this any time the admin asks about a failing check, mentions an error or the workflow, or before telling them something is ready to publish. If checks are still running, this call itself waits up to ~20s for them to finish before returning — you do not need to (and cannot) wait on your own between calls. If the result still comes back with status \"pending\" and a `note` field, that means it's still running even after that wait — just call this tool again rather than telling the admin you'll 'wait' or 'check back'; there's no real timer on your side to do that with. Returns each check's name and whether it's passing, still running, or failed, with a failed check's id (for get_check_log_excerpt) and a link. ALL of these checks block Publish equally — none of them are cosmetic-only.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "get_check_log_excerpt",
    description:
      "Get the tail of the real log output for one failed check, by its id from check_pr_status's failingChecks. Use this to see the actual error (a type error, an ESLint rule, a build failure) instead of guessing — then fix the real file(s) that caused it.",
    input_schema: {
      type: "object" as const,
      properties: {
        checkRunId: {
          type: "number",
          description: "The id field from a failingChecks entry.",
        },
      },
      required: ["checkRunId"],
    },
  },
  {
    name: "sanity_query",
    description:
      "Run a read-only GROQ query against the live Sanity dataset to look up current content.",
    input_schema: {
      type: "object" as const,
      properties: { groq: { type: "string" } },
      required: ["groq"],
    },
  },
  {
    name: "sanity_get_document",
    description:
      "Get a Sanity document by its published id. Resolves to the in-progress draft if one exists.",
    input_schema: {
      type: "object" as const,
      properties: { id: { type: "string" } },
      required: ["id"],
    },
  },
  {
    name: "sanity_patch_document",
    description:
      "Patch fields on an existing Sanity document. Writes to a DRAFT only — the live document is untouched until the admin publishes.",
    input_schema: {
      type: "object" as const,
      properties: {
        id: { type: "string" },
        patch: {
          type: "object",
          description: "Fields to set on the document.",
          additionalProperties: true,
        },
      },
      required: ["id", "patch"],
    },
  },
  {
    name: "sanity_create_document",
    description:
      "Create a new Sanity document as a DRAFT — not live until the admin publishes.",
    input_schema: {
      type: "object" as const,
      properties: {
        docType: { type: "string", description: "Sanity document _type." },
        fields: {
          type: "object",
          description: "The new document's fields.",
          additionalProperties: true,
        },
      },
      required: ["docType", "fields"],
    },
  },
];

export interface AdminToolContext {
  getReadBranch: () => Promise<string>;
  ensureWriteBranch: () => Promise<string>;
  getPRNumber: () => Promise<number | null>;
  log: (entry: string) => void;
}

export interface ToolCallResult {
  output: unknown;
  isError?: boolean;
}

function denied(path: string): ToolCallResult {
  return {
    output: {
      error: `"${path}" is off-limits to the MCP agent and cannot be read or modified.`,
    },
    isError: true,
  };
}

// The model sometimes hands us a path that's been JSON-quoted (`""`,
// `"src/app"`), prefixed (`./`, `/`), or given a placeholder (`.`, `root`)
// for the repo root. Normalize all of it to a clean repo-relative path
// (`""` === root) before it reaches the GitHub API — a literal `""` was
// getting URL-encoded to `%22%22` and 404ing.
function normalizeRepoPath(raw: unknown): string {
  let p = String(raw ?? "").trim();
  while (
    p.length >= 2 &&
    ((p.startsWith('"') && p.endsWith('"')) ||
      (p.startsWith("'") && p.endsWith("'")))
  ) {
    p = p.slice(1, -1).trim();
  }
  p = p.replace(/^\.?\/+/, "").replace(/\/+$/, "");
  if (p === "." || p === "/" || p.toLowerCase() === "root") return "";
  return p;
}

function pathRequired(): ToolCallResult {
  return {
    output: { error: "A repo-relative file path is required." },
    isError: true,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// A plain chat client (Claude.ai, ChatGPT) has no way to "wait 60s and check
// again" on its own - it only acts on conversation turns, so asking it to
// wait produces either a stall or a claimed wait that never really
// happened. Doing the waiting here instead means a single call gives an
// honest, current answer: either it resolved within this window, or the
// result says so explicitly and the caller should call again - a real
// instruction instead of asking the model to fake a timer it doesn't have.
// Bounded well under Netlify's synchronous function timeout (worst case,
// free-tier: 10s; this repo's actual plan has handled longer single calls
// already, but there's no reason to push that margin for a status check).
const CHECK_WAIT_BUDGET_MS = 20_000;
const CHECK_POLL_INTERVAL_MS = 3_000;

export async function waitForChecks(
  prNumber: number,
): Promise<gh.PRChecksDetail & { note?: string }> {
  const start = Date.now();
  let detail = await gh.getPRChecksDetail(prNumber);
  while (
    detail.status === "pending" &&
    Date.now() - start < CHECK_WAIT_BUDGET_MS
  ) {
    await sleep(CHECK_POLL_INTERVAL_MS);
    detail = await gh.getPRChecksDetail(prNumber);
  }
  if (detail.status === "pending") {
    return {
      ...detail,
      note: `Still pending after waiting ~${Math.round((Date.now() - start) / 1000)}s. Call check_pr_status again.`,
    };
  }
  return detail;
}

export async function runAdminTool(
  name: string,
  input: Record<string, unknown>,
  ctx: AdminToolContext,
): Promise<ToolCallResult> {
  switch (name) {
    case "github_list_dir": {
      const path = normalizeRepoPath(input.path);
      const entries = await gh.listDir(path, await ctx.getReadBranch());
      return { output: entries };
    }

    case "github_read_file": {
      const path = normalizeRepoPath(input.path);
      if (!path) return pathRequired();
      if (isPathReadDenied(path)) return denied(path);
      const file = await gh.getFile(path, await ctx.getReadBranch());
      if (!file)
        return { output: { error: `${path} does not exist` }, isError: true };
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

    case "seo_check_page": {
      const path = String(input.path ?? "/");
      try {
        const result = await checkPageSeo(path);
        return { output: result };
      } catch (err) {
        return {
          output: {
            error: err instanceof Error ? err.message : "Fetch failed",
          },
          isError: true,
        };
      }
    }

    case "check_code_quality": {
      const path = normalizeRepoPath(input.path);
      const content = String(input.content ?? "");
      try {
        const result = await checkCode(path, content);
        return { output: result };
      } catch (err) {
        return {
          output: {
            error: err instanceof Error ? err.message : "Code check failed",
          },
          isError: true,
        };
      }
    }

    case "check_pr_status": {
      const prNumber = await ctx.getPRNumber();
      if (!prNumber) {
        return {
          output: {
            status: "no_pending_change",
            message: "There's no pending change with checks running yet.",
          },
        };
      }
      try {
        const detail = await waitForChecks(prNumber);
        return { output: detail };
      } catch (err) {
        return {
          output: {
            error:
              err instanceof Error ? err.message : "Failed to check status",
          },
          isError: true,
        };
      }
    }

    case "get_check_log_excerpt": {
      const checkRunId = Number(input.checkRunId);
      if (!Number.isFinite(checkRunId)) {
        return {
          output: { error: "A numeric checkRunId is required." },
          isError: true,
        };
      }
      try {
        const log = await gh.getFailingCheckLogExcerpt(checkRunId);
        return { output: { log } };
      } catch (err) {
        return {
          output: {
            error: err instanceof Error ? err.message : "Failed to fetch log",
          },
          isError: true,
        };
      }
    }

    case "sanity_query": {
      const groq = String(input.groq ?? "");
      const result = await sanityReadClient.fetch(groq);
      return { output: result };
    }

    case "sanity_get_document": {
      const id = String(input.id ?? "");
      const doc = await getDocumentForEditing(id);
      if (!doc)
        return {
          output: { error: `No document found for ${id}` },
          isError: true,
        };
      return { output: doc };
    }

    case "sanity_patch_document": {
      const id = String(input.id ?? "");
      const patch = (input.patch ?? {}) as Record<string, unknown>;
      const current = await getDocumentForEditing(id);
      if (!current)
        return {
          output: { error: `No document found for ${id}` },
          isError: true,
        };
      const currentType = (current as { _type?: string })._type ?? "";
      if (!isSanityTypeAllowed(currentType)) {
        return {
          output: {
            error: `"${currentType}" documents are not editable by the MCP agent`,
          },
          isError: true,
        };
      }
      await patchDraft(id, patch);
      ctx.log(`Patched Sanity draft for ${id}`);
      return { output: { ok: true, id } };
    }

    case "sanity_create_document": {
      const docType = String(input.docType ?? "");
      const fields = (input.fields ?? {}) as Record<string, unknown>;
      if (!isSanityTypeAllowed(docType)) {
        return {
          output: {
            error: `"${docType}" is not in the admin-editable type allowlist`,
          },
          isError: true,
        };
      }
      const created = await createDraft(docType, fields);
      ctx.log(`Created Sanity draft ${created._id} (${docType})`);
      return { output: { ok: true, id: created._id } };
    }

    default:
      return { output: { error: `Unknown tool "${name}"` }, isError: true };
  }
}
