"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, Heart, MapPin, Share2, Trash2, X } from "lucide-react";
import { useFavorites } from "@/components/soulsmoke/soulsmoke-providers";
import { allMezcals, flavorDimensions, type FlavorProfile, type Mezcal } from "@/lib/content/soulsmoke/mezcal-data";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/MyHuntList.tsx. Same sections, copy and
// behaviour; the hunt list is the shared favorites (localStorage "mezcal-favorites", same key as
// the Manus app). The US and Mexico cards were the same markup twice; they share HuntCard here.

type FlavorAxis = keyof FlavorProfile;

const AVAILABILITY_BADGE: Record<string, string> = {
  easy: "rounded-full bg-green-100 px-2 py-1 font-heading text-xs text-green-700",
  moderate: "rounded-full bg-yellow-100 px-2 py-1 font-heading text-xs text-yellow-700",
  hard: "rounded-full bg-orange-100 px-2 py-1 font-heading text-xs text-orange-700",
};
const AVAILABILITY_BADGE_RARE = "rounded-full bg-red-100 px-2 py-1 font-heading text-xs text-red-700";

function HuntCard({
  mezcal,
  onOpen,
  onRemove,
}: {
  mezcal: Mezcal;
  onOpen: (mezcal: Mezcal) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${mezcal.brand} ${mezcal.name}`}
      className="group cursor-pointer overflow-hidden rounded-xl border border-earth/10 bg-white shadow-sm transition-shadow hover:shadow-lg"
      onClick={() => onOpen(mezcal)}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onOpen(mezcal);
        }
      }}
    >
      <div className="p-6">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <div className="font-heading text-sm text-terracotta">{mezcal.brand}</div>
            <h3 className="font-display text-xl text-earth">{mezcal.name}</h3>
          </div>
          <button
            type="button"
            aria-label={`Remove ${mezcal.brand} ${mezcal.name} from hunt list`}
            onClick={(e) => {
              e.stopPropagation();
              onRemove(mezcal.id);
            }}
            className="rounded-full p-2 transition-colors hover:bg-red-100"
          >
            <Heart aria-hidden="true" className="size-5 fill-terracotta text-terracotta" />
          </button>
        </div>
        <p className="mb-4 font-body text-sm text-earth/60">
          {mezcal.agave} · {mezcal.region.split(",")[0]}
        </p>
        <div className="flex items-center justify-between">
          <span className="font-heading text-lg font-semibold text-sage">${mezcal.price}</span>
          <span className={AVAILABILITY_BADGE[mezcal.availability] ?? AVAILABILITY_BADGE_RARE}>
            {mezcal.availability}
          </span>
        </div>
      </div>
      <div className="border-t border-earth/10 bg-earth/5 px-6 py-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-body text-earth/60">EVI: {mezcal.evi}</span>
          <span className="font-body text-earth/60">EEI: {mezcal.eei}</span>
          <span className="inline-flex items-center gap-1 font-heading text-terracotta group-hover:underline">
            View Details <ArrowRight aria-hidden="true" className="size-[1em]" />
          </span>
        </div>
      </div>
    </div>
  );
}

export function MyHuntList() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const [selectedMezcal, setSelectedMezcal] = useState<Mezcal | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const favoriteMezcals = allMezcals.filter((m) => favorites.includes(m.id));

  const usMarket = favoriteMezcals.filter((m) => m.market === "us" || m.market === "both");
  const mexicoMarket = favoriteMezcals.filter((m) => m.market === "mexico" || m.market === "both");

  const totalEstimatedCost = favoriteMezcals.reduce((sum, m) => sum + m.price, 0);

  const copyToClipboard = async () => {
    const text = favoriteMezcals
      .map(
        (m) =>
          `${m.brand} ${m.name} (${m.agave}) - $${m.price} - ${m.market === "us" ? "US" : m.market === "mexico" ? "Mexico" : "Both"}`,
      )
      .join("\n");
    try {
      await navigator.clipboard.writeText(`My Mezcal Hunt List:\n\n${text}\n\nTotal: $${totalEstimatedCost}`);
      alert("Hunt list copied to clipboard!");
    } catch {
      // Clipboard blocked (permissions or an insecure page): nothing to copy into.
    }
  };

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-20">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <Heart aria-hidden="true" className="mx-auto mb-6 size-24 text-earth/20" />
          <h1 className="mb-4 font-display text-4xl text-earth">Your Hunt List is Empty</h1>
          <p className="mb-8 font-body text-lg text-earth/60">
            Start exploring the Quadrant and add bottles to your personal hunt list.
          </p>
          <Link
            href={ss("/quadrant")}
            className="inline-block rounded-xl bg-terracotta px-8 py-4 font-heading font-medium text-white transition-colors hover:bg-terracotta/80"
          >
            Explore the Quadrant
          </Link>
        </div>
      </div>
    );
  }

  const selectedIsUs = selectedMezcal?.market === "us" || selectedMezcal?.market === "both";

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <div className="relative overflow-hidden bg-earth py-16 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-terracotta blur-3xl" />
          <div className="absolute right-0 bottom-0 size-96 translate-x-1/2 translate-y-1/2 rounded-full bg-sage blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6">
          <Link
            href={ss("/quadrant")}
            className="mb-6 inline-flex items-center gap-2 text-terracotta transition-colors hover:text-coral"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to Quadrant
          </Link>
          <div className="mb-4 flex items-center gap-4">
            <Heart aria-hidden="true" className="size-10 shrink-0 fill-terracotta text-terracotta" />
            <h1 className="font-display text-5xl text-terracotta md:text-6xl">My Hunt List</h1>
          </div>
          <p className="max-w-2xl font-body text-xl text-white/80">
            {favoriteMezcals.length} extraordinary {favoriteMezcals.length === 1 ? "bottle" : "bottles"} on your quest.
            Time to hunt.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="border-b border-earth/10 bg-white py-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-8">
              <div className="text-center">
                <div className="font-display text-3xl text-terracotta">{favoriteMezcals.length}</div>
                <div className="font-heading text-sm text-earth/60">Bottles</div>
              </div>
              <div className="text-center">
                <div className="font-display text-3xl text-sage">${totalEstimatedCost}</div>
                <div className="font-heading text-sm text-earth/60">Est. Total</div>
              </div>
              <div className="text-center">
                <div className="font-display text-3xl text-earth">{usMarket.length}</div>
                <div className="font-heading text-sm text-earth/60">US Market</div>
              </div>
              <div className="text-center">
                <div className="font-display text-3xl text-earth">{mexicoMarket.length}</div>
                <div className="font-heading text-sm text-earth/60">Mexico</div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={copyToClipboard}
                className="flex items-center gap-2 rounded-lg bg-earth/10 px-4 py-2 font-heading text-sm text-earth transition-colors hover:bg-earth/20"
              >
                <Share2 aria-hidden="true" className="size-4" />
                Copy List
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-2 rounded-lg bg-red-100 px-4 py-2 font-heading text-sm text-red-600 transition-colors hover:bg-red-200"
              >
                <Trash2 aria-hidden="true" className="size-4" />
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottle List */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        {usMarket.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 flex items-center gap-3 font-display text-2xl text-earth">
              <MapPin aria-hidden="true" className="size-6 shrink-0 text-amber-500" />
              Hunt in the US ({usMarket.length})
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {usMarket.map((mezcal) => (
                <HuntCard key={mezcal.id} mezcal={mezcal} onOpen={setSelectedMezcal} onRemove={removeFavorite} />
              ))}
            </div>
            <div className="mt-6">
              <Link
                href={ss("/us-hunt")}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-heading font-medium text-white transition-colors hover:bg-amber-600"
              >
                <ExternalLink aria-hidden="true" className="size-5" />
                Open US Hunt Guide
              </Link>
            </div>
          </div>
        )}

        {mexicoMarket.length > 0 && (
          <div>
            <h2 className="mb-6 flex items-center gap-3 font-display text-2xl text-earth">
              <MapPin aria-hidden="true" className="size-6 shrink-0 text-emerald-600" />
              Source in Mexico ({mexicoMarket.length})
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mexicoMarket.map((mezcal) => (
                <HuntCard key={mezcal.id} mezcal={mezcal} onOpen={setSelectedMezcal} onRemove={removeFavorite} />
              ))}
            </div>
            <div className="mt-6">
              <Link
                href={ss("/mexico-source")}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-heading font-medium text-white transition-colors hover:bg-emerald-700"
              >
                <ExternalLink aria-hidden="true" className="size-5" />
                Open Mexico Source Guide
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setShowClearConfirm(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Clear Hunt List?"
            className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-4 font-display text-2xl text-earth">Clear Hunt List?</h3>
            <p className="mb-6 font-body text-earth/70">
              This will remove all {favoriteMezcals.length} bottles from your hunt list. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 rounded-xl bg-earth/10 py-3 font-heading font-medium text-earth transition-colors hover:bg-earth/20"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  clearFavorites();
                  setShowClearConfirm(false);
                }}
                className="flex-1 rounded-xl bg-red-500 py-3 font-heading font-medium text-white transition-colors hover:bg-red-600"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedMezcal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedMezcal(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedMezcal.brand} ${selectedMezcal.name}`}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 rounded-t-2xl bg-earth p-6 text-white">
              <button
                type="button"
                aria-label="Close"
                onClick={() => setSelectedMezcal(null)}
                className="absolute top-4 right-4 rounded-full p-2 transition-colors hover:bg-white/10"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
              <div className="mb-1 font-heading text-sm text-terracotta">{selectedMezcal.brand}</div>
              <h2 className="font-display text-3xl text-terracotta">{selectedMezcal.name}</h2>
              <p className="mt-1 font-body text-white/70">
                {selectedMezcal.agave} · {selectedMezcal.region}
              </p>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-sage/20 p-4 text-center">
                  <div className="font-display text-3xl text-sage">{selectedMezcal.evi.toFixed(1)}</div>
                  <div className="font-heading text-sm text-earth/60">Value Index (EVI)</div>
                </div>
                <div className="rounded-xl bg-terracotta/20 p-4 text-center">
                  <div className="font-display text-3xl text-terracotta">{selectedMezcal.eei.toFixed(1)}</div>
                  <div className="font-heading text-sm text-earth/60">Experience Index (EEI)</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 font-body text-sm">
                <div>
                  <span className="text-earth/50">Producer:</span>
                  <span className="ml-2 text-earth">{selectedMezcal.producer}</span>
                </div>
                <div>
                  <span className="text-earth/50">Method:</span>
                  <span className="ml-2 text-earth capitalize">{selectedMezcal.method}</span>
                </div>
                <div>
                  <span className="text-earth/50">ABV:</span>
                  <span className="ml-2 text-earth">{selectedMezcal.abv}%</span>
                </div>
                <div>
                  <span className="text-earth/50">Price:</span>
                  <span className="ml-2 text-earth">${selectedMezcal.price}</span>
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-heading font-semibold text-earth">Flavor Profile</h3>
                <div className="space-y-2">
                  {flavorDimensions.map((dim) => {
                    const value = selectedMezcal.flavor[dim.key as FlavorAxis];
                    return (
                      <div key={dim.key} className="flex items-center gap-3">
                        <span className="w-24 font-body text-sm text-earth/60">{dim.label}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-earth/10">
                          <div
                            className="h-full rounded-full bg-linear-to-r from-terracotta to-sage transition-all"
                            // Bar length is the flavor score (runtime value).
                            style={{ width: `${value * 10}%` }}
                          />
                        </div>
                        <span className="w-6 font-heading text-sm font-medium text-earth">{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-heading font-semibold text-earth">Tasting Notes</h3>
                <p className="font-body text-earth/70">{selectedMezcal.tastingNotes}</p>
              </div>

              <div>
                <h3 className="mb-2 font-heading font-semibold text-earth">The Story</h3>
                <p className="font-body text-earth/70">{selectedMezcal.story}</p>
              </div>

              {selectedMezcal.whereToBuy && selectedMezcal.whereToBuy.length > 0 && (
                <div>
                  <h3 className="mb-2 font-heading font-semibold text-earth">Where to Find</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMezcal.whereToBuy.map((place) => (
                      <span key={place} className="rounded-full bg-sage/20 px-3 py-1 font-body text-sm text-earth">
                        {place}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3 border-t border-earth/10 pt-4">
                <button
                  type="button"
                  onClick={() => removeFavorite(selectedMezcal.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-100 py-3 font-heading font-medium text-red-600 transition-colors hover:bg-red-200"
                >
                  <Trash2 aria-hidden="true" className="size-5" />
                  Remove from List
                </button>
                <Link
                  href={selectedIsUs ? ss("/us-hunt") : ss("/mexico-source")}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-earth py-3 font-heading font-medium text-white transition-colors hover:bg-earth/80"
                >
                  <ExternalLink aria-hidden="true" className="size-5" />
                  {selectedIsUs ? "US Hunt Guide" : "Mexico Source Guide"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
