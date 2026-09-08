import { isMcpRequestAuthorized } from "@/lib/admin/mcp-auth";
import { jsonError, respondToMcp } from "@/lib/admin/mcp-handler";

export const dynamic = "force-dynamic";

// Header-auth entry point — for MCP clients that support a custom
// Authorization header (Claude Code, Claude Desktop, Claude Team/Enterprise
// connectors). ChatGPT's connector UI does not offer a bearer-token option;
// see api/mcp/[token]/route.ts for that case.
async function handle(req: Request): Promise<Response> {
  if (!process.env.MCP_ADMIN_TOKEN) {
    return jsonError(500, "MCP_ADMIN_TOKEN is not configured");
  }
  if (!isMcpRequestAuthorized(req)) {
    return jsonError(401, "Unauthorized");
  }
  return respondToMcp(req);
}

export const GET = handle;
export const POST = handle;
export const DELETE = handle;
