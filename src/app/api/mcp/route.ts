import { authenticateMcpToken, bearerFromRequest, isMcpAuthConfigured } from "@/lib/admin/mcp-auth";
import { jsonError, respondToMcp } from "@/lib/admin/mcp-handler";

export const dynamic = "force-dynamic";

// Header-auth entry point, for every client that can send an Authorization
// header: Claude Code (.mcp.json), Claude Desktop, and the Claude.ai org
// connector, each with a personal token from MCP_ADMIN_USERS. Fails closed
// (500) when MCP_ADMIN_USERS isn't set, but only for this route — nothing
// else in the app depends on it.
async function handle(req: Request): Promise<Response> {
  if (!isMcpAuthConfigured()) {
    return jsonError(500, "MCP_ADMIN_USERS is not configured");
  }
  const user = authenticateMcpToken(bearerFromRequest(req));
  if (!user) {
    return jsonError(401, "Unauthorized");
  }
  return respondToMcp(req, user);
}

export const GET = handle;
export const POST = handle;
export const DELETE = handle;
