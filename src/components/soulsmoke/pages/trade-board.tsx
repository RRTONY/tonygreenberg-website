"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  ArrowLeft,
  ArrowLeftRight,
  DollarSign,
  Loader2,
  MapPin,
  MessageCircle,
  Package,
  Plus,
  Trash2,
  User,
  X,
} from "lucide-react";
import {
  createTradeListing,
  deleteTradeListing,
  listTradeListings,
  sendTradeMessage,
  type PublicTradeListing,
} from "@/app/soul-smoke/actions";
import { reach } from "@/lib/content/soulsmoke/reach";
import { ss } from "@/lib/content/soulsmoke/nav";

// Ported from the SoulSmoke app's client/src/pages/TradeBoard.tsx. Same board, form, guidelines
// and copy. As on Manus, the listings live in a shared database that every visitor sees: this
// site's Supabase (soulsmoke_trade_listings / soulsmoke_trade_messages, server actions in
// src/app/soul-smoke/actions.ts) instead of trpc.tradeBoard. Signed-in members (Supabase Auth
// instead of Manus OAuth) can list a bottle, delete their own listings and message a seller;
// everyone else sees the original "Sign in to list your bottles" box, which goes to /login. The
// seller's id never reaches the browser: the server marks each listing `isMine` instead. A
// message is emailed to the seller with the sender's address (the Manus app only stored it).

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

const CONDITIONS: Condition[] = ["sealed", "opened", "partial"];
const LISTING_TYPES: ListingType[] = ["trade", "sell", "both"];

// Client-side checks for the "List a Bottle" form (rule 6). createTradeListing checks again on the
// server. Optional fields accept an empty string (rule 17): Formik hands Yup "" as undefined.
const listingSchema = Yup.object({
  mezcalName: Yup.string().default("").trim().required("Add the mezcal's name."),
  producer: Yup.string().default(""),
  agaveType: Yup.string().default(""),
  abv: Yup.string().default(""),
  bottleSize: Yup.string().default(""),
  condition: Yup.mixed<Condition>().oneOf(CONDITIONS).required(),
  fillLevel: Yup.string().default(""),
  listingType: Yup.mixed<ListingType>().oneOf(LISTING_TYPES).required(),
  askingPrice: Yup.string()
    .default("")
    .trim()
    .matches(/^\d+$/, { message: "Use a whole dollar amount, like 150.", excludeEmptyString: true }),
  seekingBottles: Yup.string().default(""),
  description: Yup.string().default(""),
  location: Yup.string().default(""),
});

type ListingForm = Yup.InferType<typeof listingSchema>;

const emptyForm: ListingForm = {
  mezcalName: "",
  producer: "",
  agaveType: "",
  abv: "",
  bottleSize: "750ml",
  condition: "sealed",
  fillLevel: "100%",
  listingType: "both",
  askingPrice: "",
  seekingBottles: "",
  description: "",
  location: "",
};

const optional = (s: string) => (s.trim() ? s.trim() : undefined);

/** Mirrors the Manus server's tradeBoard.create input checks. Returns null when invalid. */
export function toTradeListing(form: ListingForm, now = new Date()): TradeListing | null {
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

const errorClass = "mt-1 text-sm text-red-300";

const SIGN_IN_HREF = `/login?next=${encodeURIComponent(ss("/trade-board"))}`;

export function TradeBoard() {
  const [listings, setListings] = useState<PublicTradeListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [boardError, setBoardError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [showMessageModal, setShowMessageModal] = useState<PublicTradeListing | null>(null);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [filter, setFilter] = useState<"all" | "trade" | "sell">("all");
  const id = useId();
  const fid = (name: string) => `${id}-${name}`;

  useEffect(() => {
    let live = true;
    reach(listTradeListings()).then((result) => {
      if (!live) return;
      if (result.ok) {
        setListings(result.data.listings);
        setSignedIn(result.data.signedIn);
      } else {
        setBoardError(result.error);
      }
      setLoading(false);
    });
    return () => {
      live = false;
    };
  }, []);

  const closeModals = () => {
    setShowCreateModal(false);
    setShowMessageModal(null);
  };

  useEffect(() => {
    if (!showCreateModal && !showMessageModal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModals();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showCreateModal, showMessageModal]);

  // A server answer saying the session ended: back to the sign-in box.
  const signedOut = () => {
    setSignedIn(false);
    closeModals();
  };

  const filteredListings = listings.filter((l) => {
    if (filter === "trade") return l.listingType === "trade" || l.listingType === "both";
    if (filter === "sell") return l.listingType === "sell" || l.listingType === "both";
    return true;
  });

  // Formik doesn't stop a second submit (e.g. Enter) while the first is still saving; this does.
  const savingListing = useRef(false);

  const createListing = async (values: ListingForm, { resetForm }: FormikHelpers<ListingForm>) => {
    const listing = toTradeListing(values);
    if (!listing || savingListing.current) return;
    savingListing.current = true;
    setCreating(true);
    setCreateError("");
    // The server makes the id and date; send everything else toTradeListing checked.
    const result = await reach(createTradeListing({
      mezcalName: listing.mezcalName,
      producer: listing.producer,
      agaveType: listing.agaveType,
      abv: listing.abv,
      bottleSize: listing.bottleSize,
      condition: listing.condition,
      fillLevel: listing.fillLevel,
      listingType: listing.listingType,
      askingPrice: listing.askingPrice,
      seekingBottles: listing.seekingBottles,
      description: listing.description,
      location: listing.location,
    }));
    savingListing.current = false;
    setCreating(false);
    if (result.ok) {
      setListings((prev) => [result.data, ...prev]);
      setShowCreateModal(false);
      resetForm();
    } else if (result.signedOut) {
      signedOut();
    } else {
      setCreateError(result.error);
    }
  };

  const deleteListing = async (listingId: string) => {
    setBoardError("");
    const result = await reach(deleteTradeListing(listingId));
    if (result.ok) setListings((prev) => prev.filter((l) => l.id !== listingId));
    else if (result.signedOut) signedOut();
    else setBoardError(result.error);
  };

  const openMessage = (listing: PublicTradeListing) => {
    setMessage("");
    setMessageError("");
    setShowMessageModal(listing);
  };

  const sendMessage = async () => {
    if (!showMessageModal || !message.trim() || sending) return;
    setSending(true);
    setMessageError("");
    const result = await reach(sendTradeMessage({ listingId: showMessageModal.id, message: message.trim() }));
    setSending(false);
    if (result.ok) {
      setShowMessageModal(null);
      setMessage("");
    } else if (result.signedOut) {
      signedOut();
    } else {
      setMessageError(result.error);
    }
  };

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
            {signedIn && (
              <button
                type="button"
                onClick={() => {
                  setCreateError("");
                  setShowCreateModal(true);
                }}
                className="flex shrink-0 items-center gap-2 rounded-lg bg-amber-600 px-6 py-3 font-medium transition-colors hover:bg-amber-500"
              >
                <Plus aria-hidden="true" className="size-5" />
                List a Bottle
              </button>
            )}
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

        {/* Not logged in message */}
        {!loading && !signedIn && !boardError && (
          <div className="mb-8 rounded-xl border border-amber-800/50 bg-amber-900/20 p-6 text-center">
            <p className="mb-4 text-amber-200">Sign in to list your bottles or contact sellers</p>
            <Link
              href={SIGN_IN_HREF}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-3 font-medium transition-colors hover:bg-amber-500"
            >
              Sign In to Trade
            </Link>
          </div>
        )}

        {boardError && (
          <p role="alert" className="mb-8 rounded-lg bg-red-400/10 p-4 text-center text-sm text-red-300">
            {boardError}
          </p>
        )}

        {/* Listings Grid */}
        {loading ? (
          <div className="flex justify-center py-16" role="status" aria-label="Loading listings">
            <Loader2 aria-hidden="true" className="size-8 animate-spin text-amber-400" />
          </div>
        ) : filteredListings.length === 0 ? (
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
                    {/* Sellers' names stay private here; "Anonymous" was the app's name for a seller without one. */}
                    <span>{listing.isMine ? "You" : "Anonymous"}</span>
                    {listing.location && (
                      <>
                        <MapPin aria-hidden="true" className="ml-2 size-3 shrink-0" />
                        <span>{listing.location}</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {signedIn && !listing.isMine && (
                      <button
                        type="button"
                        onClick={() => openMessage(listing)}
                        className="rounded-lg p-2 text-amber-400 transition-colors hover:bg-amber-400/10"
                        title="Contact seller"
                        aria-label={`Contact seller about ${listing.mezcalName}`}
                      >
                        <MessageCircle aria-hidden="true" className="size-5" />
                      </button>
                    )}
                    {listing.isMine && (
                      <button
                        type="button"
                        onClick={() => deleteListing(listing.id)}
                        className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-400/10"
                        title="Delete listing"
                        aria-label={`Delete listing for ${listing.mezcalName}`}
                      >
                        <Trash2 aria-hidden="true" className="size-5" />
                      </button>
                    )}
                  </div>
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
      {/* Formik sits outside the modal so a closed-but-unsaved listing keeps what was typed, as before. */}
      <Formik<ListingForm> initialValues={emptyForm} validationSchema={listingSchema} onSubmit={createListing}>
        {({ values, errors, touched, isSubmitting, setFieldValue }) =>
          showCreateModal && (
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
                <Form noValidate className="space-y-4 p-6">
                  <div>
                    <label htmlFor={fid("name")} className="mb-1 block text-sm text-gray-300">
                      Mezcal Name *
                    </label>
                    <Field
                      id={fid("name")}
                      type="text"
                      name="mezcalName"
                      className={fieldClass}
                      placeholder="e.g., Real Minero Largo"
                      required
                      aria-invalid={Boolean(touched.mezcalName && errors.mezcalName)}
                      aria-describedby={touched.mezcalName && errors.mezcalName ? fid("name-error") : undefined}
                    />
                    <ErrorMessage name="mezcalName">{(msg) => <p id={fid("name-error")} role="alert" className={errorClass}>{msg}</p>}</ErrorMessage>
                  </div>
                  {/* One column below sm: two and three across squeezed the fields at 375px on live (rule 20). */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor={fid("producer")} className="mb-1 block text-sm text-gray-300">
                        Producer
                      </label>
                      <Field
                        id={fid("producer")}
                        type="text"
                        name="producer"
                        className={fieldClass}
                        placeholder="e.g., Real Minero"
                      />
                    </div>
                    <div>
                      <label htmlFor={fid("agave")} className="mb-1 block text-sm text-gray-300">
                        Agave Type
                      </label>
                      <Field
                        id={fid("agave")}
                        type="text"
                        name="agaveType"
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
                      <Field
                        id={fid("abv")}
                        type="text"
                        name="abv"
                        className={fieldClass}
                        placeholder="e.g., 49%"
                      />
                    </div>
                    <div>
                      <label htmlFor={fid("size")} className="mb-1 block text-sm text-gray-300">
                        Bottle Size
                      </label>
                      <Field
                        as="select"
                        id={fid("size")}
                        name="bottleSize"
                        className={selectClass}
                      >
                        <option value="750ml">750ml</option>
                        <option value="375ml">375ml</option>
                        <option value="1L">1L</option>
                        <option value="200ml">200ml</option>
                      </Field>
                    </div>
                    <div>
                      <label htmlFor={fid("condition")} className="mb-1 block text-sm text-gray-300">
                        Condition
                      </label>
                      <Field
                        as="select"
                        id={fid("condition")}
                        name="condition"
                        className={selectClass}
                      >
                        <option value="sealed">Sealed</option>
                        <option value="opened">Opened</option>
                        <option value="partial">Partial</option>
                      </Field>
                    </div>
                  </div>
                  {values.condition !== "sealed" && (
                    <div>
                      <label htmlFor={fid("fill")} className="mb-1 block text-sm text-gray-300">
                        Fill Level
                      </label>
                      <Field
                        id={fid("fill")}
                        type="text"
                        name="fillLevel"
                        className={fieldClass}
                        placeholder="e.g., 90%, 75%"
                      />
                    </div>
                  )}
                  <div>
                    <label htmlFor={fid("type")} className="mb-1 block text-sm text-gray-300">
                      Listing Type
                    </label>
                    <Field
                      as="select"
                      id={fid("type")}
                      name="listingType"
                      className={selectClass}
                    >
                      <option value="both">Trade or Sell</option>
                      <option value="trade">Trade Only</option>
                      <option value="sell">For Sale Only</option>
                    </Field>
                  </div>
                  {(values.listingType === "sell" || values.listingType === "both") && (
                    <div>
                      <label htmlFor={fid("price")} className="mb-1 block text-sm text-gray-300">
                        Asking Price ($)
                      </label>
                      {/* Formik's own onChange turns a number input's text into a number; keep it a string. */}
                      <Field
                        id={fid("price")}
                        type="number"
                        min={0}
                        name="askingPrice"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setFieldValue("askingPrice", e.target.value)}
                        className={fieldClass}
                        placeholder="e.g., 150"
                        aria-invalid={Boolean(touched.askingPrice && errors.askingPrice)}
                        aria-describedby={touched.askingPrice && errors.askingPrice ? fid("price-error") : undefined}
                      />
                      <ErrorMessage name="askingPrice">{(msg) => <p id={fid("price-error")} role="alert" className={errorClass}>{msg}</p>}</ErrorMessage>
                    </div>
                  )}
                  {(values.listingType === "trade" || values.listingType === "both") && (
                    <div>
                      <label htmlFor={fid("seeking")} className="mb-1 block text-sm text-gray-300">
                        What are you seeking?
                      </label>
                      <Field
                        id={fid("seeking")}
                        type="text"
                        name="seekingBottles"
                        className={fieldClass}
                        placeholder="e.g., Any Real Minero, Fane Kantsini expressions"
                      />
                    </div>
                  )}
                  <div>
                    <label htmlFor={fid("location")} className="mb-1 block text-sm text-gray-300">
                      Location
                    </label>
                    <Field
                      id={fid("location")}
                      type="text"
                      name="location"
                      className={fieldClass}
                      placeholder="e.g., Los Angeles, CA"
                    />
                  </div>
                  <div>
                    <label htmlFor={fid("notes")} className="mb-1 block text-sm text-gray-300">
                      Additional Notes
                    </label>
                    <Field
                      as="textarea"
                      id={fid("notes")}
                      name="description"
                      className={`${fieldClass} resize-none`}
                      rows={3}
                      placeholder="Any additional details about the bottle..."
                    />
                  </div>
                  {createError && (
                    <p role="alert" className="text-sm text-red-300">
                      {createError}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting || creating}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 py-4 font-medium transition-colors hover:bg-amber-500 disabled:bg-gray-700"
                  >
                    {(isSubmitting || creating) && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
                    Create Listing
                  </button>
                </Form>
              </div>
            </div>
          )
        }
      </Formik>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={fid("message-title")}
            className="w-full max-w-md rounded-2xl bg-[#1a1a1a]"
          >
            <div className="flex items-center justify-between border-b border-white/10 p-6">
              <div className="min-w-0">
                <h2 id={fid("message-title")} className="font-serif text-xl text-amber-400">
                  Contact Seller
                </h2>
                <p className="mt-1 text-sm wrap-break-word text-gray-400">About: {showMessageModal.mezcalName}</p>
              </div>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setShowMessageModal(null)}
                className="p-2 text-gray-300 hover:text-white"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <div className="p-6">
              <label htmlFor={fid("message")} className="sr-only">
                Message
              </label>
              <textarea
                id={fid("message")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={`${fieldClass} resize-none`}
                rows={4}
                placeholder="Hi, I'm interested in this bottle..."
              />
              <p className="mt-2 text-xs text-gray-400">
                The seller gets your message and your email address so they can reply.
              </p>
              {messageError && (
                <p role="alert" className="mt-2 text-sm text-red-300">
                  {messageError}
                </p>
              )}
              <button
                type="button"
                onClick={sendMessage}
                disabled={!message.trim() || sending}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 py-3 font-medium transition-colors hover:bg-amber-500 disabled:bg-gray-700"
              >
                {sending && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
