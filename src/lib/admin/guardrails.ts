// Files the MCP server's tools may never read or write, regardless of what
// an AI client asks for — closes off the agent editing its own gate,
// secrets, or build config. Checked on every read/write/delete tool call.
// Mirrors the pattern established for ramprate-ui's admin MCP server
// (github.com/RRTONY/ramprate-ui, src/lib/admin/guardrails.ts).
const DENYLIST_PATTERNS: RegExp[] = [
  /^\.env(\..*)?$/i,
  // next.config.ts is intentionally NOT blocked — real redirect-map
  // maintenance (Phase 12) needs it. netlify.toml, .env*, and the rest
  // below stay blocked.
  /^package(-lock)?\.json$/i,
  /^pnpm-lock\.yaml$/i,
  /^netlify\.toml$/i,
  /^\.mcp\.json$/i,
  /^\.github\//i,
  /^\.git\//i,
  /^proxy\.ts$/i,
  /^src\/lib\/admin\//i,
  /^src\/lib\/sanity\/write-client\.ts$/i,
  /^src\/app\/api\/mcp\//i,
];

export function isPathDenied(path: string): boolean {
  const normalized = path.replace(/^\/+/, "");
  return DENYLIST_PATTERNS.some((pattern) => pattern.test(normalized));
}

export const ADMIN_BRANCH_PREFIX = "admin/mcp-";

export function isAdminBranch(branch: string): boolean {
  return branch.startsWith(ADMIN_BRANCH_PREFIX);
}
