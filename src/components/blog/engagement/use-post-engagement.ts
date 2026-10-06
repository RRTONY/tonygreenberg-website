"use client";

import { useSyncExternalStore } from "react";
import { loadPostEngagement, type PostEngagement } from "@/app/blog/[slug]/engagement-actions";

// One shared load per essay for every engagement block on the page ("Did this
// land?", Discourse, the verdict, Rate this thinking, Micro-commitment), as an
// external store so the blocks stay in sync after any of them saves. The page
// itself is static; this runs in the browser after it arrives.

type Entry = { data: PostEngagement | null; listeners: Set<() => void>; loading: boolean };
const store = new Map<string, Entry>();

function entry(slug: string): Entry {
  let e = store.get(slug);
  if (!e) {
    e = { data: null, listeners: new Set(), loading: false };
    store.set(slug, e);
  }
  return e;
}

export function refreshPostEngagement(slug: string) {
  const e = entry(slug);
  if (e.loading) return;
  e.loading = true;
  loadPostEngagement(slug)
    .then((data) => {
      e.data = data;
    })
    .catch(() => {})
    .finally(() => {
      e.loading = false;
      e.listeners.forEach((l) => l());
    });
}

export function usePostEngagement(slug: string): PostEngagement | null {
  return useSyncExternalStore(
    (listener) => {
      const e = entry(slug);
      e.listeners.add(listener);
      if (!e.data) refreshPostEngagement(slug);
      return () => e.listeners.delete(listener);
    },
    () => entry(slug).data,
    () => null,
  );
}
