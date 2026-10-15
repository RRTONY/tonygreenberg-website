// @vitest-environment node
import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { POST } from "@/app/api/revalidate/route";

// The real signature check, minus next-sanity's 3-second wait.
vi.mock("next-sanity/webhook", async (importOriginal) => {
  const real = await importOriginal<typeof import("next-sanity/webhook")>();
  return { parseBody: (req: Parameters<typeof real.parseBody>[0], secret?: string) => real.parseBody(req, secret, false) };
});

const SECRET = "webhook-secret";
function sign(body: string, secret = SECRET) {
  const t = Date.now();
  const sig = createHmac("sha256", secret).update(`${t}.${body}`).digest("base64url");
  return `t=${t},v1=${sig}`;
}
function req(body: string, signature?: string) {
  return new Request("https://tonygreenberg.com/api/revalidate", {
    method: "POST",
    body,
    headers: signature ? { "sanity-webhook-signature": signature } : {},
  }) as unknown as NextRequest;
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/revalidate", () => {
  it("refreshes every Sanity page when the webhook signature is valid", async () => {
    vi.stubEnv("SANITY_WEBHOOK_SECRET", SECRET);
    const body = JSON.stringify({ _type: "post" });
    const res = await POST(req(body, sign(body)));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ revalidated: true, type: "post" });
    expect(revalidateTag).toHaveBeenCalledWith("sanity", { expire: 0 });
  });

  it("refuses a request signed with the wrong secret, or not signed at all", async () => {
    vi.stubEnv("SANITY_WEBHOOK_SECRET", SECRET);
    vi.spyOn(console, "error").mockImplementation(() => {});
    const body = JSON.stringify({ _type: "post" });
    expect((await POST(req(body, sign(body, "guess")))).status).toBe(401);
    expect((await POST(req(body))).status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("refuses everything when SANITY_WEBHOOK_SECRET isn't set", async () => {
    vi.stubEnv("SANITY_WEBHOOK_SECRET", "");
    const body = JSON.stringify({ _type: "post" });
    expect((await POST(req(body, sign(body)))).status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("returns 400 for a signed body with no document type", async () => {
    vi.stubEnv("SANITY_WEBHOOK_SECRET", SECRET);
    const body = JSON.stringify({ hello: 1 });
    expect((await POST(req(body, sign(body)))).status).toBe(400);
  });
});

describe("POST /api/revalidate errors", () => {
  it("answers 500 with the error message when the body can't be read", async () => {
    vi.stubEnv("SANITY_WEBHOOK_SECRET", SECRET);
    const body = "{not json";
    const res = await POST(req(body, sign(body)));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ message: expect.any(String) });
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("says 'Unknown error' when something other than an Error is thrown", async () => {
    vi.mocked(revalidateTag).mockImplementationOnce(() => {
      throw "boom";
    });
    vi.stubEnv("SANITY_WEBHOOK_SECRET", SECRET);
    const body = JSON.stringify({ _type: "post" });
    const res = await POST(req(body, sign(body)));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ message: "Unknown error" });
  });
});
