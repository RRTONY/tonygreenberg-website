import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import * as gh from "@/lib/admin/github-client";
import { ADMIN_BRANCH_PREFIX } from "@/lib/admin/guardrails";
import { listPendingDrafts, publishDraft } from "@/lib/admin/sanity-content";
import { ADMIN_TOOLS, runAdminTool, waitForChecks } from "@/lib/admin/tools";
import { buildMcpToolContext } from "@/lib/admin/mcp-tool-context";
import { READ_ONLY_TOOLS, canUseTool, type McpUser } from "@/lib/admin/mcp-auth";
import {
  RULES_GATED_TOOLS,
  RULES_PATH,
  RULES_VERSION_PARAM,
  getProjectGuides,
  getProjectRules,
  listKnowledgeBase,
  rulesVersionError,
  withRulesVersionParam,
} from "@/lib/admin/project-rules";

// Ported from ramprate-ui's src/lib/admin/mcp-server.ts. Not ported: the MCP
// Apps status-card widget and ChatGPT-specific _meta (this server is
// token-auth only, for Claude Code/Desktop and the Claude.ai org connector).

const SESSION_TOOLS = [
  {
    name: "get_project_rules",
    description:
      "CALL THIS FIRST, before anything else in a conversation. Returns tonygreenberg.com's project rules — AGENTS.md first (the must-follow summary every AI tool reads, plus the Next.js 16 notice), then CONTRIBUTING.md (the full rules: Next.js 16 / Tailwind v4 / shadcn house rules, the Sanity content boundary, image rules, what's banned, review checklist, testing, Status Report) — a task guide (which kind of request goes where, what can't be done via this server, what needs a yes), a project structure map, the list of background notes in docs/ai/, and a rulesVersion. Every tool that changes the site or its content requires that rulesVersion as its rules_version argument and refuses to run without it. Read the rules fully and follow them for the rest of the conversation.",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "list_pending_changes",
    description:
      'Show the current pending change, if any: which files differ from the live site, the pull request\'s automatic check status (the Netlify deploy preview), the preview link, and any unpublished Sanity content drafts. Call this before publish_changes. If checks are still running, this call itself waits up to ~20s for them before returning — if the result still comes back with checkStatus "pending" and a `note` field, just call this again rather than telling the human you\'ll wait or check back later.',
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "publish_changes",
    description:
      "Go live: merge the pending pull request (only if its automatic checks are passing) and publish any pending Sanity drafts. This is the ONLY way anything reaches the real site. Always call list_pending_changes first and confirm with the human what's about to go live before calling this.",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
];

const MCP_TOOLS = [...ADMIN_TOOLS, ...SESSION_TOOLS];

function toResult(output: unknown, isError = false) {
  const isObject = !!output && typeof output === "object" && !Array.isArray(output);
  return {
    content: [{ type: "text" as const, text: JSON.stringify(output, null, 2) }],
    ...(isObject && !isError ? { structuredContent: output as Record<string, unknown> } : {}),
    isError,
  };
}

// Hints hosts use to decide when to ask the person to confirm before running
// a tool (read-only tools run straight away; changes get a prompt).
const DESTRUCTIVE_TOOLS = new Set(["github_delete_file", "publish_changes"]);
const OPEN_WORLD_TOOLS = new Set(["publish_changes"]);

function toolAnnotations(name: string) {
  const readOnly = READ_ONLY_TOOLS.has(name);
  return {
    title: name
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
    readOnlyHint: readOnly,
    destructiveHint: !readOnly && DESTRUCTIVE_TOOLS.has(name),
    openWorldHint: OPEN_WORLD_TOOLS.has(name),
  };
}

async function listPendingChanges() {
  const drafts = await listPendingDrafts();
  const existing = await gh.findOpenAdminPR(ADMIN_BRANCH_PREFIX);
  if (!existing) {
    return {
      branch: null,
      prNumber: null,
      prUrl: null,
      checkStatus: "unknown",
      failingChecks: [],
      files: [],
      drafts,
      canPublish: drafts.length > 0,
    };
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
    drafts,
    canPublish: (compare.files.length > 0 || drafts.length > 0) && checks.status !== "failure" && checks.status !== "pending",
  };
}

async function publishChanges() {
  const existing = await gh.findOpenAdminPR(ADMIN_BRANCH_PREFIX);
  const drafts = await listPendingDrafts();

  if (!existing && drafts.length === 0) {
    return { error: "Nothing pending to publish" };
  }

  let mergeSha: string | null = null;
  if (existing) {
    const status = await gh.getPRCombinedStatus(existing.number);
    if (status === "failure") {
      return { error: "The pull request's build checks are failing. Fix the issue before publishing." };
    }
    if (status === "pending") {
      return { error: "The pull request's build checks are still running. Try again in a moment." };
    }

    const merged = await gh.mergePR(existing.number);
    if (!merged.merged) {
      return { error: "GitHub could not merge the pull request." };
    }
    mergeSha = merged.sha;

    try {
      await gh.deleteBranch(existing.branch);
    } catch {
      // Branch may already be auto-deleted by GitHub's merge settings — not fatal.
    }
  }

  const publishedIds: string[] = [];
  for (const draft of drafts) {
    await publishDraft(draft.id);
    publishedIds.push(draft.publishedId);
  }

  return { ok: true, mergeSha, publishedIds };
}

// Sent during the MCP handshake as a system-prompt hint. The real rules live
// in the repo (AGENTS.md + CONTRIBUTING.md on the default branch), served by
// get_project_rules — not duplicated here, so they can't drift. Some clients
// ignore these instructions, which is why the write tools are also
// hard-gated on rules_version (see project-rules.ts).
const ADMIN_SERVER_INSTRUCTIONS = `This server lets you edit the tonygreenberg.com Next.js site's code and Sanity content.

STEP 1, EVERY CONVERSATION: call get_project_rules before anything else, read the rules it
returns in full (AGENTS.md first, then CONTRIBUTING.md), and follow them for the rest of the conversation. They override your defaults.
Every tool that changes the site or its content requires the rulesVersion it returns as the
rules_version argument, and refuses to run without it.

The rules cover, among other things:
- Next.js 16 (params are Promises, proxy.ts not middleware.ts), Server Components by default.
- Tailwind v4 + shadcn/ui only: no inline style={{}}, no framer-motion, next/image only.
- The content boundary: editorial copy/SEO/images in Sanity; quizzes, scoring and
  encyclopedia data in typed .ts modules in the repo.
- Zero Manus dependency: never add a Manus-hosted URL.
- Checks before calling anything done (check_code_quality on changed files, then
  check_pr_status and the Netlify preview link), and confirming with the person before
  publish_changes.

Background notes are in docs/ai/ (listed by get_project_rules). Read the relevant one with
github_read_file before changing that feature.`;

// Commit messages on the admin branch carry who asked for the change, so git
// history shows which team member did what (every commit is otherwise
// authored by the one GitHub token).
const ATTRIBUTED_MESSAGE_TOOLS = new Set(["github_write_file", "github_write_binary_file", "github_delete_file"]);

// One fresh Server per request (see mcp-handler.ts) — cheap to construct.
export function createAdminMcpServer(user: McpUser): Server {
  const server = new Server(
    { name: "tonygreenberg-admin", version: "1.0.0" },
    { capabilities: { tools: {} }, instructions: ADMIN_SERVER_INSTRUCTIONS },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: MCP_TOOLS.filter((t) => canUseTool(user.role, t.name)).map((t) => ({
      name: t.name,
      description: RULES_GATED_TOOLS.has(t.name) ? `${t.description} Requires ${RULES_VERSION_PARAM} from get_project_rules.` : t.description,
      inputSchema: RULES_GATED_TOOLS.has(t.name) ? withRulesVersionParam(t.input_schema) : t.input_schema,
      annotations: toolAnnotations(t.name),
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: rawArgs } = request.params;
    const { [RULES_VERSION_PARAM]: rulesVersion, ...input } = (rawArgs ?? {}) as Record<string, unknown>;

    console.log(`[mcp] ${user.name}${user.email ? ` <${user.email}>` : ""} (${user.role}) called ${name}`);
    if (!canUseTool(user.role, name)) {
      return toResult({ error: `${user.name}'s access level (${user.role}) doesn't allow ${name}.` }, true);
    }
    if (ATTRIBUTED_MESSAGE_TOOLS.has(name) && typeof input.message === "string" && user.name) {
      input.message = `${input.message} [by ${user.name}]`;
    }

    if (name === "get_project_rules") {
      const [rules, guides, knowledgeBase] = await Promise.all([
        getProjectRules(),
        getProjectGuides(),
        listKnowledgeBase().catch(() => []),
      ]);
      return toResult({
        rulesVersion: rules.version,
        you: {
          name: user.name,
          role: user.role,
          note:
            user.role === "read"
              ? "Look-only access: you can read, check and report, not change anything."
              : user.role === "edit"
                ? "You can prepare changes (they wait as pending), but a team member with write access must publish them."
                : "Full access, including publishing.",
        },
        howToUse: `Follow every rule below for the rest of this conversation. For each request, first use taskGuide to decide what kind of task it is, where it lives and whether it needs a yes, and projectStructure to find the files. Pass "${rules.version}" as ${RULES_VERSION_PARAM} on every tool that changes something. Before touching a feature, read its note from knowledgeBase with github_read_file.`,
        rules: rules.content,
        fullRules: rules.fullRules,
        taskGuide: guides.taskGuide,
        projectStructure: guides.projectStructure,
        knowledgeBase,
      });
    }

    if (RULES_GATED_TOOLS.has(name)) {
      let current: string;
      try {
        current = (await getProjectRules()).version;
      } catch (err) {
        return toResult(
          { error: `Could not load ${RULES_PATH} to check the rules version, so this change was not made: ${String(err)}` },
          true,
        );
      }
      const blocked = rulesVersionError(rulesVersion, current);
      if (blocked) return toResult({ error: blocked }, true);
    }

    if (name === "list_pending_changes") {
      const pending = await listPendingChanges();
      return toResult({ ...pending, youCanPublish: canUseTool(user.role, "publish_changes"), you: { name: user.name, role: user.role } });
    }
    if (name === "publish_changes") {
      return toResult(await publishChanges());
    }
    if (!ADMIN_TOOLS.some((t) => t.name === name)) {
      return toResult({ error: `Unknown tool "${name}"` }, true);
    }

    const { ctx, auditLog, finalize } = await buildMcpToolContext();
    const result = await runAdminTool(name, input, ctx);
    const session = await finalize();

    // Only append session/audit info when THIS call actually did something
    // (ensureWriteBranch/log calls push into auditLog). Never name this field
    // "log" — get_check_log_excerpt's own output has a `log` string, and a
    // same-named spread would silently clobber it (a real bug in ramprate-ui).
    const isPlainObject = result.output && typeof result.output === "object" && !Array.isArray(result.output);
    const output =
      isPlainObject && auditLog.length > 0 ? { ...(result.output as object), ...session, mcpAuditLog: auditLog } : result.output;

    return toResult(output, result.isError);
  });

  return server;
}
