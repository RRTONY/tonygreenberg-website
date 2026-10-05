import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";

// Password-protected essays (live and legacy gate these behind a password).
// Unlike legacy's browser-side check, the password is compared on the server
// and the essay body is only rendered after a correct entry, so it never
// reaches the page HTML before that. The password lives in the
// GATED_POST_PASSWORD env var (never in code); with it unset, gated posts
// stay locked for everyone. Note: the Sanity dataset itself is readable by
// anyone with the project id, so this protects the website, not the raw data.
const GATED_POST_SLUGS = new Set(["you-are-the-moat"]);
const COOKIE_PREFIX = "tg_unlocked_";
const UNLOCK_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function isGatedPost(slug: string): boolean {
  return GATED_POST_SLUGS.has(slug);
}

// The cookie holds a hash of slug + current password, so changing the
// password locks everyone out again.
function unlockToken(slug: string): string | null {
  const password = process.env.GATED_POST_PASSWORD;
  return password ? createHash("sha256").update(`${slug}:${password}`).digest("hex") : null;
}

export async function hasUnlocked(slug: string): Promise<boolean> {
  const expected = unlockToken(slug);
  if (!expected) return false;
  const actual = (await cookies()).get(COOKIE_PREFIX + slug)?.value;
  return actual === expected;
}

export function passwordMatches(attempt: string): boolean {
  const password = process.env.GATED_POST_PASSWORD;
  if (!password) return false;
  const a = createHash("sha256").update(attempt).digest();
  const b = createHash("sha256").update(password).digest();
  return timingSafeEqual(a, b);
}

export async function rememberUnlock(slug: string): Promise<void> {
  const token = unlockToken(slug);
  if (!token) return;
  // Secure whenever the request came over HTTPS (always, on Netlify). Keyed
  // off the real protocol, not NODE_ENV: Safari drops Secure cookies on a
  // plain-http local production build.
  const proto = (await headers()).get("x-forwarded-proto");
  (await cookies()).set(COOKIE_PREFIX + slug, token, {
    httpOnly: true,
    secure: proto === "https",
    sameSite: "lax",
    path: `/blog/${slug}`,
    maxAge: UNLOCK_MAX_AGE,
  });
}
