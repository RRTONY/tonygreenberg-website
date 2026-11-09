"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowLeftRight, DollarSign, MapPin, Package, Plus, Trash2, User, X } from "lucide-react";
import { useLocalStore } from "@/components/soulsmoke/hooks/use-local-store";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/TradeBoard.tsx. Same board, form, guidelines
// and copy. On Manus the listings lived in a shared database (trpc.tradeBoard) that every
// visitor saw, and signed-in visitors could message a seller. There is no shared database or
// account here yet (owner to decide), so:
// - "List a Bottle" works for everyone and saves the listing in the visitor's own browser
//   ("soulsmoke-trade-listings"), with the server's fields and checks; the board shows those.
// - Contacting a seller (the message button and its modal) is not carried over: a message has
//   to reach another visitor, which needs the shared database. It returns with that database.
// - The "Sign in to list your bottles" box is gone (no sign-in).

type Condition = "sealed" | "opened" | "partial";
type ListingType = "trade" | "sell" | "both";

export type TradeListing = {
  id: string;
  mezcalName: string;
  producer?: string;
  agaveType?: string;
  abv?: string;
  bottleSize?: string;
  condition: Condition;
  fillLevel?: string;
  listingType: ListingType;
  /** In cents, like the Manus app's trade_listings.askingPrice. */
  askingPrice?: number;
  seekingBottles?: string;
  description?: string;
  location?: string;
  createdAt: string;
};

export const TRADE_LISTINGS_KEY = "soulsmoke-trade-listings";
const NO_LISTINGS: TradeListing[] = [];
const CONDITIONS: Condition[] = ["sealed", "opened", "partial"];
const LISTING_TYPES: ListingType[] = ["trade", "sell", "both"];

const emptyForm = {
  mezcalName: "",
  producer: "",
  agaveType: "",
  abv: "",
  bottleSize: "750ml",
  condition: "sealed" as Condition,
  fillLevel: "100%",
  listingType: "both" as ListingType,
  askingPrice: "",
  seekingBottles: "",
  description: "",
  location: "",
};

const optional = (s: string) => (s.trim() ? s.trim() : undefined);

/** Mirrors the Manus server's tradeBoard.create input checks. Returns null when invalid. */
export function toTradeListing(form: typeof emptyForm, now = new Date()): TradeListing | null {
  const mezcalName = form.mezcalName.trim();
  if (!mezcalName) return null;
  if (!CONDITIONS.includes(form.condition) || !LISTING_TYPES.includes(form.listingType)) return null;
  const dollars = parseInt(form.askingPrice, 10);
  return {
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
    mezcalName,
    producer: optional(form.producer),
    agaveType: optional(form.agaveType),
    abv: optional(form.abv),
    bottleSize: optional(form.bottleSize),
    condition: form.condition,
    fillLevel: optional(form.fillLevel),
    listingType: form.listingType,
    askingPrice: form.askingPrice && Number.isFinite(dollars) ? dollars * 100 : undefined,
    seekingBottles: optional(form.seekingBottles),
    description: optional(form.description),
    location: optional(form.location),
    createdAt: now.toISOString(),
  };
}

const getListingTypeIcon = (type: string) => {
  switch (type) {
    case "trade":
      return <ArrowLeftRight aria-hidden="true" className="size-4" />;
    case "sell":
      return <DollarSign aria-hidden="true" className="size-4" />;
    default:
      return <Package aria-hidden="true" className="size-4" />;
  }
};

const getListingTypeLabel = (type: string) => {
  switch (type) {
    case "trade":
      return "Trade Only";
    case "sell":
      return "For Sale";
    default:
      return "Trade or Sell";
  }
};

const getConditionColor = (condition: string) => {
  switch (condition) {
    case "sealed":
      return "flex items-center gap-1 rounded bg-emerald-400/10 px-2 py-1 text-xs text-emerald-400";
    case "opened":
      return "flex items-center gap-1 rounded bg-amber-400/10 px-2 py-1 text-xs text-amber-400";
    default:
      return "flex items-center gap-1 rounded bg-red-400/10 px-2 py-1 text-xs text-red-400";
  }
};

const fieldClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-amber-500 focus:outline-none";
// Native dropdown lists ignore the translucent field color, so give the options a solid one.
const selectClass = `${fieldClass} *:bg-[#1a1a1a]`;

export function TradeBoard() {
  const [listings, setListings] = useLocalStore<TradeListing[]>(TRADE_LISTINGS_KEY, NO_LISTINGS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "trade" | "sell">("all");
  const [formData, setFormData] = useState(emptyForm);
  const id = useId();
  const fid = (name: string) => `${id}-${name}`;

  useEffect(() => {
    if (!showCreateModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowCreateModal(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showCreateModal]);

  const filteredListings = listings.filter((l) => {
    if (filter === "trade") return l.listingType === "trade" || l.listingType === "both";
    if (filter === "sell") return l.listingType === "sell" || l.listingType === "both";
    return true;
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const listing = toTradeListing(formData);
    if (!listing) return;
    setListings((prev) => [listing, ...prev]);
    setShowCreateModal(false);
    setFormData(emptyForm);
  };

  const deleteListing = (listingId: string) => setListings((prev) => prev.filter((l) => l.id !== listingId));

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-20 text-white">
      {/* Header */}
      <div className="border-b border-amber-900/30 bg-black py-12">
        <div className="mx-auto max-w-6xl px-6">
          <Link
            href={ss("/")}
            className="mb-6 inline-flex items-center gap-2 text-amber-400 transition-colors hover:text-amber-300"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to Home
          </Link>
          {/* Stacks below sm so the button doesn't squeeze the heading at 375px (rule 20). */}
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
            <div>
              <h1 className="mb-4 font-serif text-4xl text-amber-400 md:text-5xl">Trade Board</h1>
              <p className="max-w-2xl text-xl text-gray-300">
                Connect with fellow collectors to trade or sell rare bottles. No middlemen, no markups—just mezcal
                lovers helping each other.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-amber-600 px-6 py-3 font-medium transition-colors hover:bg-amber-500"
            >
              <Plus aria-hidden="true" className="size-5" />
              List a Bottle
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* Filters (wrap at 375px, where the row ran off the screen on live) */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <span className="text-sm text-gray-400">Filter:</span>
          <div className="flex flex-wrap gap-2">
            {(["all", "trade", "sell"] as const).map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={
                  filter === f
                    ? "rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors"
                    : "rounded-lg bg-white/5 px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10"
                }
              >
                {f === "all" ? "All Listings" : f === "trade" ? "For Trade" : "For Sale"}
              </button>
            ))}
          </div>
          <span className="ml-auto text-sm text-gray-400">
            {filteredListings.length} listing{filteredListings.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="py-16 text-center">
            <Package aria-hidden="true" className="mx-auto mb-4 size-16 text-gray-700" />
            <p className="text-lg text-gray-400">No listings yet</p>
            <p className="mt-2 text-sm text-gray-400">Be the first to list a bottle!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredListings.map((listing) => (
              <div
                key={listing.id}
                className="rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-amber-600/30"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="mb-1 font-serif text-xl wrap-break-word text-white">{listing.mezcalName}</h3>
                    {listing.producer && <p className="text-sm text-amber-400">{listing.producer}</p>}
                  </div>
                  <span className={getConditionColor(listing.condition)}>{listing.condition}</span>
                </div>

                <div className="mb-4 space-y-2 text-sm">
                  {listing.agaveType && (
                    <p className="text-gray-300">
                      <span className="text-gray-400">Agave:</span> {listing.agaveType}
                    </p>
                  )}
                  <div className="flex items-center gap-4">
                    {listing.abv && (
                      <p className="text-gray-300">
                        <span className="text-gray-400">ABV:</span> {listing.abv}
                      </p>
                    )}
                    {listing.bottleSize && (
                      <p className="text-gray-300">
                        <span className="text-gray-400">Size:</span> {listing.bottleSize}
                      </p>
                    )}
                  </div>
                  {listing.fillLevel && listing.condition !== "sealed" && (
                    <p className="text-gray-300">
                      <span className="text-gray-400">Fill:</span> {listing.fillLevel}
                    </p>
                  )}
                </div>

                <div className="mb-4 flex items-center gap-3">
                  <span className="flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-xs text-gray-200">
                    {getListingTypeIcon(listing.listingType)}
                    {getListingTypeLabel(listing.listingType)}
                  </span>
                  {listing.askingPrice && (listing.listingType === "sell" || listing.listingType === "both") ? (
                    <span className="font-medium text-emerald-400">${(listing.askingPrice / 100).toFixed(0)}</span>
                  ) : null}
                </div>

                {listing.seekingBottles && (listing.listingType === "trade" || listing.listingType === "both") && (
                  <div className="mb-4 rounded-lg bg-white/5 p-3">
                    <p className="mb-1 text-xs text-gray-400">SEEKING</p>
                    <p className="text-sm text-gray-200">{listing.seekingBottles}</p>
                  </div>
                )}

                {listing.description && <p className="mb-4 line-clamp-2 text-sm text-gray-300">{listing.description}</p>}

                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="flex min-w-0 flex-wrap items-center gap-2 text-sm text-gray-400">
                    <User aria-hidden="true" className="size-4 shrink-0" />
                    {/* Every listing here is the visitor's own; "Anonymous" was the app's name for a seller without one. */}
                    <span>Anonymous</span>
                    {listing.location && (
                      <>
                        <MapPin aria-hidden="true" className="ml-2 size-3 shrink-0" />
                        <span>{listing.location}</span>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteListing(listing.id)}
                    className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-400/10"
                    title="Delete listing"
                    aria-label={`Delete listing for ${listing.mezcalName}`}
                  >
                    <Trash2 aria-hidden="true" className="size-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Guidelines */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="mb-6 font-serif text-2xl text-amber-400">Trading Guidelines</h2>
          <div className="grid gap-8 text-sm text-gray-300 md:grid-cols-2">
            <div>
              <h3 className="mb-3 font-medium text-white">For Sellers</h3>
              <ul className="space-y-2">
                <li>• Be honest about bottle condition and fill level</li>
                <li>• Include clear photos if requested</li>
                <li>• Price fairly based on current market value</li>
                <li>• Ship securely with proper packaging</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-medium text-white">For Buyers</h3>
              <ul className="space-y-2">
                <li>• Verify authenticity before purchasing</li>
                <li>• Use secure payment methods</li>
                <li>• Meet locally when possible for high-value trades</li>
                <li>• Report any issues to the community</li>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-xs text-gray-400">
            SoulSmoke facilitates connections but is not responsible for transactions. Trade at your own risk.
          </p>
        </div>
      </div>

      {/* Create Listing Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={fid("title")}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-[#1a1a1a]"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <h2 id={fid("title")} className="font-serif text-2xl text-amber-400">
                List a Bottle
              </h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-300 hover:text-white"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <div>
                <label htmlFor={fid("name")} className="mb-1 block text-sm text-gray-300">
                  Mezcal Name *
                </label>
                <input
                  id={fid("name")}
                  type="text"
                  value={formData.mezcalName}
                  onChange={(e) => setFormData({ ...formData, mezcalName: e.target.value })}
                  className={fieldClass}
                  placeholder="e.g., Real Minero Largo"
                  required
                />
              </div>
              {/* One column below sm: two and three across squeezed the fields at 375px on live (rule 20). */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={fid("producer")} className="mb-1 block text-sm text-gray-300">
                    Producer
                  </label>
                  <input
                    id={fid("producer")}
                    type="text"
                    value={formData.producer}
                    onChange={(e) => setFormData({ ...formData, producer: e.target.value })}
                    className={fieldClass}
                    placeholder="e.g., Real Minero"
                  />
                </div>
                <div>
                  <label htmlFor={fid("agave")} className="mb-1 block text-sm text-gray-300">
                    Agave Type
                  </label>
                  <input
                    id={fid("agave")}
                    type="text"
                    value={formData.agaveType}
                    onChange={(e) => setFormData({ ...formData, agaveType: e.target.value })}
                    className={fieldClass}
                    placeholder="e.g., Largo"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor={fid("abv")} className="mb-1 block text-sm text-gray-300">
                    ABV
                  </label>
                  <input
                    id={fid("abv")}
                    type="text"
                    value={formData.abv}
                    onChange={(e) => setFormData({ ...formData, abv: e.target.value })}
                    className={fieldClass}
                    placeholder="e.g., 49%"
                  />
                </div>
                <div>
                  <label htmlFor={fid("size")} className="mb-1 block text-sm text-gray-300">
                    Bottle Size
                  </label>
                  <select
                    id={fid("size")}
                    value={formData.bottleSize}
                    onChange={(e) => setFormData({ ...formData, bottleSize: e.target.value })}
                    className={selectClass}
                  >
                    <option value="750ml">750ml</option>
                    <option value="375ml">375ml</option>
                    <option value="1L">1L</option>
                    <option value="200ml">200ml</option>
                  </select>
                </div>
                <div>
                  <label htmlFor={fid("condition")} className="mb-1 block text-sm text-gray-300">
                    Condition
                  </label>
                  <select
                    id={fid("condition")}
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value as Condition })}
                    className={selectClass}
                  >
                    <option value="sealed">Sealed</option>
                    <option value="opened">Opened</option>
                    <option value="partial">Partial</option>
                  </select>
                </div>
              </div>
              {formData.condition !== "sealed" && (
                <div>
                  <label htmlFor={fid("fill")} className="mb-1 block text-sm text-gray-300">
                    Fill Level
                  </label>
                  <input
                    id={fid("fill")}
                    type="text"
                    value={formData.fillLevel}
                    onChange={(e) => setFormData({ ...formData, fillLevel: e.target.value })}
                    className={fieldClass}
                    placeholder="e.g., 90%, 75%"
                  />
                </div>
              )}
              <div>
                <label htmlFor={fid("type")} className="mb-1 block text-sm text-gray-300">
                  Listing Type
                </label>
                <select
                  id={fid("type")}
                  value={formData.listingType}
                  onChange={(e) => setFormData({ ...formData, listingType: e.target.value as ListingType })}
                  className={selectClass}
                >
                  <option value="both">Trade or Sell</option>
                  <option value="trade">Trade Only</option>
                  <option value="sell">For Sale Only</option>
                </select>
              </div>
              {(formData.listingType === "sell" || formData.listingType === "both") && (
                <div>
                  <label htmlFor={fid("price")} className="mb-1 block text-sm text-gray-300">
                    Asking Price ($)
                  </label>
                  <input
                    id={fid("price")}
                    type="number"
                    min={0}
                    value={formData.askingPrice}
                    onChange={(e) => setFormData({ ...formData, askingPrice: e.target.value })}
                    className={fieldClass}
                    placeholder="e.g., 150"
                  />
                </div>
              )}
              {(formData.listingType === "trade" || formData.listingType === "both") && (
                <div>
                  <label htmlFor={fid("seeking")} className="mb-1 block text-sm text-gray-300">
                    What are you seeking?
                  </label>
                  <input
                    id={fid("seeking")}
                    type="text"
                    value={formData.seekingBottles}
                    onChange={(e) => setFormData({ ...formData, seekingBottles: e.target.value })}
                    className={fieldClass}
                    placeholder="e.g., Any Real Minero, Fane Kantsini expressions"
                  />
                </div>
              )}
              <div>
                <label htmlFor={fid("location")} className="mb-1 block text-sm text-gray-300">
                  Location
                </label>
                <input
                  id={fid("location")}
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className={fieldClass}
                  placeholder="e.g., Los Angeles, CA"
                />
              </div>
              <div>
                <label htmlFor={fid("notes")} className="mb-1 block text-sm text-gray-300">
                  Additional Notes
                </label>
                <textarea
                  id={fid("notes")}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`${fieldClass} resize-none`}
                  rows={3}
                  placeholder="Any additional details about the bottle..."
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-amber-600 py-4 font-medium transition-colors hover:bg-amber-500 disabled:bg-gray-700"
              >
                Create Listing
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
