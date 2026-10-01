import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import * as gh from "@/lib/admin/github-client";
import { ADMIN_TOOLS, runAdminTool } from "@/lib/admin/tools";
import {
  buildReview,
  changeHistory,
  createChangeSet,
  discardChange,
  getChangeSet,
  isOpen,
  listOpenChangeSets,
  markEdited,
  pendingOverview,
  publishChange,
  reconcileWithGitHub,
  submitForReview,
  undoChange,
  type ChangeSet,
} from "@/lib/admin/change-sets";
import { describeFiles, normalizeChangeKey } from "@/lib/admin/change-describe";
import { captureDevices, previewTarget } from "@/lib/admin/device-preview";
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

// Ported from ramprate-ui's src/lib/admin/mcp-server.ts, including its
// per-request change sets (2026-10-02): every request is its own change with
// its own branch, PR and Sanity drafts, which can be reviewed (plain summary,
// pages affected, before/after), published with a review token, discarded,
// undone, and is kept in a change history. Not ported: the MCP Apps review
// card and ChatGPT-specific _meta (the device screenshots are returned as
// plain MCP image blocks instead), and check_deploy (it would need a Netlify
// account token in Netlify's own settings). Sign-in is a personal token or
// OAuth (mcp-oauth.ts) for Claude.ai, Desktop and ChatGPT.

const CHANGE_ID_PARAM = "change_id";

const changeIdSchema = (description: string) => ({ type: "string", description });

const SESSION_TOOLS = [
  {
    name: "get_project_rules",
    description:
      "CALL THIS FIRST, before anything else in a conversation. Returns tonygreenberg.com's project rules — AGENTS.md first (the must-follow summary every AI tool reads, plus the Next.js 16 notice), then CONTRIBUTING.md (the full rules: Next.js 16 / Tailwind v4 / shadcn house rules, the Sanity content boundary, image rules, what's banned, review checklist, testing, Status Report) — a task guide (which kind of request goes where, what can't be done via this server, what needs a yes), a project structure map, the list of background notes in docs/ai/, and a rulesVersion. Every tool that changes the site or its content requires that rulesVersion as its rules_version argument and refuses to run without it. Read the rules fully and follow them for the rest of the conversation.",
    input_schema: { type: "object" as const, properties: {}, required: [] },
  },
  {
    name: "start_change",
    description:
      "Start a new, separate change for ONE request from the person (e.g. 'change the homepage headline'). Returns a change_id. Every edit for this request (github_write_file, github_write_binary_file, github_delete_file, sanity_patch_document, sanity_create_document) must pass this change_id, so each request is kept apart and publishing it never takes any other request live. Start a new change for each new request; keep using the same change_id for follow-up tweaks to the same request.",
    input_schema: {
      type: "object" as const,
      properties: {
        title: { type: "string", description: "Short plain-English name, e.g. 'New homepage headline'." },
        request: { type: "string", description: "What the person asked for, in their words." },
      },
      required: ["title", "request"],
    },
  },
  {
    name: "submit_for_review",
    description:
      "Call when the edits for a change are finished and checked. Saves a plain-English summary and marks the change 'Ready for review'; only then can it be published. Any later edit to the change sends it back to Draft, so submit again after more edits. Then call list_pending_changes with the same change_id to show the person the review.",
    input_schema: {
      type: "object" as const,
      properties: {
        [CHANGE_ID_PARAM]: changeIdSchema("The change_id from start_change."),
        summary: {
          type: "string",
          description:
            "1 to 3 plain sentences for a non-technical owner: what changed and where, e.g. 'Changed the homepage headline. No other pages were touched.' No jargon, no em dashes.",
        },
        before_after: {
          type: "array",
          description:
            "For visible wording or image changes made in code: what the visitor saw before and will see after. Content (Sanity) edits get this automatically, don't repeat them.",
          items: {
            type: "object",
            properties: {
              label: { type: "string", description: "e.g. 'Homepage headline'" },
              before: { type: "string" },
              after: { type: "string" },
            },
            required: ["label", "before", "after"],
          },
        },
      },
      required: [CHANGE_ID_PARAM, "summary"],
    },
  },
  {
    name: "list_pending_changes",
    description:
      'Show waiting changes. With a change_id: the full review for that one change (what will go live in plain words, pages affected with preview links, before and after, the site check, and its reviewToken). Without one: a list of all waiting changes, plus older waiting work and unrelated Sanity Studio drafts that will NOT be published. Always show the person this review before publishing. If checks are still running this call waits up to ~20s; if checkStatus is still "pending", just call it again (you have no timer to wait with).',
    input_schema: {
      type: "object" as const,
      properties: { [CHANGE_ID_PARAM]: changeIdSchema("Optional: the change to review.") },
      required: [],
    },
  },
  {
    name: "publish_changes",
    description:
      "Go live with ONE reviewed change: publishes only that change's code and content, nothing else. Needs the change_id and the reviewToken from list_pending_changes for that change; refuses if anything changed since that review, if the site check isn't passing, or if the change isn't 'Ready for review'. Before calling, show the person exactly what will go live (the review's facts line and before/after) and ask: 'You are about to publish these changes to the live tonygreenberg.com website. Are you sure you want to continue?' Call it only after a clear yes.",
    input_schema: {
      type: "object" as const,
      properties: {
        [CHANGE_ID_PARAM]: changeIdSchema("The change to publish."),
        review_token: { type: "string", description: "The reviewToken from list_pending_changes for this change." },
      },
      required: [CHANGE_ID_PARAM, "review_token"],
    },
  },
  {
    name: "discard_change",
    description:
      "Reject a waiting change completely: its code edits and content drafts are thrown away and nothing goes live. Use when the person doesn't want it. It stays in the change history as Discarded. Also works for older waiting changes listed under olderChanges. Confirm with the person first.",
    input_schema: {
      type: "object" as const,
      properties: { [CHANGE_ID_PARAM]: changeIdSchema("The change to discard.") },
      required: [CHANGE_ID_PARAM],
    },
  },
  {
    name: "list_change_history",
    description:
      "History of website changes made through this server, newest first: when, who asked, what was changed, a summary, and whether it was published, discarded, or undone. Use canUndo and undo_change to restore the previous version of a published change.",
    input_schema: {
      type: "object" as const,
      properties: { limit: { type: "number", description: "How many (default 20, max 100)." } },
      required: [],
    },
  },
  {
    name: "preview_on_devices",
    description:
      "Show how a change's preview looks on a phone and on a laptop: real screenshots of the top of the page, returned as two images. Use after list_pending_changes whenever the change affects layout, images, buttons or anything visual, so the person can check both sizes before publishing. Needs the change's preview to be built (site check passed) and GOOGLE_API_KEY on the server. The first try on a page can take a while; if it says to try again, call it once more (Google caches the page, so the second try is quick).",
    input_schema: {
      type: "object" as const,
      properties: {
        [CHANGE_ID_PARAM]: changeIdSchema("The change to preview."),
        path: {
          type: "string",
          description: "Page address to show, e.g. '/' or '/about'. Defaults to the first page the change affects.",
        },
      },
      required: [CHANGE_ID_PARAM],
    },
  },
  {
    name: "undo_change",
    description:
      "Restore what the site looked like before a PUBLISHED change (from list_change_history). Creates a new waiting change called 'Undo: ...' that puts the old files and content back; it goes live only after the person reviews and publishes it like any other change. Refuses if the same pages or content were changed again afterwards, so later work isn't wiped out.",
    input_schema: {
      type: "object" as const,
      properties: { [CHANGE_ID_PARAM]: changeIdSchema("The published change to undo.") },
      required: [CHANGE_ID_PARAM],
    },
  },
];

// Edits must name their change (see start_change); reads may, to see that
// change's version of a file instead of the live one.
const CHANGE_REQUIRED_TOOLS = new Set([
  "github_write_file",
  "github_write_binary_file",
  "github_delete_file",
  "sanity_patch_document",
  "sanity_create_document",
]);
const CHANGE_ACTION_TOOLS = new Set(["submit_for_review", "publish_changes", "discard_change", "undo_change"]);
const CHANGE_OPTIONAL_TOOLS = new Set(["github_read_file", "github_list_dir", "check_pr_status", "get_check_log_excerpt"]);

interface ToolSchema {
  type: "object";
  properties: Record<string, unknown>;
  required?: string[];
}

function withChangeIdParam(name: string, schema: ToolSchema): ToolSchema {
  if (CHANGE_REQUIRED_TOOLS.has(name)) {
    return {
      ...schema,
      properties: {
        ...schema.properties,
        [CHANGE_ID_PARAM]: changeIdSchema("The change_id from start_change for the request this edit belongs to."),
      },
      required: [...(schema.required ?? []), CHANGE_ID_PARAM],
    };
  }
  if (CHANGE_OPTIONAL_TOOLS.has(name)) {
    return {
      ...schema,
      properties: {
        ...schema.properties,
        [CHANGE_ID_PARAM]: changeIdSchema("Optional: read/check this change's version instead of the live site."),
      },
    };
  }
  return schema;
}

const MCP_TOOLS = [...ADMIN_TOOLS, ...SESSION_TOOLS];

function toResult(output: unknown, isError = false) {
  const isObject = !!output && typeof output === "object" && !Array.isArray(output);
  return {
    content: [{ type: "text" as const, text: JSON.stringify(output, null, 2) }],
    ...(isObject && !isError ? { structuredContent: output as Record<string, unknown> } : {}),
    isError,
  };
}

function fromChangeResult<T extends { ok: boolean }>(result: T) {
  return toResult(result, !result.ok);
}

// Hints hosts use to decide when to ask the person to confirm before running
// a tool (read-only tools run straight away; changes get a prompt).
const DESTRUCTIVE_TOOLS = new Set(["github_delete_file", "publish_changes", "discard_change"]);
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

async function listPendingChanges(changeKey: string | null) {
  const open = await reconcileWithGitHub(await listOpenChangeSets());
  const overview = await pendingOverview(open);
  const target = changeKey
    ? await getChangeSet(changeKey)
    : open.length === 1 && overview.olderChanges.length === 0
      ? open[0]
      : null;

  if (changeKey && !target) {
    return { view: "list" as const, error: `No change found with id ${changeKey}.`, ...overview };
  }
  if (!target) return { view: "list" as const, ...overview };

  const others = open.filter((c) => c.key !== target.key).length + overview.olderChanges.length;
  const review = await buildReview(target, others);
  return {
    view: "detail" as const,
    ...review,
    otherWaiting: overview.changes.filter((c) => c.changeId !== target.key),
    olderChanges: overview.olderChanges,
    unrelatedDrafts: overview.unrelatedDrafts,
  };
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

STEP 2, EVERY REQUEST: one request = one change. Call start_change, pass its change_id on
every edit, then submit_for_review with a plain summary, then list_pending_changes with that
change_id to show the review. The person then publishes or discards THAT change only, after
you show what goes live and they confirm. list_change_history and undo_change restore an
earlier version.

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
    { name: "tonygreenberg-admin", version: "1.1.0" },
    { capabilities: { tools: {} }, instructions: ADMIN_SERVER_INSTRUCTIONS },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: MCP_TOOLS.filter((t) => canUseTool(user.role, t.name)).map((t) => {
      const schema = withChangeIdParam(t.name, t.input_schema as ToolSchema);
      return {
        name: t.name,
        description: RULES_GATED_TOOLS.has(t.name) ? `${t.description} Requires ${RULES_VERSION_PARAM} from get_project_rules.` : t.description,
        inputSchema: RULES_GATED_TOOLS.has(t.name) ? withRulesVersionParam(schema) : schema,
        annotations: toolAnnotations(t.name),
      };
    }),
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
                ? "You can prepare changes (they wait as pending) and discard them, but a team member with write access must publish them."
                : "Full access, including publishing.",
        },
        howToUse: `Follow every rule below for the rest of this conversation. One request = one change: start_change, pass its change_id on every edit, submit_for_review with a plain summary, then list_pending_changes with that change_id so the person sees exactly what will go live and can publish or discard it (publish needs their clear yes). Read migrationStatus (the status block of NEXTJS-MIGRATION-TODO.md, the main project file) to see what's done, open and waiting on a decision. For each request, first use taskGuide to decide what kind of task it is, where it lives and whether it needs a yes, and projectStructure to find the files. Pass "${rules.version}" as ${RULES_VERSION_PARAM} on every tool that changes something. Before touching a feature, read its note from knowledgeBase with github_read_file.`,
        rules: rules.content,
        fullRules: rules.fullRules,
        taskGuide: guides.taskGuide,
        projectStructure: guides.projectStructure,
        migrationStatus: guides.migrationStatus,
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

    const rawChangeId = input[CHANGE_ID_PARAM];
    delete input[CHANGE_ID_PARAM];
    const changeKey = rawChangeId === undefined || rawChangeId === "" ? null : normalizeChangeKey(rawChangeId);
    if (rawChangeId !== undefined && rawChangeId !== "" && !changeKey) {
      return toResult({ error: `"${String(rawChangeId)}" isn't a valid change_id. Use the one start_change returned.` }, true);
    }

    if (name === "start_change") {
      const title = String(input.title ?? "").trim();
      const request = String(input.request ?? "").trim();
      if (!title || !request) {
        return toResult({ error: "A title and the person's request are both required." }, true);
      }
      const change = await createChangeSet({ title, request, user });
      return toResult({
        change_id: change.key,
        status: "Draft",
        next: `Pass change_id "${change.key}" on every edit for this request. When done, call submit_for_review, then list_pending_changes with this change_id.`,
      });
    }

    if (name === "preview_on_devices") {
      if (!changeKey) return toResult({ error: "Say which change: pass its change_id." }, true);
      const target = await getChangeSet(changeKey);
      if (!target) return toResult({ error: `No change found with id ${changeKey}.` }, true);
      if (!target.prNumber || !isOpen(target)) {
        return toResult(
          {
            error: target.prNumber
              ? "This change is no longer waiting, so its preview is gone. Look at the live site instead."
              : "This change has no code edits, so there is no preview site to show. Content edits appear on the live site once published.",
          },
          true,
        );
      }
      if (!process.env.GOOGLE_API_KEY) {
        return toResult(
          { error: "Phone and laptop screenshots need GOOGLE_API_KEY on the server. Ask the webmaster; meanwhile open the preview links on a phone." },
          true,
        );
      }
      const { previewUrl } = await gh.getPRChecksDetail(target.prNumber);
      const defaultPath = describeFiles((target.files ?? []).map((f) => f.path)).find((a) => a.route)?.route ?? "/";
      const url = previewTarget(previewUrl, input.path ?? defaultPath);
      if (!url) {
        return toResult(
          {
            error: previewUrl
              ? "That page address isn't valid. Use something like '/' or '/about'."
              : "The preview isn't built yet. Check list_pending_changes until the site check passes, then try again.",
          },
          true,
        );
      }
      const shots = await captureDevices(url);
      const summary = {
        view: "devices",
        changeId: target.key,
        title: target.title,
        page: new URL(url).pathname,
        url,
        shots: shots.map((s) => ({ device: s.device, ok: !!s.image, ...(s.error ? { error: s.error } : {}) })),
        note: shots.every((s) => s.image)
          ? "Phone (first image) and laptop (second image) screenshots of the top of the page."
          : "Some screenshots didn't load. Call preview_on_devices again in a few seconds.",
      };
      // Plain MCP image blocks: Claude and ChatGPT show them in the chat.
      const images = shots.flatMap((s) => {
        const m = s.image?.match(/^data:(image\/[a-z]+);base64,(.+)$/);
        return m ? [{ type: "image" as const, mimeType: m[1], data: m[2] }] : [];
      });
      const base = toResult(summary);
      return { ...base, content: [...base.content, ...images] };
    }

    if (name === "list_change_history") {
      const limit = Number(input.limit ?? 20);
      return toResult({ history: await changeHistory(Number.isFinite(limit) ? limit : 20) });
    }

    if (name === "list_pending_changes") {
      const pending = await listPendingChanges(changeKey);
      return toResult({
        ...pending,
        youCanPublish: canUseTool(user.role, "publish_changes"),
        youCanDiscard: canUseTool(user.role, "discard_change"),
        you: { name: user.name, role: user.role },
      });
    }

    if ((CHANGE_REQUIRED_TOOLS.has(name) || CHANGE_ACTION_TOOLS.has(name)) && !changeKey) {
      return toResult(
        {
          error:
            name === "publish_changes" || name === "discard_change" || name === "undo_change"
              ? "Say which change: pass its change_id (see list_pending_changes or list_change_history)."
              : "Every edit must belong to a change. Call start_change for this request first and pass its change_id.",
        },
        true,
      );
    }

    if (name === "publish_changes") {
      return fromChangeResult(await publishChange(changeKey!, String(input.review_token ?? ""), user));
    }
    if (name === "discard_change") {
      return fromChangeResult(await discardChange(changeKey!, user));
    }
    if (name === "undo_change") {
      const result = await undoChange(changeKey!, user);
      return fromChangeResult(
        result.ok
          ? {
              ...result,
              next: `Created "${result.title}". Show it with list_pending_changes and change_id "${result.changeId}"; it goes live only if the person publishes it.`,
            }
          : result,
      );
    }

    let change: ChangeSet | null = null;
    if (changeKey) {
      change = await getChangeSet(changeKey);
      if (!change) {
        return toResult({ error: `No change found with id ${changeKey}. Call start_change for a new request.` }, true);
      }
    }

    if (name === "submit_for_review") {
      const summary = String(input.summary ?? "").trim();
      if (!summary) return toResult({ error: "A plain-English summary is required." }, true);
      const beforeAfter = Array.isArray(input.before_after)
        ? (input.before_after as Array<Record<string, unknown>>)
            .filter((b) => b && typeof b === "object")
            .map((b) => ({ label: String(b.label ?? ""), before: String(b.before ?? ""), after: String(b.after ?? "") }))
        : [];
      const result = await submitForReview(change!, summary, beforeAfter);
      return fromChangeResult(
        result.ok
          ? { ...result, next: `Now call list_pending_changes with change_id "${change!.key}" to show the person the review.` }
          : result,
      );
    }

    if (!ADMIN_TOOLS.some((t) => t.name === name)) {
      return toResult({ error: `Unknown tool "${name}"` }, true);
    }

    if (CHANGE_REQUIRED_TOOLS.has(name)) {
      if (!isOpen(change!)) {
        return toResult(
          { error: `Change ${change!.key} is already ${change!.status.replace(/_/g, " ")}. Call start_change for a new request.` },
          true,
        );
      }
      await markEdited(change!);
    }

    const { ctx, auditLog, finalize } = await buildMcpToolContext(change);
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
