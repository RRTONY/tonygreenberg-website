import { isValidMcpToken } from "@/lib/admin/mcp-auth";
import { jsonError, respondToMcp } from "@/lib/admin/mcp-handler";

export const dynamic = "force-dynamic";

// Token-in-path entry point — for MCP clients whose custom-connector UI
// doesn't support a bearer/Authorization header, only "No Authentication"
// (this is ChatGPT's current connector setup: OAuth, no-auth, or a mix of
// the two — no static header option). The secret still has to travel
// somewhere, so it travels in the URL instead; this is functionally the
// same secret as MCP_ADMIN_TOKEN, only its transport differs — slightly
// weaker than a header in one respect (URLs are more likely than headers
// to end up in a proxy access log or browser history), so prefer
// /api/mcp (header auth) for any client that supports it.
async function handle(req: Request, { params }: { params: Promise<{ token: string }> }): Promise<Response> {
  if (!process.env.MCP_ADMIN_TOKEN) {
    return jsonError(500, "MCP_ADMIN_TOKEN is not configured");
  }
  const { token } = await params;
  if (!isValidMcpToken(token)) {
    return jsonError(401, "Unauthorized");
  }
  return respondToMcp(req);
}

export const GET = handle;
export const POST = handle;
export const DELETE = handle;
