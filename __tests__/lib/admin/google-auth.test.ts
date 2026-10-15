import { createVerify, generateKeyPairSync } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getGoogleAccessToken, getServiceAccountEmail } from "@/lib/admin/google-auth";

const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const PEM = privateKey.export({ type: "pkcs8", format: "pem" }).toString();
const b64 = (s: string) => Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");

describe("google-auth", () => {
  beforeEach(() => {
    vi.stubEnv("GOOGLE_GA_CLIENT_EMAIL", "bot@project.iam.gserviceaccount.com");
    // Stored the way Netlify holds it: literal \n escapes.
    vi.stubEnv("GOOGLE_GA_PRIVATE_KEY", PEM.replace(/\n/g, "\\n"));
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("getServiceAccountEmail reads the env var", () => {
    expect(getServiceAccountEmail()).toBe("bot@project.iam.gserviceaccount.com");
  });

  it("throws before any request when credentials are missing", async () => {
    vi.stubEnv("GOOGLE_GA_PRIVATE_KEY", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await expect(getGoogleAccessToken("scope")).rejects.toThrow(/not configured/);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("exchanges a correctly signed RS256 JWT for an access token", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ access_token: "ya29.token" })));
    vi.stubGlobal("fetch", fetchMock);
    await expect(getGoogleAccessToken("https://www.googleapis.com/auth/analytics.readonly")).resolves.toBe("ya29.token");

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://oauth2.googleapis.com/token");
    expect(init.method).toBe("POST");
    const body = init.body as URLSearchParams;
    expect(body.get("grant_type")).toBe("urn:ietf:params:oauth:grant-type:jwt-bearer");
    const [h, c, s] = body.get("assertion")!.split(".");
    expect(JSON.parse(b64(h).toString())).toEqual({ alg: "RS256", typ: "JWT" });
    const claims = JSON.parse(b64(c).toString());
    expect(claims).toMatchObject({ iss: "bot@project.iam.gserviceaccount.com", scope: "https://www.googleapis.com/auth/analytics.readonly", aud: "https://oauth2.googleapis.com/token" });
    expect(claims.exp - claims.iat).toBe(3600);
    expect(createVerify("RSA-SHA256").update(`${h}.${c}`).verify(publicKey, b64(s))).toBe(true);
  });

  it("surfaces Google's error description, or the status", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ error_description: "Invalid JWT Signature." }), { status: 400 })));
    await expect(getGoogleAccessToken("s")).rejects.toThrow("Invalid JWT Signature.");
    vi.stubGlobal("fetch", vi.fn(async () => new Response("not json", { status: 503 })));
    await expect(getGoogleAccessToken("s")).rejects.toThrow("Google token exchange failed (503)");
  });
});
