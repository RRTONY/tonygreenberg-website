// ClickUp tasks for the MCP server's create/update/delete_clickup_task tools.
// Ported from ramprate-ui's src/lib/admin/clickup-client.ts (2026-10-16).
// Needs CLICKUP_API_TOKEN (a ClickUp personal token); without it every call
// stops with a plain "isn't set up" message instead of reaching ClickUp.
const CLICKUP_API_BASE = "https://api.clickup.com/api/v2";

const PRIORITY_MAP: Record<string, number> = {
  urgent: 1,
  high: 2,
  normal: 3,
  low: 4,
};

// Aliases so callers don't have to remember raw ClickUp list IDs. The
// tonygreenberg.com list lives in the shared "Technology & Web" space (same
// id ramprate-ui uses for it). A raw list ID still works as-is, since it
// won't match any alias.
export const CLICKUP_LIST_ALIASES: Record<string, string> = {
  "tonygreenberg.com": "901114763560",
};

const DEFAULT_LIST_ID = CLICKUP_LIST_ALIASES["tonygreenberg.com"];

export const CLICKUP_NOT_CONFIGURED =
  "ClickUp access isn't set up on the server (CLICKUP_API_TOKEN). Ask the webmaster.";

export function isClickupConfigured(): boolean {
  return Boolean(process.env.CLICKUP_API_TOKEN);
}

function resolveListId(listId?: string): string {
  if (!listId) return DEFAULT_LIST_ID;
  return CLICKUP_LIST_ALIASES[listId] ?? listId;
}

async function clickupFetch(path: string, init: RequestInit) {
  const token = process.env.CLICKUP_API_TOKEN;
  if (!token) throw new Error(CLICKUP_NOT_CONFIGURED);
  const res = await fetch(`${CLICKUP_API_BASE}${path}`, {
    ...init,
    headers: { Authorization: token, "Content-Type": "application/json" },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof data?.err === "string" ? data.err : `ClickUp API error (${res.status})`);
  }
  return data;
}

export interface ClickupTaskFields {
  name?: string;
  description?: string;
  priority?: "urgent" | "high" | "normal" | "low";
  dueDate?: string;
  status?: string;
}

export interface ClickupTaskResult {
  id: string;
  name: string;
  url: string;
  status: string;
}

function buildTaskBody(fields: ClickupTaskFields): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (fields.name !== undefined) body.name = fields.name;
  if (fields.description !== undefined) body.description = fields.description;
  if (fields.priority !== undefined && PRIORITY_MAP[fields.priority]) body.priority = PRIORITY_MAP[fields.priority];
  if (fields.status !== undefined) body.status = fields.status;
  if (fields.dueDate !== undefined) {
    const ms = Date.parse(fields.dueDate);
    if (!Number.isNaN(ms)) body.due_date = ms;
  }
  return body;
}

function toResult(data: Record<string, unknown>): ClickupTaskResult {
  const status = data.status as { status?: string } | undefined;
  return {
    id: String(data.id),
    name: String(data.name),
    url: String(data.url),
    status: status?.status ?? "",
  };
}

export async function createClickupTask(
  fields: ClickupTaskFields & { name: string; listId?: string },
): Promise<ClickupTaskResult> {
  const listId = resolveListId(fields.listId);
  const data = await clickupFetch(`/list/${encodeURIComponent(listId)}/task`, {
    method: "POST",
    body: JSON.stringify(buildTaskBody(fields)),
  });
  return toResult(data);
}

export async function updateClickupTask(taskId: string, fields: ClickupTaskFields): Promise<ClickupTaskResult> {
  const data = await clickupFetch(`/task/${encodeURIComponent(taskId)}`, {
    method: "PUT",
    body: JSON.stringify(buildTaskBody(fields)),
  });
  return toResult(data);
}

export async function deleteClickupTask(taskId: string): Promise<void> {
  await clickupFetch(`/task/${encodeURIComponent(taskId)}`, { method: "DELETE" });
}
