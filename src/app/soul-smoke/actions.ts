"use server";

import { getUser } from "@/lib/auth";
import { createServiceRoleClient, isServiceRoleConfigured } from "@/lib/supabase/service-role";
import { esc, sendEmail } from "@/lib/email";
import type { TastingEntry } from "@/components/soulsmoke/pages/tasting-journal";
import type { PriceAlert } from "@/components/soulsmoke/pages/price-tracker";
import type { TradeListing } from "@/components/soulsmoke/pages/trade-board";
import type { BusinessType, StoredBusinessProfile } from "@/components/soulsmoke/pages/business-profile";
import type { BottleInterestType } from "@/components/soulsmoke/want-bottle-modal";

// SoulSmoke's member features, ported from the Manus app's tRPC routers
// (tastingJournal, priceAlerts, tradeBoard, leadGen) onto this site's Supabase
// (tables: supabase/migrations/0007_soulsmoke.sql). As on SoulSmoke, writing
// needs a signed-in member (Supabase Auth replaces Manus OAuth); the Trade
// Board and the bottle demand counts are public. Every query is scoped to the
// signed-in member here on the server, so ids and emails never reach another
// visitor's browser. Tony gets an email for each new business profile and
// "I want this bottle", as the Manus app's notifyOwner did.

const OWNER_EMAIL = "tony@tonygreenberg.com";
const SITE = "https://tonygreenberg.com";
const UNAVAILABLE = "This couldn't be saved just now. Please try again in a minute.";
const SIGN_IN = "Please sign in first.";

export type SoulsmokeResult<T = null> = { ok: true; data: T } | { ok: false; error: string; signedOut?: boolean };

const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const orNull = (s: string) => s || null;
const level = (v: unknown) => (typeof v === "number" && Number.isInteger(v) && v >= 1 && v <= 5 ? v : null);
const cents = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? Math.round(v) : null);
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const idOf = (v: unknown) => (typeof v === "string" && /^\d{1,18}$/.test(v) ? v : null);

type Member = { id: string; email: string | null };

// The signed-in member and a service-role client, or the error to show.
async function member(): Promise<{ user: Member; db: ReturnType<typeof createServiceRoleClient> } | { error: SoulsmokeResult<never> }> {
  if (!isServiceRoleConfigured()) return { error: { ok: false, error: UNAVAILABLE } };
  const user = await getUser();
  if (!user) return { error: { ok: false, error: SIGN_IN, signedOut: true } };
  return { user: { id: user.id, email: user.email ?? null }, db: createServiceRoleClient() };
}

// At most `limit` new rows per member in `table` per 10 minutes.
async function flooded(db: ReturnType<typeof createServiceRoleClient>, table: string, userId: string, limit: number) {
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count } = await db.from(table).select("id", { count: "exact", head: true }).eq("user_id", userId).gte("created_at", since);
  return (count ?? 0) >= limit;
}

const TOO_MANY = "That's a lot at once. Please wait a few minutes.";

function fail(where: string, message: string): SoulsmokeResult<never> {
  console.error(`[soulsmoke] ${where}:`, message);
  return { ok: false, error: UNAVAILABLE };
}

function emailTable(intro: string, rows: [string, string | null | undefined][], link: string): string {
  const body = rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;color:#666;white-space:nowrap">${esc(k)}</td><td style="padding:6px 0;white-space:pre-wrap">${esc(v as string)}</td></tr>`,
    )
    .join("");
  return `<p>${esc(intro)}</p><table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">${body}</table><p><a href="${SITE}${link}">${SITE}${link}</a></p>`;
}

/** Whether a member is signed in (pages show SoulSmoke's "Sign in" box when not). */
export async function getSoulsmokeMember(): Promise<{ signedIn: boolean }> {
  return { signedIn: Boolean(await getUser()) };
}

// ── Tasting journal ──

type TastingRow = {
  id: number;
  mezcal_name: string;
  producer: string | null;
  agave_type: string | null;
  region: string | null;
  abv: string | null;
  rating: number | null;
  notes: string | null;
  smoke_level: number | null;
  sweetness_level: number | null;
  complexity_level: number | null;
  would_buy_again: boolean;
  tasted_at: string;
};

const toEntry = (r: TastingRow): TastingEntry => ({
  id: String(r.id),
  mezcalName: r.mezcal_name,
  producer: r.producer ?? undefined,
  agaveType: r.agave_type ?? undefined,
  region: r.region ?? undefined,
  abv: r.abv ?? undefined,
  rating: r.rating ?? undefined,
  notes: r.notes ?? undefined,
  smokeLevel: r.smoke_level ?? undefined,
  sweetnessLevel: r.sweetness_level ?? undefined,
  complexityLevel: r.complexity_level ?? undefined,
  wouldBuyAgain: r.would_buy_again,
  tastedAt: r.tasted_at,
});

export async function listTastingEntries(): Promise<SoulsmokeResult<TastingEntry[]>> {
  const m = await member();
  if ("error" in m) return m.error;
  const { data, error } = await m.db
    .from("soulsmoke_tasting_entries")
    .select("*")
    .eq("user_id", m.user.id)
    .order("tasted_at", { ascending: false })
    .limit(500);
  if (error) return fail("list tasting", error.message);
  return { ok: true, data: (data as TastingRow[]).map(toEntry) };
}

export async function addTastingEntry(input: Omit<TastingEntry, "id" | "tastedAt">): Promise<SoulsmokeResult<TastingEntry>> {
  const mezcalName = clip(input.mezcalName, 255);
  if (!mezcalName) return { ok: false, error: "Mezcal name is required" };
  const m = await member();
  if ("error" in m) return m.error;
  if (await flooded(m.db, "soulsmoke_tasting_entries", m.user.id, 30)) return { ok: false, error: TOO_MANY };
  const { data, error } = await m.db
    .from("soulsmoke_tasting_entries")
    .insert({
      user_id: m.user.id,
      mezcal_name: mezcalName,
      producer: orNull(clip(input.producer, 255)),
      agave_type: orNull(clip(input.agaveType, 100)),
      region: orNull(clip(input.region, 255)),
      abv: orNull(clip(input.abv, 10)),
      rating: level(input.rating),
      notes: orNull(clip(input.notes, 5000)),
      smoke_level: level(input.smokeLevel),
      sweetness_level: level(input.sweetnessLevel),
      complexity_level: level(input.complexityLevel),
      would_buy_again: input.wouldBuyAgain === true,
    })
    .select("*")
    .single();
  if (error) return fail("add tasting", error.message);
  return { ok: true, data: toEntry(data as TastingRow) };
}

export async function deleteTastingEntry(id: string): Promise<SoulsmokeResult> {
  const rowId = idOf(id);
  if (!rowId) return { ok: false, error: UNAVAILABLE };
  const m = await member();
  if ("error" in m) return m.error;
  const { error } = await m.db.from("soulsmoke_tasting_entries").delete().eq("id", rowId).eq("user_id", m.user.id);
  if (error) return fail("delete tasting", error.message);
  return { ok: true, data: null };
}

// ── Price alerts ──

type AlertRow = { id: number; mezcal_name: string; target_price: number | null; created_at: string };
const toAlert = (r: AlertRow): PriceAlert => ({
  id: String(r.id),
  mezcalName: r.mezcal_name,
  targetPrice: r.target_price,
  createdAt: r.created_at,
});

export async function listPriceAlerts(): Promise<SoulsmokeResult<PriceAlert[]>> {
  const m = await member();
  if ("error" in m) return m.error;
  const { data, error } = await m.db
    .from("soulsmoke_price_alerts")
    .select("id, mezcal_name, target_price, created_at")
    .eq("user_id", m.user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return fail("list alerts", error.message);
  return { ok: true, data: (data as AlertRow[]).map(toAlert) };
}

/** `targetPrice` is in cents, like the Manus app's price_alerts.targetPrice. */
export async function addPriceAlert(input: { mezcalName: string; targetPrice: number | null }): Promise<SoulsmokeResult<PriceAlert>> {
  const mezcalName = clip(input.mezcalName, 255);
  if (!mezcalName) return { ok: false, error: "Mezcal name is required" };
  const m = await member();
  if ("error" in m) return m.error;
  if (await flooded(m.db, "soulsmoke_price_alerts", m.user.id, 30)) return { ok: false, error: TOO_MANY };
  const { data, error } = await m.db
    .from("soulsmoke_price_alerts")
    .insert({ user_id: m.user.id, mezcal_name: mezcalName, target_price: cents(input.targetPrice) })
    .select("id, mezcal_name, target_price, created_at")
    .single();
  if (error) return fail("add alert", error.message);
  return { ok: true, data: toAlert(data as AlertRow) };
}

export async function deletePriceAlert(id: string): Promise<SoulsmokeResult> {
  const rowId = idOf(id);
  if (!rowId) return { ok: false, error: UNAVAILABLE };
  const m = await member();
  if ("error" in m) return m.error;
  const { error } = await m.db.from("soulsmoke_price_alerts").delete().eq("id", rowId).eq("user_id", m.user.id);
  if (error) return fail("delete alert", error.message);
  return { ok: true, data: null };
}

// ── Trade Board ──

const CONDITIONS = ["sealed", "opened", "partial"] as const;
const LISTING_TYPES = ["trade", "sell", "both"] as const;

type ListingRow = {
  id: number;
  user_id: string;
  mezcal_name: string;
  producer: string | null;
  agave_type: string | null;
  abv: string | null;
  bottle_size: string | null;
  condition: TradeListing["condition"];
  fill_level: string | null;
  listing_type: TradeListing["listingType"];
  asking_price: number | null;
  seeking_bottles: string | null;
  description: string | null;
  location: string | null;
  created_at: string;
};

/** A listing as any visitor sees it. `isMine` replaces the owner id, which never leaves the server. */
export type PublicTradeListing = TradeListing & { isMine: boolean };

const toListing = (r: ListingRow, me: string | null): PublicTradeListing => ({
  id: String(r.id),
  mezcalName: r.mezcal_name,
  producer: r.producer ?? undefined,
  agaveType: r.agave_type ?? undefined,
  abv: r.abv ?? undefined,
  bottleSize: r.bottle_size ?? undefined,
  condition: r.condition,
  fillLevel: r.fill_level ?? undefined,
  listingType: r.listing_type,
  askingPrice: r.asking_price ?? undefined,
  seekingBottles: r.seeking_bottles ?? undefined,
  description: r.description ?? undefined,
  location: r.location ?? undefined,
  createdAt: r.created_at,
  isMine: me !== null && r.user_id === me,
});

/** Every active listing, newest first (public, like tradeBoard.list). */
export async function listTradeListings(): Promise<SoulsmokeResult<{ listings: PublicTradeListing[]; signedIn: boolean }>> {
  if (!isServiceRoleConfigured()) return { ok: false, error: UNAVAILABLE };
  const user = await getUser();
  const { data, error } = await createServiceRoleClient()
    .from("soulsmoke_trade_listings")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) return fail("list listings", error.message);
  return { ok: true, data: { listings: (data as ListingRow[]).map((r) => toListing(r, user?.id ?? null)), signedIn: Boolean(user) } };
}

export async function createTradeListing(input: Omit<TradeListing, "id" | "createdAt">): Promise<SoulsmokeResult<PublicTradeListing>> {
  const mezcalName = clip(input.mezcalName, 255);
  if (!mezcalName) return { ok: false, error: "Mezcal name is required" };
  const condition = CONDITIONS.includes(input.condition) ? input.condition : "sealed";
  const listingType = LISTING_TYPES.includes(input.listingType) ? input.listingType : "both";
  const m = await member();
  if ("error" in m) return m.error;
  if (await flooded(m.db, "soulsmoke_trade_listings", m.user.id, 10)) return { ok: false, error: TOO_MANY };
  const { data, error } = await m.db
    .from("soulsmoke_trade_listings")
    .insert({
      user_id: m.user.id,
      mezcal_name: mezcalName,
      producer: orNull(clip(input.producer, 255)),
      agave_type: orNull(clip(input.agaveType, 100)),
      abv: orNull(clip(input.abv, 10)),
      bottle_size: orNull(clip(input.bottleSize, 50)),
      condition,
      fill_level: orNull(clip(input.fillLevel, 50)),
      listing_type: listingType,
      asking_price: cents(input.askingPrice),
      seeking_bottles: orNull(clip(input.seekingBottles, 2000)),
      description: orNull(clip(input.description, 2000)),
      location: orNull(clip(input.location, 255)),
    })
    .select("*")
    .single();
  if (error) return fail("create listing", error.message);
  return { ok: true, data: toListing(data as ListingRow, m.user.id) };
}

export async function deleteTradeListing(id: string): Promise<SoulsmokeResult> {
  const rowId = idOf(id);
  if (!rowId) return { ok: false, error: UNAVAILABLE };
  const m = await member();
  if ("error" in m) return m.error;
  const { error } = await m.db.from("soulsmoke_trade_listings").delete().eq("id", rowId).eq("user_id", m.user.id);
  if (error) return fail("delete listing", error.message);
  return { ok: true, data: null };
}

/**
 * tradeBoard.sendMessage: saves the message and emails it to the listing's owner with the
 * sender's email to reply to (the Manus app only stored it, so the seller never saw it).
 */
export async function sendTradeMessage(input: { listingId: string; message: string }): Promise<SoulsmokeResult> {
  const message = clip(input.message, 2000);
  const listingId = idOf(input.listingId);
  if (!message) return { ok: false, error: "Message is required" };
  if (!listingId) return { ok: false, error: UNAVAILABLE };
  const m = await member();
  if ("error" in m) return m.error;
  const { data: listing, error: findError } = await m.db
    .from("soulsmoke_trade_listings")
    .select("id, user_id, mezcal_name, is_active")
    .eq("id", listingId)
    .maybeSingle();
  if (findError) return fail("find listing", findError.message);
  if (!listing || !listing.is_active) return { ok: false, error: "This listing is no longer available." };
  if (listing.user_id === m.user.id) return { ok: false, error: "This is your own listing." };
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count } = await m.db
    .from("soulsmoke_trade_messages")
    .select("id", { count: "exact", head: true })
    .eq("sender_id", m.user.id)
    .gte("created_at", since);
  if ((count ?? 0) >= 10) return { ok: false, error: TOO_MANY };
  const { error } = await m.db
    .from("soulsmoke_trade_messages")
    .insert({ listing_id: listing.id, sender_id: m.user.id, receiver_id: listing.user_id, message });
  if (error) return fail("send message", error.message);
  const { data: owner } = await m.db.auth.admin.getUserById(listing.user_id);
  if (owner?.user?.email) {
    await sendEmail(
      owner.user.email,
      `SoulSmoke Trade Board: a message about ${listing.mezcal_name}`,
      emailTable(
        "A collector sent you a message about your Trade Board listing.",
        [
          ["Bottle", listing.mezcal_name],
          ["Message", message],
          ["Reply to", m.user.email],
        ],
        "/soul-smoke/trade-board",
      ),
    );
  }
  return { ok: true, data: null };
}

// ── Business profiles (leadGen.*BusinessProfile) ──

const BUSINESS_TYPES: BusinessType[] = ["retailer", "bar", "restaurant", "distributor", "importer", "other"];

type ProfileRow = {
  id: number;
  business_type: BusinessType;
  business_name: string;
  contact_name: string | null;
  contact_email: string | null;
  phone: string | null;
  website: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  license_type: string | null;
  annual_volume: string | null;
  focus_categories: string | null;
  bio: string | null;
  is_verified: boolean;
  created_at: string;
};

const toProfile = (r: ProfileRow): StoredBusinessProfile => ({
  businessType: r.business_type,
  businessName: r.business_name,
  contactName: r.contact_name ?? undefined,
  contactEmail: r.contact_email ?? undefined,
  phone: r.phone ?? undefined,
  website: r.website ?? undefined,
  city: r.city ?? undefined,
  state: r.state ?? undefined,
  country: r.country ?? undefined,
  licenseType: r.license_type ?? undefined,
  annualVolume: r.annual_volume ?? undefined,
  focusCategories: r.focus_categories ?? undefined,
  bio: r.bio ?? undefined,
  isVerified: r.is_verified,
  createdAt: r.created_at,
});

export async function getMyBusinessProfile(): Promise<SoulsmokeResult<StoredBusinessProfile | null>> {
  const m = await member();
  if ("error" in m) return m.error;
  const { data, error } = await m.db.from("soulsmoke_business_profiles").select("*").eq("user_id", m.user.id).maybeSingle();
  if (error) return fail("get profile", error.message);
  return { ok: true, data: data ? toProfile(data as ProfileRow) : null };
}

/** Creates the member's profile (and tells Tony), or updates it if they already have one. */
export async function saveBusinessProfile(
  input: Omit<StoredBusinessProfile, "isVerified" | "createdAt">,
): Promise<SoulsmokeResult<StoredBusinessProfile>> {
  const businessName = clip(input.businessName, 255);
  if (!businessName) return { ok: false, error: "Business name is required" };
  if (!BUSINESS_TYPES.includes(input.businessType)) return { ok: false, error: "Choose a business type" };
  const contactEmail = clip(input.contactEmail, 320);
  if (contactEmail && !isEmail(contactEmail)) return { ok: false, error: "That email address doesn't look right." };
  const m = await member();
  if ("error" in m) return m.error;
  const fields = {
    business_type: input.businessType,
    business_name: businessName,
    contact_name: orNull(clip(input.contactName, 255)),
    contact_email: orNull(contactEmail),
    phone: orNull(clip(input.phone, 50)),
    website: orNull(clip(input.website, 500)),
    city: orNull(clip(input.city, 100)),
    state: orNull(clip(input.state, 100)),
    country: orNull(clip(input.country, 100)),
    license_type: orNull(clip(input.licenseType, 100)),
    annual_volume: orNull(clip(input.annualVolume, 50)),
    focus_categories: orNull(clip(input.focusCategories, 1000)),
    bio: orNull(clip(input.bio, 5000)),
  };
  const { data: existing } = await m.db.from("soulsmoke_business_profiles").select("id").eq("user_id", m.user.id).maybeSingle();
  const query = existing
    ? m.db.from("soulsmoke_business_profiles").update({ ...fields, updated_at: new Date().toISOString() }).eq("user_id", m.user.id)
    : m.db.from("soulsmoke_business_profiles").insert({ ...fields, user_id: m.user.id });
  const { data, error } = await query.select("*").single();
  if (error) return fail("save profile", error.message);
  if (!existing) {
    await sendEmail(
      OWNER_EMAIL,
      `SoulSmoke: new business profile, ${businessName}`,
      emailTable(
        `A new ${input.businessType} registered on SoulSmoke.`,
        [
          ["Business", businessName],
          ["Type", input.businessType],
          ["Contact", fields.contact_name],
          ["Email", fields.contact_email ?? m.user.email],
          ["Phone", fields.phone],
          ["Location", [fields.city, fields.state, fields.country].filter(Boolean).join(", ")],
        ],
        "/soul-smoke/business",
      ),
    );
  }
  return { ok: true, data: toProfile(data as ProfileRow) };
}

// ── "I want this bottle" (leadGen.wantBottle) ──

const INTEREST_TYPES: BottleInterestType[] = ["consumer", "retailer", "distributor"];

export async function wantBottle(input: {
  bottleId: string;
  bottleName: string;
  interestType: BottleInterestType;
  quantity: string;
  notes: string;
}): Promise<SoulsmokeResult> {
  const bottleId = clip(input.bottleId, 50);
  const bottleName = clip(input.bottleName, 255);
  if (!bottleId || !bottleName) return { ok: false, error: UNAVAILABLE };
  const interestType = INTEREST_TYPES.includes(input.interestType) ? input.interestType : "consumer";
  const m = await member();
  if ("error" in m) return m.error;
  if (await flooded(m.db, "soulsmoke_bottle_interests", m.user.id, 20)) return { ok: false, error: TOO_MANY };
  const { data: profile } = await m.db.from("soulsmoke_business_profiles").select("id").eq("user_id", m.user.id).maybeSingle();
  const quantity = orNull(clip(input.quantity, 50));
  const notes = orNull(clip(input.notes, 2000));
  const { error } = await m.db.from("soulsmoke_bottle_interests").insert({
    user_id: m.user.id,
    business_profile_id: profile?.id ?? null,
    bottle_id: bottleId,
    bottle_name: bottleName,
    interest_type: interestType,
    quantity,
    notes,
  });
  if (error) return fail("want bottle", error.message);
  await sendEmail(
    OWNER_EMAIL,
    `SoulSmoke: someone wants ${bottleName}`,
    emailTable(
      "Someone wants a bottle on SoulSmoke.",
      [
        ["Bottle", `${bottleName} (${bottleId})`],
        ["Type", interestType],
        ["Quantity", quantity ?? "1 bottle"],
        ["Notes", notes],
        ["Member email", m.user.email],
      ],
      "/soul-smoke/discovery",
    ),
  );
  return { ok: true, data: null };
}
