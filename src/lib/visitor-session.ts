import "server-only";
import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";

// One anonymous id per browser (an httpOnly cookie, like legacy's session id).
// Shared by essay engagement (one reaction per essay) and quiz results, so
// Tony can see one visitor's activity together. Server Actions only: setting
// a cookie needs a Server Action or Route Handler.
const SESSION_COOKIE = "tg_sid";

export async function visitorSessionId(create: true): Promise<string>;
export async function visitorSessionId(create: boolean): Promise<string | null>;
export async function visitorSessionId(create: boolean): Promise<string | null> {
  const jar = await cookies();
  const existing = jar.get(SESSION_COOKIE)?.value;
  if (existing && /^[0-9a-f-]{36}$/.test(existing)) return existing;
  if (!create) return null;
  const id = randomUUID();
  jar.set(SESSION_COOKIE, id, { httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 60 * 60 * 24 * 365 });
  return id;
}
