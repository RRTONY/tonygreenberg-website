// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/soul-smoke/bottle-scanner/route";

const PNG = "data:image/png;base64,iVBORw0KGgo=";
const send = (body: unknown) =>
  POST(
    new NextRequest("https://tonygreenberg.com/api/soul-smoke/bottle-scanner", {
      method: "POST",
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );

const FALLBACK = {
  identified: false,
  confidence: "low",
  authenticity: "unknown",
  warnings: ["Analysis failed. Please try again with a clearer image."],
  recommendations: ["Ensure the label is clearly visible and well-lit."],
  analysis: "Unable to analyze the image. This could be due to image quality or a temporary service issue.",
};

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

describe("POST /api/soul-smoke/bottle-scanner", () => {
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

  it("sends the image and the original system prompt to Anthropic and returns the parsed result", async () => {
    fetchMock.mockResolvedValue(
      reply(
        'Here you go:\n```json\n{"identified":true,"brand":"Real Minero","expression":"Largo","producer":"","agaveType":"Largo","region":null,"abv":"48%","nomNumber":"O135X","confidence":"high","authenticity":"verified","warnings":[],"recommendations":["Buy it", 3],"analysis":"Classic."}\n```',
      ),
    );
    const res = await send({ imageBase64: PNG });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      identified: true,
      brand: "Real Minero",
      expression: "Largo",
      producer: null,
      agaveType: "Largo",
      region: null,
      abv: "48%",
      nomNumber: "O135X",
      confidence: "high",
      authenticity: "verified",
      warnings: [],
      recommendations: ["Buy it"],
      analysis: "Classic.",
    });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.anthropic.com/v1/messages");
    expect(init.headers).toMatchObject({ "x-api-key": "test-key", "anthropic-version": "2023-06-01" });
    const body = JSON.parse(init.body);
    expect(body.model).toBe("claude-haiku-5-5");
    expect(body.max_tokens).toBe(1500);
    expect(body.system).toMatch(/^You are an expert mezcal sommelier and authenticity verifier\./);
    expect(body.system).toContain("Casamigos (lawsuit alleged only 33% agave)");
    expect(body.messages[0].content[0]).toEqual({
      type: "image",
      source: { type: "base64", media_type: "image/png", data: "iVBORw0KGgo=" },
    });
  });

  it("fills unknown values with safe defaults", async () => {
    fetchMock.mockResolvedValue(reply('{"confidence":"sure","authenticity":"maybe","warnings":"x"}'));
    expect(await (await send({ imageBase64: PNG })).json()).toMatchObject({
      identified: false,
      confidence: "low",
      authenticity: "unknown",
      warnings: [],
      recommendations: [],
      analysis: "",
    });
  });

  it("returns the original fallback on an API error, a non-JSON reply, an empty reply or a network failure", async () => {
    fetchMock.mockResolvedValueOnce(new Response("overloaded", { status: 529 }));
    expect(await (await send({ imageBase64: PNG })).json()).toEqual(FALLBACK);
    fetchMock.mockResolvedValueOnce(reply("I can't read that label."));
    expect(await (await send({ imageBase64: PNG })).json()).toEqual(FALLBACK);
    fetchMock.mockResolvedValueOnce(Response.json({}));
    expect(await (await send({ imageBase64: PNG })).json()).toEqual(FALLBACK);
    fetchMock.mockResolvedValueOnce(reply("[1, 2]"));
    expect(await (await send({ imageBase64: PNG })).json()).toEqual(FALLBACK);
    fetchMock.mockResolvedValueOnce(reply("{not json}"));
    expect(await (await send({ imageBase64: PNG })).json()).toEqual(FALLBACK);
    fetchMock.mockRejectedValueOnce("socket hang up");
    expect(await (await send({ imageBase64: PNG })).json()).toEqual(FALLBACK);
  });
});
