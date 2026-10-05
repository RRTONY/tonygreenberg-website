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

// Only same-site paths are allowed as a post-login destination.
export function safeNext(next: unknown, fallback = "/my-highlights"): string {
  return typeof next === "string" && next.startsWith("/") && !next.startsWith("//") ? next : fallback;
}

// This request's origin (works on Netlify previews too), for email links.
export async function requestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tonygreenberg.com");
}
