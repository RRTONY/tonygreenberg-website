"use client";

import { useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { computeToolScores } from "@/lib/content/brewsoul-tool-scores";
import type { CatalogItem } from "@/lib/intelligence-engine/types";
import { readVisitorState, writeVisitorState } from "@/lib/visitor-state-client";

type CollectionState = { ids?: string[] };
const EMPTY_COLLECTION: readonly string[] = [];
const collectionListeners = new Set<() => void>();
let collectionIds: string[] = [];
let collectionHydrated = false;

function emitCollectionChange() {
  collectionListeners.forEach((listener) => listener());
}

function hydrateCollection() {
  if (collectionHydrated) return;
  collectionHydrated = true;
  void readVisitorState<CollectionState>("brewsoul")
    .then((state) => {
      collectionIds = Array.isArray(state?.ids)
        ? state.ids.filter((id): id is string => typeof id === "string")
        : [];
      emitCollectionChange();
    })
    .catch(() => undefined);
}

function subscribeCollection(listener: () => void) {
  collectionListeners.add(listener);
  hydrateCollection();
  return () => collectionListeners.delete(listener);
}

function getCollectionSnapshot() {
  return collectionIds;
}

// Ported from legacy client/src/pages/brewsoul/BrewSoulTools.tsx's
// `BrewSoulCollection` — real save/toggle-to-collection behavior,
// unchanged. Saved items are now associated with an HttpOnly visitor cookie
// and managed database record, avoiding SSR hydration issues and persistent
// client-side browser storage.
export function CollectionExplorer({ coffees }: { coffees: CatalogItem[] }) {
  const saved = useSyncExternalStore(
    subscribeCollection,
    getCollectionSnapshot,
    () => EMPTY_COLLECTION as string[],
  );

  const toggle = useCallback(
    (id: string) => {
      const next = saved.includes(id) ? saved.filter((savedId) => savedId !== id) : [...saved, id];
      collectionIds = next;
      emitCollectionChange();
      void writeVisitorState("brewsoul", { ids: next }).catch(() => undefined);
    },
    [saved],
  );

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
                  <button
                    onClick={() => toggle(c.id)}
                    className="text-[#C5A23C]"
                    aria-label={`Remove ${c.name} from your collection`}
                  >
                    <Heart aria-hidden="true" className="size-5 fill-current" />
                  </button>
                </div>
                <div className="font-mono text-[0.68rem] text-[#6B5B4F]">
                  {c.producer} · {c.originCountry}
                </div>
                <div className="mt-2 flex gap-2">
                  <span className="rounded-full bg-[#C5A23C]/10 px-2 py-0.5 font-mono text-[0.65rem] text-[#C5A23C]">
                    {s.tier}
                  </span>
                  <span className="rounded-full bg-[#6F4E37]/10 px-2 py-0.5 font-mono text-[0.65rem] text-[#6F4E37]">
                    {s.overall.toFixed(1)}
                  </span>
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
          <option value="">Add a coffee to your collection...</option>
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
