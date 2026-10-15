import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// The signed-in member, or null. Reads the Supabase session cookie, so any
// page calling it renders per request.
export async function getUser() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// For member-only pages: the signed-in member, or a redirect to /login that
// comes back here afterwards.
export async function requireUser(returnTo: string) {
  const user = await getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(returnTo)}`);
  return user;
}

// Admins are listed by email in the ADMIN_EMAILS env var (comma-separated).
export function isAdmin(email: string | undefined | null): boolean {
  if (!email) return false;
  const admins = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  return admins.includes(email.toLowerCase());
}

// Only same-site paths are allowed as a post-login destination. The path is
// read the way a browser reads it (a backslash counts as "/", tabs and newlines
// are dropped), so "/\evil.com" or "/<tab>/evil.com" can't turn into
// "//evil.com" and send someone to another site.
const SAFE_ORIGIN = "https://same-site.invalid";
export function safeNext(next: unknown, fallback = "/my-highlights"): string {
  if (typeof next !== "string" || !next.startsWith("/")) return fallback;
  try {
    const url = new URL(next, SAFE_ORIGIN);
    if (url.origin !== SAFE_ORIGIN || /[\\\t\n\r]/.test(next) || next.startsWith("//")) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}

// This request's origin (works on Netlify previews too), for email links.
export async function requestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tonygreenberg.com");
}
