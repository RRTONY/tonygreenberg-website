import { timingSafeEqual } from "crypto";

// MCP clients (Claude Desktop, Claude Code, ChatGPT) are apps, not a
// browser with a portal login cookie — this repo has no admin dashboard at
// all — so auth here is a bearer token, set via MCP_ADMIN_TOKEN.
export function isValidMcpToken(candidate: string | null | undefined): boolean {
  const expected = process.env.MCP_ADMIN_TOKEN;
  if (!expected) return false;

  const a = Buffer.from(candidate ?? "");
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function isMcpRequestAuthorized(req: Request): boolean {
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return isValidMcpToken(token);
}
