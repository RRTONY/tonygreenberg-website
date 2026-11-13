import type { SoulsmokeResult } from "@/app/soul-smoke/actions";

// SoulSmoke's server actions already report their own failures as `{ ok: false, error }`. Only a
// request that never reaches the server (dropped connection, offline) throws instead, which left
// pages spinning forever and buttons disabled (browser test, 2026-11-14). Wrapping a call in
// `reach()` turns that into the same error result, so every caller's existing error path handles it.

export const CONNECTION_ERROR = "Couldn't reach the server. Check your connection and try again.";

export function reach<T>(call: Promise<SoulsmokeResult<T>>): Promise<SoulsmokeResult<T>> {
  return call.catch((): SoulsmokeResult<T> => ({ ok: false, error: CONNECTION_ERROR }));
}
