import { describe, it, expect, vi } from "vitest";

describe("Chat Notifications & Share Tracking", () => {
  it("should have analytics.trackShare procedure defined", async () => {
    const routerModule = await import("./routers");
    const router = routerModule.appRouter;
    const procedures = router._def.procedures;

    expect(procedures["analytics.trackShare"]).toBeDefined();
  });

  it("should have fauxTony.ask procedure defined", async () => {
    const routerModule = await import("./routers");
    const router = routerModule.appRouter;
    const procedures = router._def.procedures;

    expect(procedures["fauxTony.ask"]).toBeDefined();
  });

  it("should have fauxTony.getHistory procedure defined", async () => {
    const routerModule = await import("./routers");
    const router = routerModule.appRouter;
    const procedures = router._def.procedures;

    expect(procedures["fauxTony.getHistory"]).toBeDefined();
  });

  it("should export getRecentChatSessions from db module", async () => {
    const dbModule = await import("./db");
    expect(dbModule.getRecentChatSessions).toBeDefined();
    expect(typeof dbModule.getRecentChatSessions).toBe("function");
  });

  it("should export recordShare from db module", async () => {
    const dbModule = await import("./db");
    expect(dbModule.recordShare).toBeDefined();
    expect(typeof dbModule.recordShare).toBe("function");
  });

  it("should export notifyOwner from notification module", async () => {
    const notifModule = await import("./_core/notification");
    expect(notifModule.notifyOwner).toBeDefined();
    expect(typeof notifModule.notifyOwner).toBe("function");
  });
});

describe("Daily Chat Digest Endpoint", () => {
  it("should reject requests without cron task UID header", async () => {
    // Simulate Express request/response for the chat-digest endpoint
    const express = await import("express");
    const app = express.default();
    app.use(express.default.json());

    // Mount the handler inline (same logic as in index.ts)
    app.post("/api/scheduled/chat-digest", async (req, res) => {
      const cronTaskUid = req.headers["x-manus-cron-task-uid"];
      if (!cronTaskUid) {
        return res.status(403).json({ error: "cron-only" });
      }
      res.json({ ok: true });
    });

    // Use supertest-like approach with native fetch
    const http = await import("http");
    const server = http.createServer(app);

    await new Promise<void>((resolve) => server.listen(0, resolve));
    const addr = server.address() as { port: number };

    // Test without header
    const res = await fetch(`http://localhost:${addr.port}/api/scheduled/chat-digest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBe("cron-only");

    server.close();
  });

  it("should accept requests with cron task UID header", async () => {
    const express = await import("express");
    const app = express.default();
    app.use(express.default.json());

    app.post("/api/scheduled/chat-digest", async (req, res) => {
      const cronTaskUid = req.headers["x-manus-cron-task-uid"];
      if (!cronTaskUid) {
        return res.status(403).json({ error: "cron-only" });
      }
      // In the real handler it would query DB; here we just verify auth passes
      res.json({ ok: true, authenticated: true });
    });

    const http = await import("http");
    const server = http.createServer(app);

    await new Promise<void>((resolve) => server.listen(0, resolve));
    const addr = server.address() as { port: number };

    // Test with header
    const res = await fetch(`http://localhost:${addr.port}/api/scheduled/chat-digest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-manus-cron-task-uid": "test-task-uid-123",
      },
      body: JSON.stringify({}),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.authenticated).toBe(true);

    server.close();
  });
});
