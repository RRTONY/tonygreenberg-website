import { createSign } from "crypto";

// Google's APIs only accept an OAuth access token, and this repo has no
// OAuth user-consent flow (nor should it, for a server-to-server admin tool) -
// a service account JWT-bearer exchange is the standard headless path. Signed
// by hand with Node's built-in `crypto` (RS256) rather than pulling in
// `google-auth-library` - this is a two-step fetch, not worth a new
// dependency for. Shared by GA4 and Search Console, which use the same
// service account (GOOGLE_GA_*) with different scopes.
const TOKEN_URL = "https://oauth2.googleapis.com/token";

function base64url(input: Buffer | string): string {
  return (typeof input === "string" ? Buffer.from(input) : input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function getServiceAccountEmail(): string | undefined {
  return process.env.GOOGLE_GA_CLIENT_EMAIL;
}

function getCredentials(): { clientEmail: string; privateKey: string } {
  const clientEmail = process.env.GOOGLE_GA_CLIENT_EMAIL;
  const rawKey = process.env.GOOGLE_GA_PRIVATE_KEY;
  if (!clientEmail || !rawKey) {
    throw new Error(
      "GOOGLE_GA_CLIENT_EMAIL / GOOGLE_GA_PRIVATE_KEY is not configured",
    );
  }
  // Env vars can't hold real newlines - the key is stored with literal `\n`
  // escapes and needs unescaping before it's a valid PEM block.
  return { clientEmail, privateKey: rawKey.replace(/\\n/g, "\n") };
}

export async function getGoogleAccessToken(scope: string): Promise<string> {
  const { clientEmail, privateKey } = getCredentials();
  const now = Math.floor(Date.now() / 1000);

  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = base64url(
    JSON.stringify({
      iss: clientEmail,
      scope,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );
  const signature = base64url(
    createSign("RSA-SHA256").update(`${header}.${claims}`).sign(privateKey),
  );
  const jwt = `${header}.${claims}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      typeof data?.error_description === "string"
        ? data.error_description
        : `Google token exchange failed (${res.status})`,
    );
  }
  return data.access_token as string;
}
