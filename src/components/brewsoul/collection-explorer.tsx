"use client";

import { useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { computeToolScores } from "@/lib/content/brewsoul-tool-scores";
import type { CatalogItem } from "@/lib/intelligence-engine/types";

const STORAGE_KEY = "brewsoul-collection";
const EMPTY: readonly string[] = [];
const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedIds: string[] = [];

function readStore(): string[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedIds;
  cachedRaw = raw;
  try {
    const parsed = raw ? JSON.parse(raw) : [];
    cachedIds = Array.isArray(parsed) ? parsed : [];
  } catch {
    cachedIds = [];
  }
  return cachedIds;
}

function writeStore(next: string[]) {
  cachedRaw = JSON.stringify(next);
  cachedIds = next;
  localStorage.setItem(STORAGE_KEY, cachedRaw);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Ported from legacy client/src/pages/brewsoul/BrewSoulTools.tsx's
// `BrewSoulCollection` — real save/toggle-to-collection behavior,
// unchanged. **Real bug fixed**: legacy read `localStorage` directly
// inside a `useState` initializer, unsafe during SSR and a real
// hydration-mismatch source (same class of bug fixed in
// `journey-bar.tsx`/`journey-tracker.tsx` elsewhere in this migration) —
// rebuilt around a module-level external store fed through
// `useSyncExternalStore`, same idiom as `useJourneyProgress`.
export function CollectionExplorer({ coffees }: { coffees: CatalogItem[] }) {
  const saved = useSyncExternalStore(subscribe, readStore, () => EMPTY as string[]);

  const toggle = useCallback((id: string) => {
    const current = readStore();
    const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
    writeStore(next);
  }, []);

  const collection = coffees.filter((c) => saved.includes(c.id));

  return (
    <>
      {collection.length === 0 ? (
        <div className="px-8 py-16 text-center">
          <div className="mb-2 font-heading text-xl text-[#2C1810]">Nothing here yet.</div>
          <p className="text-[0.9rem] text-[#6B5B4F]">
            Browse the{" "}
            <Link href="/brewsoul/browse" className="text-[#C5A23C]">
              catalog
            </Link>{" "}
            and save coffees you love.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
          {collection.map((c) => {
            const s = computeToolScores(c);
            return (
              <div key={c.id} className="rounded-xl border border-[#6F4E37]/8 bg-white p-6">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/brewsoul/coffee/${c.id}`}>
                    <h3 className="font-heading text-base font-bold text-[#2C1810]">{c.name}</h3>
                  </Link>
                  <button onClick={() => toggle(c.id)} className="text-lg text-[#C5A23C]">
                    ♥
                  </button>
                </div>
                <div className="font-mono text-[0.68rem] text-[#6B5B4F]">
                  {c.producer} · {c.originCountry}
                </div>
                <div className="mt-2 flex gap-2">
                  <span className="rounded-full bg-[#C5A23C]/10 px-2 py-0.5 font-mono text-[0.65rem] text-[#C5A23C]">{s.tier}</span>
                  <span className="rounded-full bg-[#6F4E37]/10 px-2 py-0.5 font-mono text-[0.65rem] text-[#6F4E37]">{s.overall.toFixed(1)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-10">
        <h2 className="mb-3 font-heading text-xl font-bold text-[#2C1810]">Quick Add</h2>
        <select
          onChange={(e) => {
            toggle(e.target.value);
            e.target.value = "";
          }}
          className="w-full rounded-lg border border-[#6F4E37]/15 bg-white px-4 py-3 text-sm"
          defaultValue=""
        >
          <option value="">+ Add a coffee to your collection...</option>
          {coffees
            .filter((c) => !saved.includes(c.id))
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.producer}
              </option>
            ))}
        </select>
      </div>
    </>
  );
}
