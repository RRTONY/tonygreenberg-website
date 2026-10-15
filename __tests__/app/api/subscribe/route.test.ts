// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/subscribe/route";

const send = (body: unknown) =>
  POST(new NextRequest("https://tonygreenberg.com/api/subscribe", { method: "POST", body: typeof body === "string" ? body : JSON.stringify(body) }));

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  vi.stubEnv("KIT_API_SECRET", "secret");
  vi.stubEnv("KIT_API_KEY", "");
  vi.stubEnv("KIT_FORM_ID", "123");
  fetchMock = vi.fn(async (url: string) =>
    String(url).endsWith("/tags") ? Response.json({ id: 77 }) : Response.json({ subscription: {} }),
  );
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/subscribe", () => {
  it("rejects a body that isn't JSON, a bad email and oversized fields with 400", async () => {
    expect((await send("not json")).status).toBe(400);
    expect((await send({ email: "nope" })).status).toBe(400);
    expect((await send({})).status).toBe(400);
    expect((await send({ email: `${"a".repeat(320)}@b.co` })).status).toBe(400);
    expect((await send({ email: "a@b.co", source: "x".repeat(192) })).status).toBe(400);
    expect((await send({ email: "a@b.co", firstName: "x".repeat(192) })).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 503 when Kit isn't configured", async () => {
    vi.stubEnv("KIT_API_SECRET", "");
    expect((await send({ email: "a@b.co" })).status).toBe(503);
    vi.stubEnv("KIT_API_SECRET", "secret");
    vi.stubEnv("KIT_FORM_ID", "");
    expect((await send({ email: "a@b.co" })).status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("subscribes through the Kit form, then tags by source", async () => {
    const res = await send({ email: " me@example.com ", firstName: "Ann", source: "footer" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.convertkit.com/v3/forms/123/subscribe");
    expect(JSON.parse(init.body)).toEqual({ api_secret: "secret", email: "me@example.com", first_name: "Ann" });
    expect(fetchMock.mock.calls[1][0]).toBe("https://api.convertkit.com/v3/tags");
    expect(fetchMock.mock.calls[2][0]).toBe("https://api.convertkit.com/v3/tags/77/subscribe");
  });

  it("with only the public key: subscribes but doesn't tag", async () => {
    vi.stubEnv("KIT_API_SECRET", "");
    vi.stubEnv("KIT_API_KEY", "pub");
    expect((await send({ email: "me@example.com" })).status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ api_key: "pub" });
  });

  it("still succeeds when tagging fails", async () => {
    fetchMock.mockImplementation(async (url: string) => {
      if (String(url).endsWith("/tags")) throw new Error("tag down");
      return Response.json({});
    });
    expect((await send({ email: "me@example.com" })).status).toBe(200);
  });

  it("returns 502 when Kit refuses the subscription", async () => {
    fetchMock.mockResolvedValue(new Response("nope", { status: 500 }));
    const res = await send({ email: "me@example.com" });
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ success: false, message: "Newsletter service error" });
  });
});
