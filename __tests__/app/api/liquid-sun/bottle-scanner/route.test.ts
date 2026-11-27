// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/liquid-sun/bottle-scanner/route";

const PNG = "data:image/png;base64,iVBORw0KGgo=";
const send = (body: unknown) =>
  POST(
    new NextRequest("https://tonygreenberg.com/api/liquid-sun/bottle-scanner", {
      method: "POST",
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );

const FALLBACK = { identified: false, name: null, nom: null, rarity: null, soulScore: null, evi: null, notes: [], verdict: null };
const reply = (text: string) => Response.json({ content: [{ type: "text", text }] });

let fetchMock: ReturnType<typeof vi.fn>;
beforeEach(() => {
  vi.stubEnv("ANTHROPIC_API_KEY", "test-key");
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllEnvs();
});

describe("POST /api/liquid-sun/bottle-scanner", () => {
  it("rejects bad JSON, non-images and oversized images with 400, before calling anyone", async () => {
    expect((await send("nope")).status).toBe(400);
    expect((await send({})).status).toBe(400);
    expect((await send({ imageBase64: "data:application/pdf;base64,AAAA" })).status).toBe(400);
    expect((await send({ imageBase64: "https://example.com/x.png" })).status).toBe(400);
    const big = `data:image/jpeg;base64,${"A".repeat(Math.ceil((5 * 1024 * 1024 * 4) / 3) + 8)}`;
    const res = await send({ imageBase64: big });
    expect(res.status).toBe(400);
    expect((await res.json()).message).toMatch(/under 5MB/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("returns 503 when the API key isn't set", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    expect((await send({ imageBase64: PNG })).status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends the image to Anthropic and returns the reading in the page's shape", async () => {
    fetchMock.mockResolvedValue(
      reply(
        'Sure:\n{"identified":true,"name":"Fortaleza Blanco","nom":"1493","rarity":"Cult Favorite","soulScore":98.4,"evi":92,"notes":["Olive Brine","Butter",3],"verdict":"Certified Unicorn."}',
      ),
    );
    const res = await send({ imageBase64: "data:image/jpeg;base64,/9j/4AAQ==" });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      identified: true,
      name: "Fortaleza Blanco",
      nom: "1493",
      rarity: "Cult Favorite",
      soulScore: 98,
      evi: 92,
      notes: ["Olive Brine", "Butter"],
      verdict: "Certified Unicorn.",
    });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.anthropic.com/v1/messages");
    expect(init.headers["x-api-key"]).toBe("test-key");
    const body = JSON.parse(init.body);
    expect(body.system).toMatch(/tequila oracle/);
    expect(body.messages[0].content[0]).toEqual({
      type: "image",
      source: { type: "base64", media_type: "image/jpeg", data: "/9j/4AAQ==" },
    });
  });

  it("falls back to 'not identified' when the model fails or answers without JSON", async () => {
    fetchMock.mockResolvedValueOnce(new Response("busy", { status: 529 }));
    expect(await (await send({ imageBase64: PNG })).json()).toEqual(FALLBACK);
    fetchMock.mockResolvedValueOnce(reply("I can't read that."));
    expect(await (await send({ imageBase64: PNG })).json()).toEqual(FALLBACK);
    fetchMock.mockRejectedValueOnce(new Error("offline"));
    expect(await (await send({ imageBase64: PNG })).json()).toEqual(FALLBACK);
    fetchMock.mockResolvedValueOnce(Response.json({}));
    expect(await (await send({ imageBase64: PNG })).json()).toEqual(FALLBACK);
  });
});
