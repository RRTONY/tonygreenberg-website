import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createCodeMcpServer } from "@/lib/admin/mcp-server";

export function jsonError(status: number, error: string): Response {
  return new Response(JSON.stringify({ error }), { status, headers: { "content-type": "application/json" } });
}

// Stateless: a fresh Server + transport per request. Every tool call this
// server exposes already resolves its own state from GitHub (see
// mcp-tool-context.ts) rather than relying on anything held in memory
// between requests, matching Netlify Functions' actual no-memory-between-
// invocations guarantee. Callers must authenticate the request themselves
// before calling this — it does no auth of its own.
export async function respondToMcp(req: Request): Promise<Response> {
  const server = createCodeMcpServer();
  const transport = new WebStandardStreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
  await server.connect(transport);
  return transport.handleRequest(req);
}
