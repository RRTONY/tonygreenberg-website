"use client";

import { useCallback, useSyncExternalStore } from "react";

// A value kept in localStorage and shared by every component that reads the same key, read
// through useSyncExternalStore (same idiom as brewsoul/collection-explorer.tsx) so the server
// render and the first client render agree (the server always sees `fallback`). Replaces the
// SoulSmoke app's useState(() => localStorage...) + useEffect(save) contexts.

type Store<T> = {
  listeners: Set<() => void>;
  raw: string | null | undefined;
  value: T;
  /** Set when the browser refused to save: keep the value in memory for this visit. */
  memoryOnly: boolean;
};

const stores = new Map<string, Store<unknown>>();

function getStore<T>(key: string, fallback: T): Store<T> {
  let store = stores.get(key) as Store<T> | undefined;
  if (!store) {
    store = { listeners: new Set(), raw: undefined, value: fallback, memoryOnly: false };
    stores.set(key, store as Store<unknown>);
  }
  return store;
}

function read<T>(key: string, fallback: T): T {
  const store = getStore(key, fallback);
  if (store.memoryOnly) return store.value;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(key);
  } catch {
    raw = null;
  }
  if (raw !== store.raw) {
    store.raw = raw;
    if (raw === null) {
      store.value = fallback;
    } else {
      try {
        store.value = JSON.parse(raw) as T;
      } catch {
        // Older SoulSmoke builds saved some values as plain strings ("en", "soulsmoke").
        store.value = raw as unknown as T;
      }
    }
  }
  return store.value;
}

export function writeLocalStore<T>(key: string, value: T, fallback: T) {
  const store = getStore(key, fallback);
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    store.memoryOnly = false;
  } catch {
    // Private mode or storage full: keep the value in memory for this visit.
    store.memoryOnly = true;
    store.value = value;
  }
  store.listeners.forEach((listener) => listener());
}

export function useLocalStore<T>(key: string, fallback: T) {
  const subscribe = useCallback(
    (listener: () => void) => {
      const store = getStore(key, fallback);
      store.listeners.add(listener);
      const onStorage = (event: StorageEvent) => {
        if (event.key === key) listener();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        store.listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
    [key, fallback],
  );
  const value = useSyncExternalStore(
    subscribe,
    () => read(key, fallback),
    () => fallback,
  );
  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = read(key, fallback);
      const resolved = typeof next === "function" ? (next as (prev: T) => T)(prev) : next;
      writeLocalStore(key, resolved, fallback);
    },
    [key, fallback],
  );
  return [value, setValue] as const;
}
