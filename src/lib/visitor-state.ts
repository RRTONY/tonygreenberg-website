import "server-only";

import { randomUUID } from "node:crypto";

import { and, eq, gt } from "drizzle-orm";
import { cookies } from "next/headers";

import { visitorStates } from "../../drizzle/schema";
import { getDb } from "@/lib/db/client";

export const VISITOR_COOKIE_NAME = "tg_visitor";
export const VISITOR_STATE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export const VISITOR_STATE_NAMESPACES = [
  "assessment-results",
  "brewsoul",
  "journey",
  "newsletter",
  "pri",
  "reading",
] as const;

export type VisitorStateNamespace = (typeof VISITOR_STATE_NAMESPACES)[number];
export type VisitorStateValue = Record<string, unknown>;

export function isVisitorStateNamespace(value: string): value is VisitorStateNamespace {
  return VISITOR_STATE_NAMESPACES.includes(value as VisitorStateNamespace);
}

export function createVisitorId() {
  return randomUUID().replaceAll("-", "");
}

export function visitorCookieOptions() {
  return {
    httpOnly: true,
    maxAge: VISITOR_STATE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function visitorStateExpiresAt() {
  return new Date(Date.now() + VISITOR_STATE_MAX_AGE_SECONDS * 1000);
}

export async function getVisitorState(
  namespace: VisitorStateNamespace,
): Promise<VisitorStateValue | null> {
  const cookieStore = await cookies();
  const visitorId = cookieStore.get(VISITOR_COOKIE_NAME)?.value;
  if (!visitorId) return null;

  return getVisitorStateById(visitorId, namespace);
}

export async function getVisitorStateById(
  visitorId: string,
  namespace: VisitorStateNamespace,
): Promise<VisitorStateValue | null> {
  const rows = await getDb()
    .select({ value: visitorStates.value })
    .from(visitorStates)
    .where(
      and(
        eq(visitorStates.visitorId, visitorId),
        eq(visitorStates.namespace, namespace),
        gt(visitorStates.expiresAt, new Date()),
      ),
    )
    .limit(1);

  return rows[0]?.value ?? null;
}

export async function saveVisitorState(
  visitorId: string,
  namespace: VisitorStateNamespace,
  value: VisitorStateValue,
) {
  const expiresAt = visitorStateExpiresAt();

  await getDb()
    .insert(visitorStates)
    .values({ expiresAt, namespace, value, visitorId })
    .onDuplicateKeyUpdate({ set: { expiresAt, value } });
}
