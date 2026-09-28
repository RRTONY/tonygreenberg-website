import { timingSafeEqual } from "crypto";

// MCP clients (Claude Code, Claude Desktop, the Claude.ai org connector) are
// apps, not a browser session, so auth here is a personal bearer token.
// Ported from ramprate-ui's mcp-auth.ts minus its OAuth sign-in (email +
// password flow) — this server is token-only for now.
//
// MCP_ADMIN_USERS is a JSON array, one entry per person:
//   [{"name":"Jane Doe","email":"jane@example.com","role":"write","token":"<openssl rand -hex 32>"}]
// Roles: "read" (look only), "edit" (make pending changes, but not publish),
// "write" (everything). "admin" is accepted as "write". Only people on this
// list can use the server; removing someone is one env var edit + redeploy.

export type McpRole = "read" | "edit" | "write";

export interface McpUser {
  name: string;
  email: string;
  role: McpRole;
}

interface McpUserEntry extends McpUser {
  token: string;
}

// Personal tokens must be long random secrets, not something guessable.
const MIN_TOKEN_LENGTH = 32;

function normalizeRole(role: unknown): McpRole | null {
  if (role === "read" || role === "edit" || role === "write") return role;
  if (role === "admin") return "write";
  return null;
}

export function parseMcpUsers(raw: string | undefined): McpUserEntry[] {
  if (!raw || !raw.trim()) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error("MCP_ADMIN_USERS is not valid JSON - no personal tokens loaded");
    return [];
  }
  if (!Array.isArray(parsed)) {
    console.error("MCP_ADMIN_USERS must be a JSON array - no personal tokens loaded");
    return [];
  }
  const users: McpUserEntry[] = [];
  parsed.forEach((entry, i) => {
    const e = entry as Record<string, unknown>;
    const role = normalizeRole(e?.role);
    const token = typeof e?.token === "string" ? e.token.trim() : "";
    const name = typeof e?.name === "string" ? e.name.trim() : "";
    const email = typeof e?.email === "string" ? e.email.trim() : "";
    if (!name || !role || token.length < MIN_TOKEN_LENGTH) {
      console.error(
        `MCP_ADMIN_USERS entry ${i} skipped: needs name, a role of read/edit/write, and a token of at least ${MIN_TOKEN_LENGTH} characters`,
      );
      return;
    }
    users.push({ name, email, role, token });
  });
  return users;
}

function tokensMatch(candidate: string, expected: string): boolean {
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function isMcpAuthConfigured(): boolean {
  return parseMcpUsers(process.env.MCP_ADMIN_USERS).length > 0;
}

export function authenticateMcpToken(candidate: string | null | undefined): McpUser | null {
  const token = (candidate ?? "").trim();
  if (!token) return null;

  const users = parseMcpUsers(process.env.MCP_ADMIN_USERS);
  // Check every entry (no early exit) so response time doesn't reveal which
  // position in the list matched.
  let match: McpUserEntry | null = null;
  for (const user of users) {
    if (tokensMatch(token, user.token) && !match) match = user;
  }
  return match ? { name: match.name, email: match.email, role: match.role } : null;
}

export function bearerFromRequest(req: Request): string {
  const header = req.headers.get("authorization") ?? "";
  return header.startsWith("Bearer ") ? header.slice(7).trim() : "";
}

// What each role may call. Anything not listed as read-only needs at least
// "edit", and WRITE_ONLY_TOOLS need "write" — so a newly added tool is never
// accidentally open to read-only users.
export const READ_ONLY_TOOLS = new Set([
  "get_project_rules",
  "list_pending_changes",
  "github_list_dir",
  "github_read_file",
  "seo_check_page",
  "check_code_quality",
  "check_pr_status",
  "get_check_log_excerpt",
  "sanity_query",
  "sanity_get_document",
]);

// Go live: "write" only.
export const WRITE_ONLY_TOOLS = new Set(["publish_changes"]);

export function canUseTool(role: McpRole, tool: string): boolean {
  if (READ_ONLY_TOOLS.has(tool)) return true;
  if (role === "read") return false;
  if (WRITE_ONLY_TOOLS.has(tool)) return role === "write";
  return true;
}
