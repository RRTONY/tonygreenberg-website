import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const onDuplicateKeyUpdate = vi.fn().mockResolvedValue(undefined);
const values = vi.fn(() => ({ onDuplicateKeyUpdate }));
const insert = vi.fn(() => ({ values }));

vi.mock("@/lib/db/client", () => ({
  getDb: () => ({ insert }),
}));

import { POST } from "./route";

function createRequest(body: unknown) {
  return new NextRequest("https://example.com/api/subscribe", {
    body: JSON.stringify(body),
    headers: { "content-type": "application/json", origin: "https://example.com" },
    method: "POST",
  });
}

describe("POST /api/subscribe", () => {
  beforeEach(() => {
    vi.stubEnv("KIT_API_KEY", "");
    vi.stubEnv("KIT_API_SECRET", "");
    vi.stubEnv("KIT_FORM_ID", "");
    insert.mockClear();
    values.mockClear();
    onDuplicateKeyUpdate.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("rejects an invalid email without creating a subscription record", async () => {
    const response = await POST(createRequest({ email: "not-an-email", source: "footer" }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      success: false,
      message: "A valid email is required",
    });
    expect(insert).not.toHaveBeenCalled();
  });

  it("records an actionable error when the newsletter provider is not configured", async () => {
    const response = await POST(createRequest({ email: "reader@example.com", source: "footer" }));

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      success: false,
      message: "Newsletter service is not configured",
    });
    expect(insert).toHaveBeenCalledOnce();
  });

  it("returns a confirmed success state after a successful provider submission", async () => {
    vi.stubEnv("KIT_API_SECRET", "test-secret");
    vi.stubEnv("KIT_FORM_ID", "12345");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: async () => ({ id: 99 }),
        ok: true,
        text: async () => "",
      }),
    );

    const response = await POST(
      createRequest({ email: "reader@example.com", firstName: "Reader", source: "footer" }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      message: "You are subscribed.",
    });
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(insert).toHaveBeenCalledOnce();
  });
});
